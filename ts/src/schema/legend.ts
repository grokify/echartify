import { z } from "zod";

/**
 * LegendPosition defines legend placement.
 */
export const legendPositionSchema = z.enum(["top", "bottom", "left", "right"]);
export type LegendPosition = z.infer<typeof legendPositionSchema>;

/**
 * Legend defines legend configuration.
 */
export const legendSchema = z.object({
  /** Show controls legend visibility. */
  show: z.boolean().optional(),

  /** Position specifies legend placement. */
  position: legendPositionSchema.optional(),

  /** Items lists specific items to show. If empty, auto-generated from marks. */
  items: z.array(z.string()).optional(),
});

export type Legend = z.infer<typeof legendSchema>;
