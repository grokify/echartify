# Echartify

A non-polymorphic JSON Intermediate Representation (IR) for Apache ECharts that enables AI assistants to reliably generate and validate chart configurations.

## Why Echartify?

Apache ECharts uses a highly polymorphic `option` object where:

- The `series` array changes shape based on `type` (line, bar, pie, scatter, etc.)
- Fields are context-sensitive with implicit defaults
- Cross-field dependencies exist (e.g., coordinate systems affect valid fields)

This polymorphism makes it difficult for AI assistants to generate correct configurations. Echartify solves this with:

| Feature | Benefit |
|---------|---------|
| **Non-polymorphic IR** | Same structure for all chart types |
| **Simple JSON Schema** | No `oneOf`, `anyOf`, or conditional logic |
| **TypeScript-first** | Zod schemas as the source of truth |
| **Deterministic compiler** | IR → ECharts transformation |

## Quick Start

### Installation

```bash
# TypeScript/JavaScript
npm install @grokify/echartify

# Go
go get github.com/grokify/echartify
```

### Basic Usage

```typescript
import { chartIRSchema, compile } from "@grokify/echartify";
import * as echarts from "echarts";

// Define chart using simple, uniform IR
const chartIR = {
  title: "Sales Trend",
  datasets: [{
    id: "sales",
    columns: [
      { name: "month", type: "string" },
      { name: "revenue", type: "number" }
    ],
    rows: [["Jan", "100"], ["Feb", "150"], ["Mar", "200"]]
  }],
  marks: [{
    id: "line1",
    datasetId: "sales",
    geometry: "line",
    encode: { x: "month", y: "revenue" },
    smooth: true
  }],
  axes: [
    { id: "x", type: "category", position: "bottom" },
    { id: "y", type: "value", position: "left" }
  ]
};

// Validate and compile
const validated = chartIRSchema.parse(chartIR);
const option = compile(validated);

// Render
echarts.init(document.getElementById("chart")).setOption(option);
```

## IR Schema Reference

### ChartIR (Top-Level)

```typescript
interface ChartIR {
  title?: string;           // Chart title
  datasets: Dataset[];      // Data sources (required)
  marks: Mark[];            // Visual representations (required)
  axes?: Axis[];            // Chart axes
  legend?: Legend;          // Legend configuration
  tooltip?: Tooltip;        // Tooltip configuration
  grid?: Grid;              // Grid positioning
}
```

### Dataset

```typescript
interface Column {
  name: string;             // Column name
  type: "string" | "number"; // Column data type
}

interface Dataset {
  id: string;               // Unique identifier
  columns: Column[];        // Typed column definitions
  rows: string[][];         // Data rows (all values as strings)
}
```

**Note:** All row values are stored as strings to ensure static type compatibility. The compiler parses numeric strings to numbers based on the column type metadata.

### Mark

```typescript
interface Mark {
  id: string;               // Unique identifier
  datasetId: string;        // Reference to dataset
  geometry: Geometry;       // Visual type (see below)
  encode: Encode;           // Data-to-visual mapping
  coordinateSystem?: CoordinateSystem;
  style?: Style;            // Visual styling
  stack?: string;           // Stack group (for bar)
  smooth?: boolean;         // Smooth curves (for line/area)
  name?: string;            // Display name
}
```

### Enums

| Type | Values |
|------|--------|
| **Geometry** | `line`, `bar`, `pie`, `scatter`, `area` |
| **CoordinateSystem** | `cartesian2d`, `polar`, `radial` |
| **AxisType** | `category`, `value`, `time`, `log` |
| **AxisPosition** | `bottom`, `top`, `left`, `right` |
| **LegendPosition** | `top`, `bottom`, `left`, `right` |
| **TooltipTrigger** | `item`, `axis`, `none` |

### Encode

```typescript
interface Encode {
  x?: string;      // X-axis column (Cartesian)
  y?: string;      // Y-axis column (Cartesian)
  value?: string;  // Value column (pie)
  name?: string;   // Name/label column (pie)
  size?: string;   // Size column (scatter)
  color?: string;  // Color column
}
```

### Style

```typescript
interface Style {
  color?: string;       // Primary color
  opacity?: number;     // 0.0 to 1.0
  borderColor?: string;
  borderWidth?: number;
}
```

## Examples

### Line Chart with Smooth Curves

```json
{
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "x", "type": "string" },
      { "name": "y", "type": "number" }
    ],
    "rows": [["A", "10"], ["B", "20"], ["C", "15"]]
  }],
  "marks": [{
    "id": "line",
    "datasetId": "data",
    "geometry": "line",
    "encode": { "x": "x", "y": "y" },
    "smooth": true,
    "style": { "color": "#5470c6" }
  }],
  "axes": [
    { "id": "x", "type": "category", "position": "bottom" },
    { "id": "y", "type": "value", "position": "left" }
  ]
}
```

### Stacked Bar Chart

```json
{
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "category", "type": "string" },
      { "name": "a", "type": "number" },
      { "name": "b", "type": "number" }
    ],
    "rows": [["X", "10", "20"], ["Y", "15", "25"], ["Z", "20", "30"]]
  }],
  "marks": [
    {
      "id": "bar-a",
      "datasetId": "data",
      "geometry": "bar",
      "encode": { "x": "category", "y": "a" },
      "stack": "total",
      "name": "Series A"
    },
    {
      "id": "bar-b",
      "datasetId": "data",
      "geometry": "bar",
      "encode": { "x": "category", "y": "b" },
      "stack": "total",
      "name": "Series B"
    }
  ],
  "axes": [
    { "id": "x", "type": "category", "position": "bottom" },
    { "id": "y", "type": "value", "position": "left" }
  ],
  "legend": { "show": true, "position": "top" }
}
```

### Pie Chart

```json
{
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "name", "type": "string" },
      { "name": "value", "type": "number" }
    ],
    "rows": [["A", "30"], ["B", "40"], ["C", "30"]]
  }],
  "marks": [{
    "id": "pie",
    "datasetId": "data",
    "geometry": "pie",
    "encode": { "value": "value", "name": "name" }
  }],
  "legend": { "show": true, "position": "right" },
  "tooltip": { "show": true, "trigger": "item" }
}
```

See [`examples/`](examples/) for more complete examples.

## AI Assistant Integration

Echartify is designed for AI assistants to generate charts reliably:

```typescript
import { chartIRSchema, compile } from "@grokify/echartify";

// AI generates JSON
const aiOutput = `{
  "datasets": [{
    "id": "d1",
    "columns": [{"name": "x", "type": "string"}, {"name": "y", "type": "number"}],
    "rows": [["1", "10"], ["2", "20"]]
  }],
  "marks": [{"id": "m1", "datasetId": "d1", "geometry": "line", "encode": {"x": "x", "y": "y"}}]
}`;

// Validate with detailed errors
const result = chartIRSchema.safeParse(JSON.parse(aiOutput));

if (result.success) {
  const option = compile(result.data);
  // Render chart...
} else {
  // Return errors to AI for correction
  console.error(result.error.issues);
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Data Flow                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   AI / User                                             │
│       │                                                 │
│       ▼                                                 │
│   ┌─────────┐                                           │
│   │Chart IR │  ◄── Non-polymorphic JSON                 │
│   └────┬────┘                                           │
│        │                                                │
│        ├──────────────────┐                             │
│        ▼                  ▼                             │
│   ┌─────────┐       ┌───────────┐                       │
│   │  Zod    │       │JSON Schema│──► Go (backend)       │
│   │ Schema  │       │(generated)│                       │
│   └────┬────┘       └───────────┘                       │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                           │
│   │Compiler │                                           │
│   └────┬────┘                                           │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                           │
│   │ ECharts │                                           │
│   │ Option  │                                           │
│   └─────────┘                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Development

### TypeScript

```bash
cd ts
npm install
npm test                  # Run 53 tests
npm run build             # Build dist
npm run generate:schema   # Generate JSON Schema
npm run demo              # Visual demo in browser
```

### Go

```bash
go test -v ./...          # Run 10 tests
```

### Visual Demo

```bash
cd ts
npm run demo
# Opens http://localhost:3000 with interactive chart examples
```

## Project Structure

```
echartify/
├── ts/                          # TypeScript (canonical source)
│   ├── src/
│   │   ├── schema/              # Zod schemas
│   │   │   ├── chartir.ts       # Top-level ChartIR
│   │   │   ├── dataset.ts       # Dataset schema
│   │   │   ├── mark.ts          # Mark, Geometry, Encode
│   │   │   ├── axis.ts          # Axis schemas
│   │   │   ├── style.ts         # Style schema
│   │   │   ├── legend.ts        # Legend schema
│   │   │   ├── tooltip.ts       # Tooltip schema
│   │   │   └── grid.ts          # Grid schema
│   │   ├── compiler/            # IR → ECharts compiler
│   │   │   └── compile.ts
│   │   └── index.ts             # Main exports
│   ├── tests/                   # 53 tests
│   ├── demo/                    # Visual demo
│   └── scripts/
│       └── generate-schema.ts   # JSON Schema generator
│
├── schema/
│   └── chartir.schema.json      # Generated from Zod
│
├── chartir/                     # Go types
│   ├── chartir.go
│   ├── dataset.go
│   ├── mark.go
│   ├── axis.go
│   └── ...
│
├── examples/                    # Example IR documents
│   ├── line-chart.json
│   ├── bar-chart.json
│   ├── pie-chart.json
│   └── multi-series.json
│
├── PRD.md                       # Product requirements
├── TRD.md                       # Technical requirements
├── TASKS.md                     # Implementation tasks
└── go.mod                       # Go module
```

## API Reference

### TypeScript Exports

```typescript
// Schemas (Zod)
export { chartIRSchema, datasetSchema, columnSchema, markSchema, axisSchema, ... }

// Types (inferred from Zod)
export type { ChartIR, Dataset, Column, ColumnType, Mark, Axis, Geometry, ... }

// Compiler
export { compile }

// Helpers
export { isHorizontalAxis, isVerticalAxis }
```

### Go Exports

```go
// Package chartir - IR types
type ChartIR struct { ... }
type Dataset struct { ... }
type Column struct { Name, Type string }
type ColumnType string  // "string" | "number"
type Mark struct { ... }
// ...

// Package schema - Embedded JSON Schema
var ChartIRSchema string
func ChartIRSchemaBytes() []byte
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run `npm test` (TypeScript) and `go test ./...` (Go)
5. Submit a pull request

## License

MIT
