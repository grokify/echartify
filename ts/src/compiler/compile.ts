/**
 * Compiler: Transforms Chart IR → ECharts Option
 */

import type { EChartsOption } from "./types.js";
import type {
  ChartIR,
  Dataset,
  Mark,
  Axis,
  Legend,
  Tooltip,
  Grid,
  Style,
  Geometry,
} from "../schema/index.js";
import { isHorizontalAxis } from "../schema/index.js";

/**
 * Compile a Chart IR document to an ECharts option object.
 */
export function compile(ir: ChartIR): EChartsOption {
  const option: EChartsOption = {};

  // Title
  if (ir.title) {
    option.title = { text: ir.title };
  }

  // Datasets
  if (ir.datasets.length > 0) {
    option.dataset = ir.datasets.map(compileDataset);
  }

  // Series (from marks)
  if (ir.marks.length > 0) {
    option.series = ir.marks.map((mark) => compileMark(mark, ir.datasets));
  }

  // Axes
  if (ir.axes && ir.axes.length > 0) {
    const xAxes = ir.axes.filter(isHorizontalAxis);
    const yAxes = ir.axes.filter((a) => !isHorizontalAxis(a));

    if (xAxes.length > 0) {
      option.xAxis = xAxes.length === 1 ? compileAxis(xAxes[0]) : xAxes.map(compileAxis);
    }
    if (yAxes.length > 0) {
      option.yAxis = yAxes.length === 1 ? compileAxis(yAxes[0]) : yAxes.map(compileAxis);
    }
  }

  // Legend
  if (ir.legend) {
    option.legend = compileLegend(ir.legend, ir.marks);
  }

  // Tooltip
  if (ir.tooltip) {
    option.tooltip = compileTooltip(ir.tooltip);
  }

  // Grid
  if (ir.grid) {
    option.grid = compileGrid(ir.grid);
  }

  return option;
}

/**
 * Compile a Dataset to ECharts dataset format.
 * Converts string values to numbers based on column type metadata.
 */
function compileDataset(dataset: Dataset): {
  id: string;
  dimensions: string[];
  source: (string | number | null)[][];
} {
  // Extract dimension names from column definitions
  const dimensions = dataset.columns.map((col) => col.name);

  // Convert string values to appropriate types based on column type
  const source = dataset.rows.map((row) =>
    row.map((value, colIndex) => {
      // Empty string represents null
      if (value === "") return null;

      const columnType = dataset.columns[colIndex]?.type;
      if (columnType === "number") {
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
      }
      return value;
    })
  );

  return {
    id: dataset.id,
    dimensions,
    source,
  };
}

/**
 * Find dataset index by ID.
 */
function findDatasetIndex(datasetId: string, datasets: Dataset[]): number {
  const index = datasets.findIndex((d) => d.id === datasetId);
  return index >= 0 ? index : 0;
}

/**
 * Compile a Mark to ECharts series.
 */
function compileMark(
  mark: Mark,
  datasets: Dataset[]
): Record<string, unknown> {
  const datasetIndex = findDatasetIndex(mark.datasetId, datasets);

  // Base series configuration
  const series: Record<string, unknown> = {
    type: mapGeometry(mark.geometry),
    name: mark.name || mark.id,
    datasetIndex,
  };

  // Encode mapping
  const encode: Record<string, string> = {};
  if (mark.encode.x) encode.x = mark.encode.x;
  if (mark.encode.y) encode.y = mark.encode.y;
  if (mark.encode.value) encode.value = mark.encode.value;
  if (mark.encode.name) encode.itemName = mark.encode.name;

  if (Object.keys(encode).length > 0) {
    series.encode = encode;
  }

  // Geometry-specific options
  switch (mark.geometry) {
    case "line":
      if (mark.smooth) series.smooth = true;
      if (mark.style) {
        series.lineStyle = compileLineStyle(mark.style);
        series.itemStyle = compileItemStyle(mark.style);
      }
      break;

    case "area":
      // Area is a line with areaStyle
      series.type = "line";
      series.areaStyle = {};
      if (mark.smooth) series.smooth = true;
      if (mark.style) {
        series.lineStyle = compileLineStyle(mark.style);
        series.itemStyle = compileItemStyle(mark.style);
        series.areaStyle = { opacity: mark.style.opacity ?? 0.7 };
      }
      break;

    case "bar":
      if (mark.stack) series.stack = mark.stack;
      if (mark.style) {
        series.itemStyle = compileItemStyle(mark.style);
      }
      break;

    case "pie":
      // Pie charts use value/name encoding
      if (mark.style) {
        series.itemStyle = compileItemStyle(mark.style);
      }
      break;

    case "scatter":
      if (mark.style) {
        series.itemStyle = compileItemStyle(mark.style);
      }
      // Size encoding for scatter
      if (mark.encode.size) {
        series.symbolSize = (data: number[]) => {
          // Default scaling - can be customized
          return Math.sqrt(data[2]) * 2;
        };
      }
      break;
  }

  return series;
}

/**
 * Map IR Geometry to ECharts series type.
 */
function mapGeometry(geometry: Geometry): string {
  switch (geometry) {
    case "line":
      return "line";
    case "bar":
      return "bar";
    case "pie":
      return "pie";
    case "scatter":
      return "scatter";
    case "area":
      return "line"; // Area is line with areaStyle
    default:
      return "line";
  }
}

/**
 * Compile Style to ECharts itemStyle.
 */
function compileItemStyle(
  style: Style
): Record<string, string | number | undefined> {
  const itemStyle: Record<string, string | number | undefined> = {};

  if (style.color) itemStyle.color = style.color;
  if (style.opacity !== undefined) itemStyle.opacity = style.opacity;
  if (style.borderColor) itemStyle.borderColor = style.borderColor;
  if (style.borderWidth !== undefined) itemStyle.borderWidth = style.borderWidth;

  return itemStyle;
}

/**
 * Compile Style to ECharts lineStyle.
 */
function compileLineStyle(
  style: Style
): Record<string, string | number | undefined> {
  const lineStyle: Record<string, string | number | undefined> = {};

  if (style.color) lineStyle.color = style.color;
  if (style.opacity !== undefined) lineStyle.opacity = style.opacity;

  return lineStyle;
}

/**
 * Compile Axis to ECharts axis.
 */
function compileAxis(axis: Axis): Record<string, unknown> {
  const result: Record<string, unknown> = {
    type: axis.type,
  };

  if (axis.name) result.name = axis.name;
  if (axis.min !== undefined) result.min = axis.min;
  if (axis.max !== undefined) result.max = axis.max;

  return result;
}

/**
 * Compile Legend to ECharts legend.
 */
function compileLegend(
  legend: Legend,
  marks: Mark[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (legend.show !== undefined) result.show = legend.show;

  // Map position to ECharts orient + position
  if (legend.position) {
    switch (legend.position) {
      case "top":
        result.top = "top";
        result.orient = "horizontal";
        break;
      case "bottom":
        result.bottom = "bottom";
        result.orient = "horizontal";
        break;
      case "left":
        result.left = "left";
        result.orient = "vertical";
        break;
      case "right":
        result.right = "right";
        result.orient = "vertical";
        break;
    }
  }

  // Items (data in ECharts)
  if (legend.items && legend.items.length > 0) {
    result.data = legend.items;
  } else {
    // Auto-generate from marks
    result.data = marks.map((m) => m.name || m.id);
  }

  return result;
}

/**
 * Compile Tooltip to ECharts tooltip.
 */
function compileTooltip(tooltip: Tooltip): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (tooltip.show !== undefined) result.show = tooltip.show;
  if (tooltip.trigger) result.trigger = tooltip.trigger;

  return result;
}

/**
 * Compile Grid to ECharts grid.
 */
function compileGrid(grid: Grid): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (grid.left) result.left = grid.left;
  if (grid.right) result.right = grid.right;
  if (grid.top) result.top = grid.top;
  if (grid.bottom) result.bottom = grid.bottom;
  if (grid.width) result.width = grid.width;
  if (grid.height) result.height = grid.height;
  if (grid.containLabel !== undefined) result.containLabel = grid.containLabel;

  return result;
}
