# Getting Started

## Installation

=== "TypeScript/JavaScript"

    ```bash
    npm install @grokify/echartify
    ```

=== "Go"

    ```bash
    go get github.com/grokify/echartify
    ```

## Basic Usage

### TypeScript

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

### Go

```go
package main

import (
    "encoding/json"
    "fmt"

    "github.com/grokify/echartify/chartir"
    "github.com/grokify/echartify/schema"
)

func main() {
    // Access embedded JSON Schema
    schemaBytes := schema.ChartIRSchemaBytes()
    fmt.Printf("Schema size: %d bytes\n", len(schemaBytes))

    // Use Go types for IR
    ir := chartir.ChartIR{
        Title: "Sales Trend",
        Datasets: []chartir.Dataset{{
            ID: "sales",
            Columns: []chartir.Column{
                {Name: "month", Type: "string"},
                {Name: "revenue", Type: "number"},
            },
            Rows: [][]string{
                {"Jan", "100"},
                {"Feb", "150"},
                {"Mar", "200"},
            },
        }},
        Marks: []chartir.Mark{{
            ID:        "line1",
            DatasetID: "sales",
            Geometry:  chartir.GeometryLine,
            Encode:    chartir.Encode{X: "month", Y: "revenue"},
        }},
    }

    // Serialize to JSON for frontend
    data, _ := json.MarshalIndent(ir, "", "  ")
    fmt.Println(string(data))
}
```

## AI Assistant Integration

EChartify is designed for AI assistants to generate charts reliably:

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

## Visual Demo

Run the interactive demo to see charts rendered from IR:

```bash
cd ts
npm install
npm run demo
# Opens http://localhost:3000 with interactive chart examples
```

## Next Steps

- [Schema Reference](schema-reference.md) - Learn the complete IR specification
- [Examples](examples.md) - See more chart configurations
- [API Reference](api-reference.md) - Explore TypeScript and Go APIs
