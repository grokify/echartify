package chartir

// Style defines visual styling properties.
// The structure is intentionally flat and simple to avoid
// deep nesting that would require polymorphic handling.
type Style struct {
	// Color is the primary color (hex, rgb, or named color).
	Color string `json:"color,omitempty"`

	// Opacity is the transparency level (0.0 to 1.0).
	Opacity *float64 `json:"opacity,omitempty"`

	// BorderColor is the border/stroke color.
	BorderColor string `json:"borderColor,omitempty"`

	// BorderWidth is the border/stroke width in pixels.
	BorderWidth *float64 `json:"borderWidth,omitempty"`
}
