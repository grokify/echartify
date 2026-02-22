package chartir

import (
	"encoding/json"
	"testing"
)

func TestChartIRMarshalJSON(t *testing.T) {
	opacity := 0.7
	chart := ChartIR{
		Title: "Monthly Revenue",
		Datasets: []Dataset{
			{
				ID: "revenue",
				Columns: []Column{
					{Name: "month", Type: ColumnTypeString},
					{Name: "sales", Type: ColumnTypeNumber},
					{Name: "profit", Type: ColumnTypeNumber},
				},
				Rows: [][]string{
					{"Jan", "120", "20"},
					{"Feb", "200", "45"},
					{"Mar", "150", "30"},
				},
			},
		},
		Marks: []Mark{
			{
				ID:        "sales-line",
				DatasetID: "revenue",
				Geometry:  GeometryLine,
				Encode: Encode{
					X: "month",
					Y: "sales",
				},
				Smooth: true,
				Name:   "Sales",
			},
			{
				ID:        "profit-bar",
				DatasetID: "revenue",
				Geometry:  GeometryBar,
				Encode: Encode{
					X: "month",
					Y: "profit",
				},
				Style: &Style{
					Color:   "#91cc75",
					Opacity: &opacity,
				},
				Name: "Profit",
			},
		},
		Axes: []Axis{
			{
				ID:       "x",
				Type:     AxisTypeCategory,
				Position: AxisPositionBottom,
			},
			{
				ID:       "y",
				Type:     AxisTypeValue,
				Position: AxisPositionLeft,
			},
		},
		Legend: &Legend{
			Show:     true,
			Position: LegendPositionTop,
		},
		Tooltip: &Tooltip{
			Show:    true,
			Trigger: TooltipTriggerAxis,
		},
	}

	data, err := json.MarshalIndent(chart, "", "  ")
	if err != nil {
		t.Fatalf("failed to marshal ChartIR: %v", err)
	}

	// Verify it can be unmarshaled back
	var decoded ChartIR
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("failed to unmarshal ChartIR: %v", err)
	}

	if decoded.Title != chart.Title {
		t.Errorf("title mismatch: got %q, want %q", decoded.Title, chart.Title)
	}

	if len(decoded.Datasets) != 1 {
		t.Errorf("datasets count: got %d, want 1", len(decoded.Datasets))
	}

	if len(decoded.Marks) != 2 {
		t.Errorf("marks count: got %d, want 2", len(decoded.Marks))
	}

	if decoded.Marks[0].Geometry != GeometryLine {
		t.Errorf("first mark geometry: got %q, want %q", decoded.Marks[0].Geometry, GeometryLine)
	}

	if decoded.Marks[1].Geometry != GeometryBar {
		t.Errorf("second mark geometry: got %q, want %q", decoded.Marks[1].Geometry, GeometryBar)
	}
}

func TestAxisHelpers(t *testing.T) {
	tests := []struct {
		axis         Axis
		isHorizontal bool
		isVertical   bool
	}{
		{Axis{Position: AxisPositionBottom}, true, false},
		{Axis{Position: AxisPositionTop}, true, false},
		{Axis{Position: AxisPositionLeft}, false, true},
		{Axis{Position: AxisPositionRight}, false, true},
	}

	for _, tt := range tests {
		if got := tt.axis.IsHorizontal(); got != tt.isHorizontal {
			t.Errorf("Axis{Position: %q}.IsHorizontal() = %v, want %v",
				tt.axis.Position, got, tt.isHorizontal)
		}
		if got := tt.axis.IsVertical(); got != tt.isVertical {
			t.Errorf("Axis{Position: %q}.IsVertical() = %v, want %v",
				tt.axis.Position, got, tt.isVertical)
		}
	}
}

func TestGeometries(t *testing.T) {
	geoms := Geometries()
	if len(geoms) != 5 {
		t.Errorf("Geometries() returned %d items, want 5", len(geoms))
	}

	expected := map[Geometry]bool{
		GeometryLine:    true,
		GeometryBar:     true,
		GeometryPie:     true,
		GeometryScatter: true,
		GeometryArea:    true,
	}

	for _, g := range geoms {
		if !expected[g] {
			t.Errorf("unexpected geometry: %q", g)
		}
	}
}

func TestAxisTypes(t *testing.T) {
	types := AxisTypes()
	if len(types) != 4 {
		t.Errorf("AxisTypes() returned %d items, want 4", len(types))
	}
}

func TestAxisPositions(t *testing.T) {
	positions := AxisPositions()
	if len(positions) != 4 {
		t.Errorf("AxisPositions() returned %d items, want 4", len(positions))
	}
}

func TestCoordinateSystems(t *testing.T) {
	systems := CoordinateSystems()
	if len(systems) != 3 {
		t.Errorf("CoordinateSystems() returned %d items, want 3", len(systems))
	}
}

func TestLegendPositions(t *testing.T) {
	positions := LegendPositions()
	if len(positions) != 4 {
		t.Errorf("LegendPositions() returned %d items, want 4", len(positions))
	}
}

func TestTooltipTriggers(t *testing.T) {
	triggers := TooltipTriggers()
	if len(triggers) != 3 {
		t.Errorf("TooltipTriggers() returned %d items, want 3", len(triggers))
	}
}
