package chartir

import "github.com/invopop/jsonschema"

// TooltipTrigger defines what triggers the tooltip.
type TooltipTrigger string

const (
	TooltipTriggerItem  TooltipTrigger = "item"
	TooltipTriggerAxis  TooltipTrigger = "axis"
	TooltipTriggerNone  TooltipTrigger = "none"
)

// TooltipTriggers returns all valid tooltip trigger values.
func TooltipTriggers() []TooltipTrigger {
	return []TooltipTrigger{
		TooltipTriggerItem,
		TooltipTriggerAxis,
		TooltipTriggerNone,
	}
}

// JSONSchema implements jsonschema.Schema interface for enum generation.
func (TooltipTrigger) JSONSchema() *jsonschema.Schema {
	return &jsonschema.Schema{
		Type: "string",
		Enum: []any{"item", "axis", "none"},
	}
}

// Tooltip defines tooltip configuration.
type Tooltip struct {
	// Show controls tooltip visibility.
	Show bool `json:"show,omitempty"`

	// Trigger specifies what triggers the tooltip.
	Trigger TooltipTrigger `json:"trigger,omitempty"`
}
