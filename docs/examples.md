# Examples

This page shows complete EChartify IR examples for common chart types.

## Line Chart

A simple line chart with smooth curves.

```json
{
  "title": "Weekly Sales Trend",
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "week", "type": "string" },
      { "name": "sales", "type": "number" }
    ],
    "rows": [
      ["Week 1", "1000"],
      ["Week 2", "1500"],
      ["Week 3", "1200"],
      ["Week 4", "1800"],
      ["Week 5", "2000"]
    ]
  }],
  "marks": [{
    "id": "line",
    "datasetId": "data",
    "geometry": "line",
    "encode": { "x": "week", "y": "sales" },
    "smooth": true,
    "style": { "color": "#5470c6" }
  }],
  "axes": [
    { "id": "x", "type": "category", "position": "bottom" },
    { "id": "y", "type": "value", "position": "left", "name": "Sales ($)" }
  ],
  "tooltip": { "show": true, "trigger": "axis" }
}
```

## Bar Chart

A vertical bar chart with styling.

```json
{
  "title": "Monthly Revenue",
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "month", "type": "string" },
      { "name": "revenue", "type": "number" }
    ],
    "rows": [
      ["Jan", "4200"],
      ["Feb", "3800"],
      ["Mar", "5100"],
      ["Apr", "4600"],
      ["May", "5800"]
    ]
  }],
  "marks": [{
    "id": "bar",
    "datasetId": "data",
    "geometry": "bar",
    "encode": { "x": "month", "y": "revenue" },
    "style": {
      "color": "#91cc75",
      "borderColor": "#73a857",
      "borderWidth": 1
    }
  }],
  "axes": [
    { "id": "x", "type": "category", "position": "bottom" },
    { "id": "y", "type": "value", "position": "left" }
  ]
}
```

## Stacked Bar Chart

Multiple series stacked on top of each other.

```json
{
  "title": "Quarterly Sales by Region",
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "quarter", "type": "string" },
      { "name": "north", "type": "number" },
      { "name": "south", "type": "number" },
      { "name": "east", "type": "number" }
    ],
    "rows": [
      ["Q1", "1000", "800", "1200"],
      ["Q2", "1200", "900", "1100"],
      ["Q3", "1100", "1000", "1300"],
      ["Q4", "1400", "1100", "1500"]
    ]
  }],
  "marks": [
    {
      "id": "north",
      "datasetId": "data",
      "geometry": "bar",
      "encode": { "x": "quarter", "y": "north" },
      "stack": "total",
      "name": "North"
    },
    {
      "id": "south",
      "datasetId": "data",
      "geometry": "bar",
      "encode": { "x": "quarter", "y": "south" },
      "stack": "total",
      "name": "South"
    },
    {
      "id": "east",
      "datasetId": "data",
      "geometry": "bar",
      "encode": { "x": "quarter", "y": "east" },
      "stack": "total",
      "name": "East"
    }
  ],
  "axes": [
    { "id": "x", "type": "category", "position": "bottom" },
    { "id": "y", "type": "value", "position": "left" }
  ],
  "legend": { "show": true, "position": "top" }
}
```

## Pie Chart

A pie chart with legend and tooltips.

```json
{
  "title": "Market Share",
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "company", "type": "string" },
      { "name": "share", "type": "number" }
    ],
    "rows": [
      ["Company A", "35"],
      ["Company B", "28"],
      ["Company C", "22"],
      ["Company D", "15"]
    ]
  }],
  "marks": [{
    "id": "pie",
    "datasetId": "data",
    "geometry": "pie",
    "encode": { "value": "share", "name": "company" }
  }],
  "legend": { "show": true, "position": "right" },
  "tooltip": { "show": true, "trigger": "item" }
}
```

## Scatter Plot

A scatter plot for correlation analysis.

```json
{
  "title": "Height vs Weight",
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "height", "type": "number" },
      { "name": "weight", "type": "number" }
    ],
    "rows": [
      ["165", "60"],
      ["170", "65"],
      ["175", "72"],
      ["180", "80"],
      ["185", "85"],
      ["168", "62"],
      ["172", "68"],
      ["178", "75"]
    ]
  }],
  "marks": [{
    "id": "scatter",
    "datasetId": "data",
    "geometry": "scatter",
    "encode": { "x": "height", "y": "weight" },
    "style": { "color": "#ee6666", "opacity": 0.8 }
  }],
  "axes": [
    { "id": "x", "type": "value", "position": "bottom", "name": "Height (cm)" },
    { "id": "y", "type": "value", "position": "left", "name": "Weight (kg)" }
  ],
  "tooltip": { "show": true, "trigger": "item" }
}
```

## Area Chart

An area chart with gradient fill.

```json
{
  "title": "Website Traffic",
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "date", "type": "string" },
      { "name": "visitors", "type": "number" }
    ],
    "rows": [
      ["Mon", "820"],
      ["Tue", "932"],
      ["Wed", "901"],
      ["Thu", "934"],
      ["Fri", "1290"],
      ["Sat", "1330"],
      ["Sun", "1120"]
    ]
  }],
  "marks": [{
    "id": "area",
    "datasetId": "data",
    "geometry": "area",
    "encode": { "x": "date", "y": "visitors" },
    "smooth": true,
    "style": { "color": "#5470c6", "opacity": 0.7 }
  }],
  "axes": [
    { "id": "x", "type": "category", "position": "bottom" },
    { "id": "y", "type": "value", "position": "left" }
  ]
}
```

## Multi-Series Line Chart

Multiple lines on the same chart.

```json
{
  "title": "Temperature Comparison",
  "datasets": [{
    "id": "data",
    "columns": [
      { "name": "month", "type": "string" },
      { "name": "tokyo", "type": "number" },
      { "name": "london", "type": "number" },
      { "name": "sydney", "type": "number" }
    ],
    "rows": [
      ["Jan", "7", "5", "26"],
      ["Feb", "8", "6", "26"],
      ["Mar", "11", "9", "24"],
      ["Apr", "15", "12", "21"],
      ["May", "19", "15", "17"],
      ["Jun", "22", "18", "14"]
    ]
  }],
  "marks": [
    {
      "id": "tokyo",
      "datasetId": "data",
      "geometry": "line",
      "encode": { "x": "month", "y": "tokyo" },
      "name": "Tokyo",
      "style": { "color": "#5470c6" }
    },
    {
      "id": "london",
      "datasetId": "data",
      "geometry": "line",
      "encode": { "x": "month", "y": "london" },
      "name": "London",
      "style": { "color": "#91cc75" }
    },
    {
      "id": "sydney",
      "datasetId": "data",
      "geometry": "line",
      "encode": { "x": "month", "y": "sydney" },
      "name": "Sydney",
      "style": { "color": "#ee6666" }
    }
  ],
  "axes": [
    { "id": "x", "type": "category", "position": "bottom" },
    { "id": "y", "type": "value", "position": "left", "name": "°C" }
  ],
  "legend": { "show": true, "position": "top" },
  "tooltip": { "show": true, "trigger": "axis" }
}
```

## Using Examples

### TypeScript

```typescript
import { chartIRSchema, compile } from "@grokify/echartify";
import * as echarts from "echarts";

// Parse and validate the IR
const ir = chartIRSchema.parse(exampleJson);

// Compile to ECharts option
const option = compile(ir);

// Render
const chart = echarts.init(document.getElementById("chart"));
chart.setOption(option);
```

### More Examples

See the [`examples/`](https://github.com/grokify/echartify/tree/main/examples) directory for additional JSON files, or run the interactive demo:

```bash
cd ts
npm run demo
```
