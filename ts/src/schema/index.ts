/**
 * Schema module - Zod schemas for Chart IR (source of truth)
 */

// Re-export all schemas
export {
  columnTypeSchema,
  columnSchema,
  datasetSchema,
  type ColumnType,
  type Column,
  type Dataset,
} from "./dataset.js";
export { styleSchema, type Style } from "./style.js";
export {
  geometrySchema,
  coordinateSystemSchema,
  encodeSchema,
  markSchema,
  type Geometry,
  type CoordinateSystem,
  type Encode,
  type Mark,
} from "./mark.js";
export {
  axisTypeSchema,
  axisPositionSchema,
  axisSchema,
  isHorizontalAxis,
  isVerticalAxis,
  type AxisType,
  type AxisPosition,
  type Axis,
} from "./axis.js";
export {
  legendPositionSchema,
  legendSchema,
  type LegendPosition,
  type Legend,
} from "./legend.js";
export {
  tooltipTriggerSchema,
  tooltipSchema,
  type TooltipTrigger,
  type Tooltip,
} from "./tooltip.js";
export { gridSchema, type Grid } from "./grid.js";
export { chartIRSchema, type ChartIR } from "./chartir.js";
