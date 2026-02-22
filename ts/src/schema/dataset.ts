import { z } from "zod";

/**
 * ColumnType defines the data type of a column.
 */
export const columnTypeSchema = z.enum(["string", "number"]);
export type ColumnType = z.infer<typeof columnTypeSchema>;

/**
 * Column defines a dataset column with name and type.
 */
export const columnSchema = z.object({
  /** Name is the column identifier used in encode mappings. */
  name: z.string(),

  /** Type specifies the data type: "string" for categories, "number" for values. */
  type: columnTypeSchema,
});
export type Column = z.infer<typeof columnSchema>;

/**
 * Dataset represents tabular data for chart consumption.
 * All values are stored as strings for static type compatibility.
 * The column type metadata indicates how values should be parsed.
 */
export const datasetSchema = z.object({
  /** ID uniquely identifies this dataset for reference by marks. */
  id: z.string(),

  /** Columns defines the column structure with names and types. */
  columns: z.array(columnSchema),

  /**
   * Rows contains the data values as strings.
   * Numeric values are stored as string representations (e.g., "120").
   * Empty string "" represents null/missing values.
   */
  rows: z.array(z.array(z.string())),
});

export type Dataset = z.infer<typeof datasetSchema>;
