# Schema Reference

The EChartify IR (Intermediate Representation) provides a non-polymorphic schema for defining charts. This page documents all types and their properties.

## ChartIR (Top-Level)

The root object containing all chart configuration.

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

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | No | Chart title displayed at top |
| `datasets` | Dataset[] | Yes | One or more data sources |
| `marks` | Mark[] | Yes | Visual representations of data |
| `axes` | Axis[] | No | X and Y axis configurations |
| `legend` | Legend | No | Legend display settings |
| `tooltip` | Tooltip | No | Tooltip behavior settings |
| `grid` | Grid | No | Chart area positioning |

## Dataset

Data source with typed columns and string-based rows.

```typescript
interface Dataset {
  id: string;               // Unique identifier
  columns: Column[];        // Typed column definitions
  rows: string[][];         // Data rows (all values as strings)
}

interface Column {
  name: string;             // Column name
  type: "string" | "number"; // Column data type
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier referenced by marks |
| `columns` | Column[] | Yes | Column definitions with name and type |
| `rows` | string[][] | Yes | Data rows as string arrays |

!!! note "String-Based Values"
    All row values are stored as strings to ensure static type compatibility. The compiler parses numeric strings to numbers based on the column type metadata.

### Example

```json
{
  "id": "sales",
  "columns": [
    { "name": "month", "type": "string" },
    { "name": "revenue", "type": "number" }
  ],
  "rows": [
    ["Jan", "1000"],
    ["Feb", "1500"],
    ["Mar", "1200"]
  ]
}
```

## Mark

Visual representation of data from a dataset.

```typescript
interface Mark {
  id: string;               // Unique identifier
  datasetId: string;        // Reference to dataset
  geometry: Geometry;       // Visual type
  encode: Encode;           // Data-to-visual mapping
  coordinateSystem?: CoordinateSystem;
  style?: Style;            // Visual styling
  stack?: string;           // Stack group (for bar)
  smooth?: boolean;         // Smooth curves (for line/area)
  name?: string;            // Display name
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `datasetId` | string | Yes | ID of dataset to visualize |
| `geometry` | Geometry | Yes | Chart type |
| `encode` | Encode | Yes | Data field mappings |
| `coordinateSystem` | CoordinateSystem | No | Coordinate system type |
| `style` | Style | No | Visual styling options |
| `stack` | string | No | Stack group name for stacked charts |
| `smooth` | boolean | No | Enable smooth curves (line/area) |
| `name` | string | No | Display name in legend |

## Encode

Maps dataset columns to visual properties.

```typescript
interface Encode {
  x?: string;         // X-axis column (Cartesian)
  y?: string;         // Y-axis column (Cartesian)
  value?: string;     // Value column (pie, gauge, funnel)
  name?: string;      // Name/label column (pie, funnel)
  size?: string;      // Size column (scatter)
  color?: string;     // Color column
  category?: string;  // Category column (radar)
  indicator?: string; // Indicator column (radar)
  source?: string;    // Source node (sankey)
  target?: string;    // Target node (sankey)
  heat?: string;      // Heat value column (heatmap)
}
```

| Property | Type | Charts | Description |
|----------|------|--------|-------------|
| `x` | string | line, bar, scatter, area, heatmap | X-axis data column |
| `y` | string | line, bar, scatter, area, heatmap | Y-axis data column |
| `value` | string | pie, gauge, funnel, treemap | Numeric value column |
| `name` | string | pie, funnel | Label/name column |
| `size` | string | scatter | Point size column |
| `color` | string | all | Color mapping column |
| `category` | string | radar | Category/dimension column |
| `indicator` | string | radar | Indicator values column |
| `source` | string | sankey | Source node column |
| `target` | string | sankey | Target node column |
| `heat` | string | heatmap | Heat intensity column |

## Style

Visual styling properties.

```typescript
interface Style {
  color?: string;       // Primary color (hex or named)
  opacity?: number;     // 0.0 to 1.0
  borderColor?: string; // Border/stroke color
  borderWidth?: number; // Border/stroke width
  // Gauge properties
  gaugeMin?: number;    // Gauge minimum value
  gaugeMax?: number;    // Gauge maximum value
  startAngle?: number;  // Gauge start angle (degrees)
  endAngle?: number;    // Gauge end angle (degrees)
  // Heatmap properties
  heatMin?: number;     // Heatmap minimum value
  heatMax?: number;     // Heatmap maximum value
  // Funnel properties
  funnelAlign?: string; // Funnel alignment: "left", "center", "right"
  funnelSort?: string;  // Funnel sort: "ascending", "descending", "none"
  funnelGap?: number;   // Gap between funnel segments
}
```

## Axis

Axis configuration for Cartesian charts.

```typescript
interface Axis {
  id: string;           // Unique identifier
  type: AxisType;       // Axis data type
  position: AxisPosition; // Placement
  name?: string;        // Axis label
  min?: number;         // Minimum value
  max?: number;         // Maximum value
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `type` | AxisType | Yes | Data type for axis |
| `position` | AxisPosition | Yes | Where axis is displayed |
| `name` | string | No | Axis label text |
| `min` | number | No | Minimum axis value |
| `max` | number | No | Maximum axis value |

## Legend

Legend configuration.

```typescript
interface Legend {
  show?: boolean;           // Show/hide legend
  position?: LegendPosition; // Placement
  items?: string[];         // Explicit legend items
}
```

## Tooltip

Tooltip configuration.

```typescript
interface Tooltip {
  show?: boolean;           // Show/hide tooltip
  trigger?: TooltipTrigger; // Trigger mode
}
```

## Grid

Chart area positioning.

```typescript
interface Grid {
  left?: string | number;   // Left margin
  right?: string | number;  // Right margin
  top?: string | number;    // Top margin
  bottom?: string | number; // Bottom margin
  width?: string | number;  // Explicit width
  height?: string | number; // Explicit height
  containLabel?: boolean;   // Include axis labels in grid
}
```

## Enums

### Geometry

Chart visualization types.

| Value | Description |
|-------|-------------|
| `line` | Line chart |
| `bar` | Bar chart |
| `pie` | Pie chart |
| `scatter` | Scatter plot |
| `area` | Area chart (line with fill) |
| `radar` | Radar/spider chart |
| `funnel` | Funnel chart |
| `gauge` | Gauge/meter chart |
| `heatmap` | Heatmap visualization |
| `treemap` | Treemap chart |
| `sankey` | Sankey/flow diagram |

### CoordinateSystem

| Value | Description |
|-------|-------------|
| `cartesian2d` | Standard X/Y coordinates |
| `polar` | Polar coordinates |
| `radial` | Radial layout |

### AxisType

| Value | Description |
|-------|-------------|
| `category` | Discrete categories |
| `value` | Continuous numeric values |
| `time` | Time series data |
| `log` | Logarithmic scale |

### AxisPosition

| Value | Description |
|-------|-------------|
| `bottom` | Bottom of chart (X-axis) |
| `top` | Top of chart (X-axis) |
| `left` | Left of chart (Y-axis) |
| `right` | Right of chart (Y-axis) |

### LegendPosition

| Value | Description |
|-------|-------------|
| `top` | Above the chart |
| `bottom` | Below the chart |
| `left` | Left side |
| `right` | Right side |

### TooltipTrigger

| Value | Description |
|-------|-------------|
| `item` | Trigger on data item hover |
| `axis` | Trigger on axis position |
| `none` | Disable tooltip |
