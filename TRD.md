# Echartify - Technical Requirements Document

## Architecture Overview

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
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │ TypeScript  │ ──► │ JSON Schema │ ──► │  Go Types   │       │
│  │ Zod Schemas │     │ (Generated) │     │ (Secondary) │       │
│  │  (SOURCE)   │     └──────┬──────┘     └─────────────┘       │
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

## IR Schema Design

### Top-Level Structure

```go
// ChartIR is the top-level chart intermediate representation.
type ChartIR struct {
    Title    string     `json:"title,omitempty"`
    Datasets []Dataset  `json:"datasets"`
    Marks    []Mark     `json:"marks"`
    Axes     []Axis     `json:"axes,omitempty"`
    Legend   *Legend    `json:"legend,omitempty"`
    Tooltip  *Tooltip   `json:"tooltip,omitempty"`
    Grid     *Grid      `json:"grid,omitempty"`
}
```

### Dataset (Uniform Tabular Data with Typed Columns)

```typescript
// TypeScript/Zod (source of truth)
const columnTypeSchema = z.enum(["string", "number"]);
const columnSchema = z.object({
  name: z.string(),
  type: columnTypeSchema,
});
const datasetSchema = z.object({
  id: z.string(),
  columns: z.array(columnSchema),
  rows: z.array(z.array(z.string())),
});
```

```go
// Go (secondary, for persistence)
type ColumnType string
const (
    ColumnTypeString ColumnType = "string"
    ColumnTypeNumber ColumnType = "number"
)

type Column struct {
    Name string     `json:"name"`
    Type ColumnType `json:"type"`
}

type Dataset struct {
    ID      string     `json:"id"`
    Columns []Column   `json:"columns"`
    Rows    [][]string `json:"rows"`
}
```

**Rationale**:
- Always tabular with typed columns for schema compliance
- All values stored as strings for static type safety (passes schemalint strict check)
- Column type metadata enables compiler to parse values correctly
- No mixed-type arrays (`string | number | null`) that degrade to `interface{}` in Go

### Mark (Replaces Polymorphic "series")

```go
// Geometry defines the visual representation type.
type Geometry string

const (
    GeometryLine    Geometry = "line"
    GeometryBar     Geometry = "bar"
    GeometryPie     Geometry = "pie"
    GeometryScatter Geometry = "scatter"
    GeometryArea    Geometry = "area"
)

// CoordinateSystem defines the coordinate system type.
type CoordinateSystem string

const (
    CoordinateCartesian2D CoordinateSystem = "cartesian2d"
    CoordinatePolar       CoordinateSystem = "polar"
    CoordinateRadial      CoordinateSystem = "radial"
)

// Mark defines a visual mark (equivalent to ECharts series).
type Mark struct {
    ID               string           `json:"id"`
    DatasetID        string           `json:"datasetId"`
    Geometry         Geometry         `json:"geometry"`
    CoordinateSystem CoordinateSystem `json:"coordinateSystem,omitempty"`
    Encode           Encode           `json:"encode"`
    Style            *Style           `json:"style,omitempty"`
    Stack            string           `json:"stack,omitempty"`
    Smooth           bool             `json:"smooth,omitempty"`
}

// Encode maps data columns to visual channels.
type Encode struct {
    X     string `json:"x,omitempty"`
    Y     string `json:"y,omitempty"`
    Value string `json:"value,omitempty"`
    Name  string `json:"name,omitempty"`
    Size  string `json:"size,omitempty"`
    Color string `json:"color,omitempty"`
}
```

**Key Design Decision**: All marks have the same structure. The `geometry` field is an enum, not a discriminator that changes shape.

### Axis (Uniform)

```go
// AxisType defines the axis scale type.
type AxisType string

const (
    AxisTypeCategory AxisType = "category"
    AxisTypeValue    AxisType = "value"
    AxisTypeTime     AxisType = "time"
    AxisTypeLog      AxisType = "log"
)

// AxisPosition defines axis placement.
type AxisPosition string

const (
    AxisPositionBottom AxisPosition = "bottom"
    AxisPositionTop    AxisPosition = "top"
    AxisPositionLeft   AxisPosition = "left"
    AxisPositionRight  AxisPosition = "right"
)

// Axis defines a chart axis.
type Axis struct {
    ID       string       `json:"id"`
    Type     AxisType     `json:"type"`
    Position AxisPosition `json:"position"`
    Name     string       `json:"name,omitempty"`
    Min      *float64     `json:"min,omitempty"`
    Max      *float64     `json:"max,omitempty"`
}
```

### Style (Flat, Non-Nested)

```go
// Style defines visual styling properties.
type Style struct {
    Color       string   `json:"color,omitempty"`
    Opacity     *float64 `json:"opacity,omitempty"`
    BorderColor string   `json:"borderColor,omitempty"`
    BorderWidth *float64 `json:"borderWidth,omitempty"`
}
```

### Supporting Types

```go
// Legend defines legend configuration.
type Legend struct {
    Show     bool     `json:"show,omitempty"`
    Position string   `json:"position,omitempty"`
    Items    []string `json:"items,omitempty"`
}

// Tooltip defines tooltip configuration.
type Tooltip struct {
    Show    bool   `json:"show,omitempty"`
    Trigger string `json:"trigger,omitempty"`
}

// Grid defines the chart grid/container.
type Grid struct {
    Left   string `json:"left,omitempty"`
    Right  string `json:"right,omitempty"`
    Top    string `json:"top,omitempty"`
    Bottom string `json:"bottom,omitempty"`
}
```

## Example IR Document

```json
{
  "title": "Monthly Revenue",
  "datasets": [
    {
      "id": "revenue",
      "columns": [
        { "name": "month", "type": "string" },
        { "name": "sales", "type": "number" },
        { "name": "profit", "type": "number" }
      ],
      "rows": [
        ["Jan", "120", "20"],
        ["Feb", "200", "45"],
        ["Mar", "150", "30"],
        ["Apr", "180", "40"]
      ]
    }
  ],
  "marks": [
    {
      "id": "sales-line",
      "datasetId": "revenue",
      "geometry": "line",
      "coordinateSystem": "cartesian2d",
      "encode": {
        "x": "month",
        "y": "sales"
      },
      "style": {
        "color": "#5470c6"
      },
      "smooth": true
    },
    {
      "id": "profit-bar",
      "datasetId": "revenue",
      "geometry": "bar",
      "encode": {
        "x": "month",
        "y": "profit"
      },
      "style": {
        "color": "#91cc75",
        "opacity": 0.7
      }
    }
  ],
  "axes": [
    {
      "id": "x",
      "type": "category",
      "position": "bottom"
    },
    {
      "id": "y",
      "type": "value",
      "position": "left"
    }
  ],
  "legend": {
    "show": true,
    "position": "top"
  },
  "tooltip": {
    "show": true,
    "trigger": "axis"
  }
}
```

**Note**: All data values in `rows` are strings. The compiler parses them to numbers based on the column `type` metadata.

## Compilation Strategy

The TypeScript compiler transforms IR → ECharts `option`:

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

### Geometry → Series Type Mapping

| IR Geometry | ECharts Type | Notes |
|-------------|--------------|-------|
| `line` | `line` | |
| `bar` | `bar` | |
| `pie` | `pie` | Requires radial coordinate |
| `scatter` | `scatter` | |
| `area` | `line` | With `areaStyle` |

### Compiler Pseudocode

```typescript
function compile(ir: ChartIR): EChartsOption {
  return {
    title: ir.title ? { text: ir.title } : undefined,
    dataset: ir.datasets.map(compileDataset),
    series: ir.marks.map(compileMark),
    xAxis: ir.axes.filter(a => isXAxis(a)).map(compileAxis),
    yAxis: ir.axes.filter(a => isYAxis(a)).map(compileAxis),
    legend: ir.legend ? compileLegend(ir.legend) : undefined,
    tooltip: ir.tooltip ? compileTooltip(ir.tooltip) : undefined,
    grid: ir.grid ? compileGrid(ir.grid) : undefined,
  };
}

function compileMark(mark: Mark): EChartsSeries {
  const base = {
    type: mapGeometry(mark.geometry),
    datasetId: mark.datasetId,
    encode: mark.encode,
  };

  // Handle geometry-specific options
  if (mark.geometry === 'line' || mark.geometry === 'area') {
    return {
      ...base,
      smooth: mark.smooth,
      areaStyle: mark.geometry === 'area' ? {} : undefined,
      lineStyle: mark.style ? { color: mark.style.color } : undefined,
    };
  }

  if (mark.geometry === 'bar') {
    return {
      ...base,
      stack: mark.stack,
      itemStyle: mark.style ? compileStyle(mark.style) : undefined,
    };
  }

  // ... other geometries
  return base;
}
```

## Project Structure

```
echartify/
├── go.mod
├── go.sum
├── PRD.md
├── TRD.md
├── TASKS.md
├── README.md
│
├── ts/                          # TypeScript (SOURCE OF TRUTH)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── src/
│   │   ├── schema/              # Zod schemas (canonical)
│   │   │   ├── index.ts
│   │   │   ├── chartir.ts
│   │   │   ├── dataset.ts       # Column, ColumnType, Dataset
│   │   │   ├── mark.ts
│   │   │   ├── axis.ts
│   │   │   ├── style.ts
│   │   │   ├── legend.ts
│   │   │   ├── tooltip.ts
│   │   │   └── grid.ts
│   │   ├── compiler/            # IR → ECharts compiler
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── compile.ts
│   │   ├── types.ts             # Exported types
│   │   └── index.ts             # Main entry
│   ├── scripts/
│   │   └── generate-schema.ts   # JSON Schema generator
│   ├── tests/
│   │   ├── schema.test.ts       # 19 tests
│   │   ├── compiler.test.ts     # 22 tests
│   │   └── examples.test.ts     # 12 tests
│   └── demo/
│       └── index.html           # Visual demo
│
├── schema/                      # Generated JSON Schema
│   ├── schema.go                # Go embed
│   ├── schema_test.go
│   └── chartir.schema.json      # Generated from Zod
│
├── chartir/                     # Go IR types (secondary)
│   ├── chartir.go
│   ├── dataset.go
│   ├── mark.go
│   ├── axis.go
│   ├── style.go
│   ├── legend.go
│   ├── tooltip.go
│   ├── grid.go
│   └── chartir_test.go          # 8 tests
│
└── examples/                    # Example IR documents
    ├── line-chart.json
    ├── bar-chart.json
    ├── pie-chart.json
    └── multi-series.json
```

## Schema Generation

Using `zod-to-json-schema` (TypeScript-first):

```typescript
// ts/scripts/generate-schema.ts
import { zodToJsonSchema } from "zod-to-json-schema";
import { chartIRSchema } from "../src/schema/index.js";
import { writeFileSync } from "fs";

const jsonSchema = zodToJsonSchema(chartIRSchema, {
  name: "ChartIR",
  $refStrategy: "root",
});

// Add schema metadata
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://github.com/grokify/echartify/schema/chartir.schema.json",
  title: "Echartify Chart IR",
  description: "A non-polymorphic intermediate representation for Apache ECharts configurations.",
  ...jsonSchema,
};

writeFileSync("../schema/chartir.schema.json", JSON.stringify(schema, null, 2));
```

Run with:
```bash
cd ts && npm run generate:schema
```

The generated schema passes `schemalint lint --profile scale` for static type compatibility.

## Validation Strategy

### Backend (Go)

1. Unmarshal JSON to `ChartIR` struct
2. Validate required fields
3. Validate enum values
4. Store as JSONB in PostgreSQL

### Frontend (TypeScript)

1. Parse JSON with Zod schema
2. Type-safe access to IR
3. Compile to ECharts option
4. Render with ECharts

## Dependencies

### TypeScript (Source of Truth)

| Package | Purpose |
|---------|---------|
| `zod` | Runtime validation schemas |
| `zod-to-json-schema` | JSON Schema generation |
| `echarts` | Type definitions for compiler |
| `vitest` | Testing framework |
| `tsx` | TypeScript execution |

### Go (Secondary)

| Package | Purpose |
|---------|---------|
| `github.com/invopop/jsonschema` | JSON Schema generation (optional) |

## Testing Strategy

### TypeScript (53 tests)

1. **Schema Tests** (19): Zod schema validation, enum coverage, helper functions
2. **Compiler Tests** (22): IR → ECharts transformation, geometry-specific compilation
3. **Example Tests** (12): All example JSON files validate and compile correctly

### Go (10 tests)

1. **Struct Tests** (8): Go type validation, enum coverage, JSON marshaling
2. **Schema Tests** (2): Embedded JSON Schema is valid JSON

### Total: 63 tests

## Migration Path

For existing systems using raw ECharts options:

1. Create adapter: `EChartsOption → ChartIR` (lossy, best-effort)
2. Validate migrated IR
3. Compile back to ECharts to verify equivalence
4. Gradually adopt IR for new charts

## Resolved Design Decisions

1. **Dataset references**: Marks reference datasets by ID (`datasetId` field) ✅
2. **Data encoding**: All values stored as strings with column type metadata for static type safety ✅
3. **Schema compliance**: IR passes schemalint strict check (no mixed-type arrays) ✅

## Open Questions

1. **Multi-axis support**: How to handle charts with multiple Y axes?
2. **Theme integration**: Should IR include theme references or inline styles?
3. **Animation**: Include in IR or leave to ECharts defaults?
4. **Go struct generation**: Generate Go structs from JSON Schema or maintain manually?
