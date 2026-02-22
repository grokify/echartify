// Package chartir provides a non-polymorphic intermediate representation
// for Apache ECharts configurations. The IR is designed to be AI-friendly,
// easily validated via JSON Schema, and compiled to ECharts option objects.
package chartir

// ChartIR is the top-level chart intermediate representation.
// It provides a normalized, non-polymorphic structure that can be
// compiled to Apache ECharts option objects.
type ChartIR struct {
	// Title is the chart title text.
	Title string `json:"title,omitempty"`

	// Datasets contains the data sources for the chart.
	// Each dataset is referenced by marks via DatasetID.
	Datasets []Dataset `json:"datasets"`

	// Marks define the visual representations (equivalent to ECharts series).
	// All marks have the same structure regardless of geometry type.
	Marks []Mark `json:"marks"`

	// Axes define the chart axes. Optional for non-Cartesian charts (e.g., pie).
	Axes []Axis `json:"axes,omitempty"`

	// Legend configures the chart legend.
	Legend *Legend `json:"legend,omitempty"`

	// Tooltip configures hover tooltips.
	Tooltip *Tooltip `json:"tooltip,omitempty"`

	// Grid configures the chart container/grid positioning.
	Grid *Grid `json:"grid,omitempty"`
}
