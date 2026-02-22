// Package schema provides embedded access to the JSON Schema for chartir types.
package schema

import (
	_ "embed"
)

// ChartIRSchema is the JSON Schema for ChartIR embedded as a string.
//
//go:embed chartir.schema.json
var ChartIRSchema string

// ChartIRSchemaBytes returns the JSON Schema as bytes.
func ChartIRSchemaBytes() []byte {
	return []byte(ChartIRSchema)
}
