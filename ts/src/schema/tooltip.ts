import { z } from "zod";

/**
 * TooltipTrigger defines what triggers the tooltip.
 */
export const tooltipTriggerSchema = z.enum(["item", "axis", "none"]);
export type TooltipTrigger = z.infer<typeof tooltipTriggerSchema>;

/**
 * Tooltip defines tooltip configuration.
 */
export const tooltipSchema = z.object({
  /** Show controls tooltip visibility. */
  show: z.boolean().optional(),

  /** Trigger specifies what triggers the tooltip. */
  trigger: tooltipTriggerSchema.optional(),
});

export type Tooltip = z.infer<typeof tooltipSchema>;
