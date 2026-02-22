import { z } from "zod";

/**
 * Grid defines the chart container/grid positioning.
 * Values can be percentages (e.g., "10%") or pixel values (e.g., "50").
 */
export const gridSchema = z.object({
  /** Left is the distance from the left edge. */
  left: z.string().optional(),

  /** Right is the distance from the right edge. */
  right: z.string().optional(),

  /** Top is the distance from the top edge. */
  top: z.string().optional(),

  /** Bottom is the distance from the bottom edge. */
  bottom: z.string().optional(),

  /** Width is the grid width. */
  width: z.string().optional(),

  /** Height is the grid height. */
  height: z.string().optional(),

  /** ContainLabel adjusts grid to contain axis labels. */
  containLabel: z.boolean().optional(),
});

export type Grid = z.infer<typeof gridSchema>;
