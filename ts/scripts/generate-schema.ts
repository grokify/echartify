/**
 * Script to generate JSON Schema from Zod schemas.
 * Run with: npm run generate:schema
 */

import { zodToJsonSchema } from "zod-to-json-schema";
import { chartIRSchema } from "../src/schema/chartir.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import all schemas for proper $ref generation
import {
  datasetSchema,
  markSchema,
  axisSchema,
  legendSchema,
  tooltipSchema,
  gridSchema,
  styleSchema,
  encodeSchema,
  geometrySchema,
  coordinateSystemSchema,
  axisTypeSchema,
  axisPositionSchema,
  legendPositionSchema,
  tooltipTriggerSchema,
} from "../src/schema/index.js";

// Generate JSON Schema from Zod with named definitions
const jsonSchema = zodToJsonSchema(chartIRSchema as any, {
  name: "ChartIR",
  $refStrategy: "root",
  definitionPath: "$defs",
  definitions: {
    Dataset: datasetSchema,
    Mark: markSchema,
    Axis: axisSchema,
    Legend: legendSchema,
    Tooltip: tooltipSchema,
    Grid: gridSchema,
    Style: styleSchema,
    Encode: encodeSchema,
    Geometry: geometrySchema,
    CoordinateSystem: coordinateSystemSchema,
    AxisType: axisTypeSchema,
    AxisPosition: axisPositionSchema,
    LegendPosition: legendPositionSchema,
    TooltipTrigger: tooltipTriggerSchema,
  },
});

// Add metadata
const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://github.com/grokify/echartify/schema/chartir.schema.json",
  title: "Echartify Chart IR",
  description:
    "A non-polymorphic intermediate representation for Apache ECharts configurations.",
  ...jsonSchema,
};

// Output path (relative to project root)
const outputPath = path.resolve(__dirname, "../../schema/chartir.schema.json");

// Write schema file
fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

console.log(`Generated JSON Schema at: ${outputPath}`);
