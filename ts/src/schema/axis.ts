import { z } from "zod";

/**
 * AxisType defines the axis scale type.
 */
export const axisTypeSchema = z.enum(["category", "value", "time", "log"]);
export type AxisType = z.infer<typeof axisTypeSchema>;

/**
 * AxisPosition defines axis placement.
 */
export const axisPositionSchema = z.enum(["bottom", "top", "left", "right"]);
export type AxisPosition = z.infer<typeof axisPositionSchema>;

/**
 * Axis defines a chart axis.
 */
export const axisSchema = z.object({
  /** ID uniquely identifies this axis. */
  id: z.string(),

  /** Type specifies the axis scale type. */
  type: axisTypeSchema,

  /** Position specifies where the axis is placed. */
  position: axisPositionSchema,

  /** Name is the axis label/title. */
  name: z.string().optional(),

  /** Min is the minimum axis value. If undefined, auto-calculated. */
  min: z.number().optional(),

  /** Max is the maximum axis value. If undefined, auto-calculated. */
  max: z.number().optional(),
});

export type Axis = z.infer<typeof axisSchema>;

/**
 * Helper to check if axis position is horizontal.
 */
export function isHorizontalAxis(axis: Axis): boolean {
  return axis.position === "bottom" || axis.position === "top";
}

/**
 * Helper to check if axis position is vertical.
 */
export function isVerticalAxis(axis: Axis): boolean {
  return axis.position === "left" || axis.position === "right";
}
