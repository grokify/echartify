# Architecture

This document describes the technical architecture of EChartify.

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  TypeScript-First Data Flow                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI Assistant / User                                            │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │  Chart IR   │  ◄── Non-polymorphic JSON                      │
│  │   (JSON)    │                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐        │
│  │ TypeScript  │ ──► │ JSON Schema │ ──► │  Go Types   │        │
│  │ Zod Schemas │     │ (Generated) │     │ (Secondary) │        │
│  │  (SOURCE)   │     └──────┬──────┘     └─────────────┘        │
│  └──────┬──────┘            │                                   │
│         │                   ▼                                   │
│         │            ┌─────────────┐                            │
│         │            │  Backend    │                            │
│         │            │ Validation  │                            │
│         │            └─────────────┘                            │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │  Compiler   │                                                │
│  │ (TypeScript)│                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │  ECharts    │                                                │
│  │   Option    │                                                │
│  └─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Design Principles

1. **TypeScript/Zod schemas are the source of truth** - Canonical IR definition in TypeScript
2. **Non-polymorphic IR** - Single shape for all chart types
3. **Compiler handles complexity** - Polymorphism resolved at compile time
4. **Layered architecture** - Separate data, geometry, encoding, style
5. **Generated artifacts** - JSON Schema and Go types derived from Zod

## Why Non-Polymorphic?

Apache ECharts uses a polymorphic `option` object:

```javascript
// ECharts: Shape changes based on type
{
  series: [
    { type: "line", data: [...], smooth: true },
    { type: "pie", data: [...], radius: "50%" }  // Different structure!
  ]
}
```

This causes problems:

- **AI generation errors** - LLMs mix up fields between chart types
- **Schema complexity** - JSON Schema requires `oneOf`/`anyOf` discriminators
- **Type degradation** - Go types become `interface{}` for union types

EChartify solves this with uniform structure:

```json
{
  "marks": [
    { "id": "line", "geometry": "line", "encode": { "x": "a", "y": "b" }, "smooth": true },
    { "id": "pie", "geometry": "pie", "encode": { "value": "v", "name": "n" } }
  ]
}
```

All marks have the same shape. The `geometry` field is an enum, not a discriminator that changes structure.

## Compilation Strategy

The compiler transforms IR → ECharts options:

### Mapping Rules

| IR Concept | ECharts Equivalent |
|------------|-------------------|
| `ChartIR.title` | `option.title.text` |
| `ChartIR.datasets` | `option.dataset` |
| `ChartIR.marks` | `option.series` |
| `ChartIR.axes` | `option.xAxis` / `option.yAxis` |
| `Mark.geometry` | `series.type` |
| `Mark.encode` | `series.encode` |
| `Mark.style` | `series.itemStyle` / `series.lineStyle` |

### Geometry → Series Type

| IR Geometry | ECharts Type | Notes |
|-------------|--------------|-------|
| `line` | `line` | |
| `bar` | `bar` | |
| `pie` | `pie` | Uses value/name encoding |
| `scatter` | `scatter` | |
| `area` | `line` | With `areaStyle` |

### Data Type Coercion

All dataset values are stored as strings for schema compliance:

```json
{
  "columns": [
    { "name": "month", "type": "string" },
    { "name": "sales", "type": "number" }
  ],
  "rows": [
    ["Jan", "1000"],
    ["Feb", "1500"]
  ]
}
```

The compiler parses string values to numbers based on column type metadata.

## Project Structure

```
echartify/
├── ts/                          # TypeScript (SOURCE OF TRUTH)
│   ├── src/
│   │   ├── schema/              # Zod schemas (canonical)
│   │   │   ├── chartir.ts
│   │   │   ├── dataset.ts
│   │   │   ├── mark.ts
│   │   │   └── ...
│   │   ├── compiler/            # IR → ECharts compiler
│   │   │   └── compile.ts
│   │   └── index.ts
│   ├── scripts/
│   │   └── generate-schema.ts   # JSON Schema generator
│   └── tests/                   # 53 tests
│
├── schema/                      # Generated JSON Schema
│   ├── schema.go                # Go embed
│   └── chartir.schema.json
│
├── chartir/                     # Go IR types (secondary)
│   ├── chartir.go
│   ├── dataset.go
│   └── ...
│
└── examples/                    # Example IR documents
```

## Schema Generation

JSON Schema is generated from Zod using `zod-to-json-schema`:

```bash
cd ts && npm run generate:schema
```

This produces `schema/chartir.schema.json` which:

- Passes `schemalint lint --profile scale` for static type compatibility
- Contains no `oneOf`/`anyOf` discriminators
- Can be used for validation in any language

## Validation Strategy

### Frontend (TypeScript)

```typescript
import { chartIRSchema, compile } from "@grokify/echartify";

const result = chartIRSchema.safeParse(jsonData);
if (result.success) {
  const option = compile(result.data);
}
```

### Backend (Go)

```go
import "github.com/grokify/echartify/chartir"

var ir chartir.ChartIR
json.Unmarshal(data, &ir)
// Use embedded schema for additional validation if needed
```

## Dependencies

### TypeScript

| Package | Purpose |
|---------|---------|
| `zod` | Runtime validation schemas |
| `zod-to-json-schema` | JSON Schema generation |
| `echarts` | Type definitions |

### Go

| Package | Purpose |
|---------|---------|
| `github.com/invopop/jsonschema` | Schema generation (optional) |

## Test Coverage

| Component | Tests | Coverage |
|-----------|-------|----------|
| TypeScript Schema | 19 | Enum values, validation, helpers |
| TypeScript Compiler | 22 | Geometry mapping, style compilation |
| TypeScript Examples | 12 | All example files |
| Go Types | 8 | JSON marshaling, enum coverage |
| Go Schema | 2 | Schema embedding |
| **Total** | **63** | |

## Future Considerations

1. **Multi-axis support** - Charts with multiple Y axes
2. **Theme integration** - Theme references vs inline styles
3. **Additional geometries** - Radar, heatmap, treemap
4. **Go compiler** - Full compilation in Go for backend rendering
