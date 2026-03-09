import { z } from "zod";

/**
 * Style defines visual styling properties.
 * The structure is intentionally flat and simple to avoid
 * deep nesting that would require polymorphic handling.
 */
export const styleSchema = z.object({
  /** Color is the primary color (hex, rgb, or named color). */
  color: z.string().optional(),

  /** Opacity is the transparency level (0.0 to 1.0). */
  opacity: z.number().min(0).max(1).optional(),

  /** BorderColor is the border/stroke color. */
  borderColor: z.string().optional(),

  /** BorderWidth is the border/stroke width in pixels. */
  borderWidth: z.number().min(0).optional(),

  // Line/Area specific
  /** Smooth enables smooth curves for line/area geometries. */
  smooth: z.boolean().optional(),

  /** AreaOpacity sets opacity for area fill (0.0 to 1.0). */
  areaOpacity: z.number().min(0).max(1).optional(),

  /** LineWidth sets line stroke width in pixels. */
  lineWidth: z.number().min(0).optional(),

  // Bar specific
  /** BarWidth sets bar width (number or percentage string). */
  barWidth: z.union([z.number(), z.string()]).optional(),

  /** BarGap sets gap between bars (percentage string). */
  barGap: z.string().optional(),

  /** BorderRadius sets bar corner radius. */
  borderRadius: z.union([z.number(), z.array(z.number())]).optional(),

  // Point/Symbol specific
  /** Symbol sets the marker symbol type. */
  symbol: z.enum(["circle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow", "none"]).optional(),

  /** SymbolSize sets the marker symbol size. */
  symbolSize: z.number().optional(),

  // Radar specific
  /** Shape sets radar chart shape (polygon or circle). */
  shape: z.enum(["polygon", "circle"]).optional(),

  // Funnel specific
  /** FunnelAlign sets funnel alignment. */
  funnelAlign: z.enum(["left", "center", "right"]).optional(),

  /** FunnelSort sets funnel sort direction. */
  funnelSort: z.enum(["ascending", "descending", "none"]).optional(),

  /** FunnelGap sets gap between funnel segments. */
  funnelGap: z.number().optional(),

  // Gauge specific
  /** StartAngle sets gauge start angle in degrees. */
  startAngle: z.number().optional(),

  /** EndAngle sets gauge end angle in degrees. */
  endAngle: z.number().optional(),

  /** GaugeMin sets gauge minimum value. */
  gaugeMin: z.number().optional(),

  /** GaugeMax sets gauge maximum value. */
  gaugeMax: z.number().optional(),
});

export type Style = z.infer<typeof styleSchema>;
