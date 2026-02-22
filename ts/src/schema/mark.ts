import { z } from "zod";
import { styleSchema } from "./style.js";

/**
 * Geometry defines the visual representation type.
 * This replaces ECharts' polymorphic series.type with a simple enum.
 */
export const geometrySchema = z.enum(["line", "bar", "pie", "scatter", "area"]);
export type Geometry = z.infer<typeof geometrySchema>;

/**
 * CoordinateSystem defines the coordinate system type.
 */
export const coordinateSystemSchema = z.enum(["cartesian2d", "polar", "radial"]);
export type CoordinateSystem = z.infer<typeof coordinateSystemSchema>;

/**
 * Encode maps data columns to visual channels.
 * Not all fields are used by all geometry types.
 */
export const encodeSchema = z.object({
  /** X maps to the x-axis (for Cartesian geometries). */
  x: z.string().optional(),

  /** Y maps to the y-axis (for Cartesian geometries). */
  y: z.string().optional(),

  /** Value maps to the primary value (for pie charts, etc.). */
  value: z.string().optional(),

  /** Name maps to the name/label (for pie chart segments, etc.). */
  name: z.string().optional(),

  /** Size maps to mark size (for scatter plots). */
  size: z.string().optional(),

  /** Color maps to mark color (for color encoding by data). */
  color: z.string().optional(),
});
export type Encode = z.infer<typeof encodeSchema>;

/**
 * Mark defines a visual mark (equivalent to ECharts series).
 * All marks have the same structure regardless of geometry type.
 * The compiler handles geometry-specific transformations.
 */
export const markSchema = z.object({
  /** ID uniquely identifies this mark. */
  id: z.string(),

  /** DatasetID references the dataset to use for this mark. */
  datasetId: z.string(),

  /** Geometry specifies the visual representation type. */
  geometry: geometrySchema,

  /** CoordinateSystem specifies the coordinate system. Defaults to cartesian2d. */
  coordinateSystem: coordinateSystemSchema.optional(),

  /** Encode maps data columns to visual channels. */
  encode: encodeSchema,

  /** Style defines visual styling properties. */
  style: styleSchema.optional(),

  /** Stack groups marks for stacking. Marks with the same stack value are stacked. */
  stack: z.string().optional(),

  /** Smooth enables smooth curves for line/area geometries. */
  smooth: z.boolean().optional(),

  /** Name is the display name for this mark in legends/tooltips. */
  name: z.string().optional(),
});

export type Mark = z.infer<typeof markSchema>;
