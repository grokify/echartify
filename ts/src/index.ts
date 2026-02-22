/**
 * EChartify - A non-polymorphic JSON IR for Apache ECharts
 *
 * This module provides:
 * - Zod schemas for validation (source of truth)
 * - TypeScript types inferred from schemas
 * - Compiler to transform IR → ECharts options (future)
 */

// Schema exports (Zod schemas for validation)
export {
  datasetSchema,
  styleSchema,
  geometrySchema,
  coordinateSystemSchema,
  encodeSchema,
  markSchema,
  axisTypeSchema,
  axisPositionSchema,
  axisSchema,
  legendPositionSchema,
  legendSchema,
  tooltipTriggerSchema,
  tooltipSchema,
  gridSchema,
  chartIRSchema,
  // Helper functions
  isHorizontalAxis,
  isVerticalAxis,
} from "./schema/index.js";

// Type exports
export type {
  Dataset,
  Style,
  Geometry,
  CoordinateSystem,
  Encode,
  Mark,
  AxisType,
  AxisPosition,
  Axis,
  LegendPosition,
  Legend,
  TooltipTrigger,
  Tooltip,
  Grid,
  ChartIR,
} from "./types.js";

// Compiler exports
export { compile } from "./compiler/index.js";
export type { EChartsOption } from "./compiler/index.js";
