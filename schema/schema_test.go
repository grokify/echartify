package schema

import (
	"encoding/json"
	"testing"
)

func TestChartIRSchemaIsValidJSON(t *testing.T) {
	if ChartIRSchema == "" {
		t.Fatal("ChartIRSchema is empty")
	}

	var data map[string]any
	if err := json.Unmarshal([]byte(ChartIRSchema), &data); err != nil {
		t.Fatalf("ChartIRSchema is not valid JSON: %v", err)
	}

	// Verify essential schema properties
	if data["$schema"] == nil {
		t.Error("missing $schema property")
	}

	if data["$id"] == nil {
		t.Error("missing $id property")
	}

	if data["title"] != "EChartify Chart IR" {
		t.Errorf("unexpected title: %v", data["title"])
	}

	defs, ok := data["$defs"].(map[string]any)
	if !ok {
		t.Fatal("missing $defs")
	}

	// Verify key type definitions exist
	expectedDefs := []string{
		"ChartIR", "Dataset", "Mark", "Axis",
		"Geometry", "CoordinateSystem", "AxisType", "AxisPosition",
	}

	for _, def := range expectedDefs {
		if defs[def] == nil {
			t.Errorf("missing definition: %s", def)
		}
	}
}

func TestChartIRSchemaBytes(t *testing.T) {
	b := ChartIRSchemaBytes()
	if len(b) == 0 {
		t.Fatal("ChartIRSchemaBytes returned empty slice")
	}

	if string(b) != ChartIRSchema {
		t.Error("ChartIRSchemaBytes does not match ChartIRSchema")
	}
}
