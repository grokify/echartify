import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chartIRSchema } from "../src/schema/index.js";
import { compile } from "../src/compiler/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const examplesDir = resolve(__dirname, "../../examples");

// Load and parse example files
function loadExample(filename: string): unknown {
  const filepath = resolve(examplesDir, filename);
  const content = readFileSync(filepath, "utf-8");
  return JSON.parse(content);
}

describe("Example files", () => {
  const examples = [
    "line-chart.json",
    "bar-chart.json",
    "pie-chart.json",
    "multi-series.json",
  ];

  describe("Schema validation", () => {
    examples.forEach((filename) => {
      it(`validates ${filename}`, () => {
        const data = loadExample(filename);
        const result = chartIRSchema.safeParse(data);

        if (!result.success) {
          console.error(`Validation errors for ${filename}:`, result.error.issues);
        }

        expect(result.success).toBe(true);
      });
    });
  });

  describe("Compilation", () => {
    examples.forEach((filename) => {
      it(`compiles ${filename} to ECharts option`, () => {
        const data = loadExample(filename);
        const ir = chartIRSchema.parse(data);
        const option = compile(ir);

        // Basic structure checks
        expect(option).toBeDefined();
        expect(option.dataset).toBeDefined();
        expect(option.series).toBeDefined();

        // Verify series exist
        expect(Array.isArray(option.series)).toBe(true);
        expect((option.series as any[]).length).toBeGreaterThan(0);
      });
    });
  });

  describe("Specific example checks", () => {
    it("line-chart.json has smooth line", () => {
      const data = loadExample("line-chart.json");
      const ir = chartIRSchema.parse(data);
      const option = compile(ir);

      const series = (option.series as any[])[0];
      expect(series.type).toBe("line");
      expect(series.smooth).toBe(true);
    });

    it("bar-chart.json has two bar series", () => {
      const data = loadExample("bar-chart.json");
      const ir = chartIRSchema.parse(data);
      const option = compile(ir);

      expect(option.series).toHaveLength(2);
      (option.series as any[]).forEach((s) => {
        expect(s.type).toBe("bar");
      });
    });

    it("pie-chart.json has pie series with value encoding", () => {
      const data = loadExample("pie-chart.json");
      const ir = chartIRSchema.parse(data);
      const option = compile(ir);

      const series = (option.series as any[])[0];
      expect(series.type).toBe("pie");
      expect(series.encode).toHaveProperty("value");
      expect(series.encode).toHaveProperty("itemName");
    });

    it("multi-series.json has mixed line, bar, area", () => {
      const data = loadExample("multi-series.json");
      const ir = chartIRSchema.parse(data);
      const option = compile(ir);

      expect(option.series).toHaveLength(3);

      const types = (option.series as any[]).map((s) => s.type);
      expect(types).toContain("line");
      expect(types).toContain("bar");
      // Area compiles to line with areaStyle
      expect(types.filter((t) => t === "line")).toHaveLength(2);

      // Verify area has areaStyle
      const areaSeries = (option.series as any[]).find((s) => s.areaStyle);
      expect(areaSeries).toBeDefined();
    });
  });
});
