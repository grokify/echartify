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
});

export type Style = z.infer<typeof styleSchema>;
