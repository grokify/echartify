import { z } from "zod";
import { datasetSchema } from "./dataset.js";
import { markSchema } from "./mark.js";
import { axisSchema } from "./axis.js";
import { legendSchema } from "./legend.js";
import { tooltipSchema } from "./tooltip.js";
import { gridSchema } from "./grid.js";

/**
 * ChartIR is the top-level chart intermediate representation.
 * It provides a normalized, non-polymorphic structure that can be
 * compiled to Apache ECharts option objects.
 */
export const chartIRSchema = z.object({
  /** Title is the chart title text. */
  title: z.string().optional(),

  /**
   * Datasets contains the data sources for the chart.
   * Each dataset is referenced by marks via datasetId.
   */
  datasets: z.array(datasetSchema),

  /**
   * Marks define the visual representations (equivalent to ECharts series).
   * All marks have the same structure regardless of geometry type.
   */
  marks: z.array(markSchema),

  /** Axes define the chart axes. Optional for non-Cartesian charts (e.g., pie). */
  axes: z.array(axisSchema).optional(),

  /** Legend configures the chart legend. */
  legend: legendSchema.optional(),

  /** Tooltip configures hover tooltips. */
  tooltip: tooltipSchema.optional(),

  /** Grid configures the chart container/grid positioning. */
  grid: gridSchema.optional(),
});

export type ChartIR = z.infer<typeof chartIRSchema>;
