package chartir

// ColumnType defines the data type for a column.
type ColumnType string

const (
	ColumnTypeString ColumnType = "string"
	ColumnTypeNumber ColumnType = "number"
)

// Column defines a typed column in a dataset.
type Column struct {
	// Name is the column name/header.
	Name string `json:"name"`

	// Type is the data type for values in this column.
	Type ColumnType `json:"type"`
}

// Dataset represents tabular data for chart consumption.
// The structure is intentionally simple and uniform - always
// typed column definitions plus rows of string values.
type Dataset struct {
	// ID uniquely identifies this dataset for reference by marks.
	ID string `json:"id"`

	// Columns defines the typed column definitions for the data.
	Columns []Column `json:"columns"`

	// Rows contains the data values as strings. Each row is an array
	// of string values corresponding to the columns. The compiler
	// parses values to numbers based on the column type.
	Rows [][]string `json:"rows"`
}
