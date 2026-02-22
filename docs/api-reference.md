# API Reference

EChartify provides APIs for both TypeScript/JavaScript and Go.

## TypeScript API

### Installation

```bash
npm install @grokify/echartify
```

### Schemas (Zod)

Zod schemas for runtime validation.

```typescript
import {
  chartIRSchema,
  datasetSchema,
  columnSchema,
  markSchema,
  axisSchema,
  legendSchema,
  tooltipSchema,
  gridSchema,
  styleSchema,
  encodeSchema,
  geometrySchema,
  coordinateSystemSchema,
  axisTypeSchema,
  axisPositionSchema,
  legendPositionSchema,
  tooltipTriggerSchema,
} from "@grokify/echartify";
```

#### `chartIRSchema`

The main schema for validating complete chart IR documents.

```typescript
// Strict validation (throws on error)
const ir = chartIRSchema.parse(jsonData);

// Safe validation (returns result object)
const result = chartIRSchema.safeParse(jsonData);
if (result.success) {
  const ir = result.data;
} else {
  console.error(result.error.issues);
}
```

### Types

TypeScript types inferred from Zod schemas.

```typescript
import type {
  ChartIR,
  Dataset,
  Column,
  ColumnType,
  Mark,
  Axis,
  Legend,
  Tooltip,
  Grid,
  Style,
  Encode,
  Geometry,
  CoordinateSystem,
  AxisType,
  AxisPosition,
  LegendPosition,
  TooltipTrigger,
} from "@grokify/echartify";
```

### Compiler

Transform validated IR to ECharts options.

```typescript
import { compile } from "@grokify/echartify";

const option = compile(validatedIR);
// Returns EChartsOption ready for setOption()
```

#### `compile(ir: ChartIR): EChartsOption`

Compiles a validated ChartIR document to an ECharts option object.

**Parameters:**

- `ir` - A validated ChartIR object

**Returns:**

- ECharts option object compatible with `chart.setOption()`

**Features:**

- Converts string values to numbers based on column type metadata
- Maps geometry types to ECharts series types
- Translates encode fields to ECharts encode format
- Applies styling options (lineStyle, itemStyle, areaStyle)

### Helpers

Utility functions for working with IR.

```typescript
import { isHorizontalAxis, isVerticalAxis } from "@grokify/echartify";

// Check axis orientation
if (isHorizontalAxis(axis)) {
  // axis.position is "bottom" or "top"
}

if (isVerticalAxis(axis)) {
  // axis.position is "left" or "right"
}
```

### Complete Example

```typescript
import { chartIRSchema, compile } from "@grokify/echartify";
import type { ChartIR } from "@grokify/echartify";
import * as echarts from "echarts";

// Type-safe IR definition
const ir: ChartIR = {
  title: "Sales",
  datasets: [{
    id: "data",
    columns: [
      { name: "month", type: "string" },
      { name: "sales", type: "number" }
    ],
    rows: [["Jan", "100"], ["Feb", "200"]]
  }],
  marks: [{
    id: "line",
    datasetId: "data",
    geometry: "line",
    encode: { x: "month", y: "sales" }
  }]
};

// Validate
const validated = chartIRSchema.parse(ir);

// Compile
const option = compile(validated);

// Render
const chart = echarts.init(document.getElementById("chart")!);
chart.setOption(option);
```

---

## Go API

### Installation

```bash
go get github.com/grokify/echartify
```

### Package `chartir`

Go types for the Chart IR schema.

```go
import "github.com/grokify/echartify/chartir"
```

#### Types

```go
// ChartIR is the top-level chart definition
type ChartIR struct {
    Title    string    `json:"title,omitempty"`
    Datasets []Dataset `json:"datasets"`
    Marks    []Mark    `json:"marks"`
    Axes     []Axis    `json:"axes,omitempty"`
    Legend   *Legend   `json:"legend,omitempty"`
    Tooltip  *Tooltip  `json:"tooltip,omitempty"`
    Grid     *Grid     `json:"grid,omitempty"`
}

// Dataset represents a data source
type Dataset struct {
    ID      string     `json:"id"`
    Columns []Column   `json:"columns"`
    Rows    [][]string `json:"rows"`
}

// Column defines a data column with type
type Column struct {
    Name string     `json:"name"`
    Type ColumnType `json:"type"`
}

// ColumnType is "string" or "number"
type ColumnType string

const (
    ColumnTypeString ColumnType = "string"
    ColumnTypeNumber ColumnType = "number"
)

// Mark represents a visual mark (series)
type Mark struct {
    ID               string           `json:"id"`
    DatasetID        string           `json:"datasetId"`
    Geometry         Geometry         `json:"geometry"`
    Encode           Encode           `json:"encode"`
    CoordinateSystem CoordinateSystem `json:"coordinateSystem,omitempty"`
    Style            *Style           `json:"style,omitempty"`
    Stack            string           `json:"stack,omitempty"`
    Smooth           bool             `json:"smooth,omitempty"`
    Name             string           `json:"name,omitempty"`
}
```

#### Geometry Constants

```go
const (
    GeometryLine    Geometry = "line"
    GeometryBar     Geometry = "bar"
    GeometryPie     Geometry = "pie"
    GeometryScatter Geometry = "scatter"
    GeometryArea    Geometry = "area"
)
```

#### AxisType Constants

```go
const (
    AxisTypeCategory AxisType = "category"
    AxisTypeValue    AxisType = "value"
    AxisTypeTime     AxisType = "time"
    AxisTypeLog      AxisType = "log"
)
```

### Package `schema`

Embedded JSON Schema for validation.

```go
import "github.com/grokify/echartify/schema"
```

#### Variables

```go
// ChartIRSchema is the embedded JSON Schema as a string
var ChartIRSchema string
```

#### Functions

```go
// ChartIRSchemaBytes returns the schema as a byte slice
func ChartIRSchemaBytes() []byte
```

### Complete Example

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"

    "github.com/grokify/echartify/chartir"
    "github.com/grokify/echartify/schema"
)

func main() {
    // Create chart IR
    ir := chartir.ChartIR{
        Title: "Sales Report",
        Datasets: []chartir.Dataset{{
            ID: "sales",
            Columns: []chartir.Column{
                {Name: "month", Type: chartir.ColumnTypeString},
                {Name: "revenue", Type: chartir.ColumnTypeNumber},
            },
            Rows: [][]string{
                {"Jan", "1000"},
                {"Feb", "1500"},
                {"Mar", "1200"},
            },
        }},
        Marks: []chartir.Mark{{
            ID:        "line",
            DatasetID: "sales",
            Geometry:  chartir.GeometryLine,
            Encode: chartir.Encode{
                X: "month",
                Y: "revenue",
            },
            Smooth: true,
        }},
        Axes: []chartir.Axis{
            {ID: "x", Type: chartir.AxisTypeCategory, Position: chartir.AxisPositionBottom},
            {ID: "y", Type: chartir.AxisTypeValue, Position: chartir.AxisPositionLeft},
        },
    }

    // Serialize to JSON
    data, err := json.MarshalIndent(ir, "", "  ")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(string(data))

    // Access schema for validation
    fmt.Printf("\nSchema size: %d bytes\n", len(schema.ChartIRSchemaBytes()))
}
```

### JSON Schema Validation

Use the embedded schema with a JSON Schema validator:

```go
import (
    "github.com/grokify/echartify/schema"
    "github.com/santhosh-tekuri/jsonschema/v5"
)

func validateIR(jsonData []byte) error {
    sch, err := jsonschema.CompileString("chartir.schema.json", schema.ChartIRSchema)
    if err != nil {
        return err
    }

    var v interface{}
    if err := json.Unmarshal(jsonData, &v); err != nil {
        return err
    }

    return sch.Validate(v)
}
```
