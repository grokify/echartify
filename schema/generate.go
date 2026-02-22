//go:build ignore

// This program generates JSON Schema from the chartir Go types.
// Run with: go run generate.go
package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/grokify/echartify/chartir"
	"github.com/invopop/jsonschema"
)

func main() {
	r := &jsonschema.Reflector{
		DoNotReference: false,
		ExpandedStruct: false,
	}

	schema := r.Reflect(&chartir.ChartIR{})
	schema.ID = "https://github.com/grokify/echartify/schema/chartir.schema.json"
	schema.Title = "EChartify Chart IR"
	schema.Description = "A non-polymorphic intermediate representation for Apache ECharts configurations."

	data, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		fmt.Fprintf(os.Stderr, "error marshaling schema: %v\n", err)
		os.Exit(1)
	}

	if err := os.WriteFile("chartir.schema.json", data, 0644); err != nil {
		fmt.Fprintf(os.Stderr, "error writing schema file: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Generated chartir.schema.json")
}
