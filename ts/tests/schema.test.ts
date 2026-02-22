import { describe, it, expect } from "vitest";
import {
  chartIRSchema,
  datasetSchema,
  markSchema,
  axisSchema,
  geometrySchema,
  axisTypeSchema,
  axisPositionSchema,
  columnTypeSchema,
  isHorizontalAxis,
  isVerticalAxis,
} from "../src/schema/index.js";
import type { ChartIR, Axis } from "../src/types.js";

describe("Schema Validation", () => {
  describe("datasetSchema", () => {
    it("validates a correct dataset", () => {
      const dataset = {
        id: "sales",
        columns: [
          { name: "month", type: "string" },
          { name: "revenue", type: "number" },
        ],
        rows: [
          ["Jan", "100"],
          ["Feb", "200"],
        ],
      };
      expect(() => datasetSchema.parse(dataset)).not.toThrow();
    });

    it("rejects dataset without id", () => {
      const dataset = {
        columns: [{ name: "month", type: "string" }],
        rows: [],
      };
      expect(() => datasetSchema.parse(dataset)).toThrow();
    });

    it("rejects dataset with invalid column type", () => {
      const dataset = {
        id: "test",
        columns: [{ name: "x", type: "invalid" }],
        rows: [],
      };
      expect(() => datasetSchema.parse(dataset)).toThrow();
    });
  });

  describe("markSchema", () => {
    it("validates a correct mark", () => {
      const mark = {
        id: "line1",
        datasetId: "sales",
        geometry: "line",
        encode: { x: "month", y: "revenue" },
      };
      expect(() => markSchema.parse(mark)).not.toThrow();
    });

    it("rejects invalid geometry", () => {
      const mark = {
        id: "line1",
        datasetId: "sales",
        geometry: "invalid",
        encode: {},
      };
      expect(() => markSchema.parse(mark)).toThrow();
    });
  });

  describe("axisSchema", () => {
    it("validates a correct axis", () => {
      const axis = {
        id: "x",
        type: "category",
        position: "bottom",
      };
      expect(() => axisSchema.parse(axis)).not.toThrow();
    });

    it("accepts optional min/max", () => {
      const axis = {
        id: "y",
        type: "value",
        position: "left",
        min: 0,
        max: 100,
      };
      expect(() => axisSchema.parse(axis)).not.toThrow();
    });
  });

  describe("chartIRSchema", () => {
    it("validates a complete chart IR", () => {
      const chart: ChartIR = {
        title: "Monthly Revenue",
        datasets: [
          {
            id: "revenue",
            columns: [
              { name: "month", type: "string" },
              { name: "sales", type: "number" },
            ],
            rows: [
              ["Jan", "120"],
              ["Feb", "200"],
            ],
          },
        ],
        marks: [
          {
            id: "sales-line",
            datasetId: "revenue",
            geometry: "line",
            encode: { x: "month", y: "sales" },
            smooth: true,
          },
        ],
        axes: [
          { id: "x", type: "category", position: "bottom" },
          { id: "y", type: "value", position: "left" },
        ],
        legend: { show: true, position: "top" },
        tooltip: { show: true, trigger: "axis" },
      };
      expect(() => chartIRSchema.parse(chart)).not.toThrow();
    });

    it("validates minimal chart IR", () => {
      const chart = {
        datasets: [
          {
            id: "d1",
            columns: [{ name: "x", type: "string" }],
            rows: [],
          },
        ],
        marks: [
          { id: "m1", datasetId: "d1", geometry: "bar", encode: { x: "x" } },
        ],
      };
      expect(() => chartIRSchema.parse(chart)).not.toThrow();
    });

    it("rejects chart without datasets", () => {
      const chart = {
        marks: [],
      };
      expect(() => chartIRSchema.parse(chart)).toThrow();
    });

    it("rejects chart without marks", () => {
      const chart = {
        datasets: [],
      };
      expect(() => chartIRSchema.parse(chart)).toThrow();
    });
  });

  describe("Enum schemas", () => {
    it("geometrySchema accepts valid values", () => {
      expect(geometrySchema.parse("line")).toBe("line");
      expect(geometrySchema.parse("bar")).toBe("bar");
      expect(geometrySchema.parse("pie")).toBe("pie");
      expect(geometrySchema.parse("scatter")).toBe("scatter");
      expect(geometrySchema.parse("area")).toBe("area");
    });

    it("axisTypeSchema accepts valid values", () => {
      expect(axisTypeSchema.parse("category")).toBe("category");
      expect(axisTypeSchema.parse("value")).toBe("value");
      expect(axisTypeSchema.parse("time")).toBe("time");
      expect(axisTypeSchema.parse("log")).toBe("log");
    });

    it("axisPositionSchema accepts valid values", () => {
      expect(axisPositionSchema.parse("bottom")).toBe("bottom");
      expect(axisPositionSchema.parse("top")).toBe("top");
      expect(axisPositionSchema.parse("left")).toBe("left");
      expect(axisPositionSchema.parse("right")).toBe("right");
    });

    it("columnTypeSchema accepts valid values", () => {
      expect(columnTypeSchema.parse("string")).toBe("string");
      expect(columnTypeSchema.parse("number")).toBe("number");
    });
  });

  describe("Axis helper functions", () => {
    it("isHorizontalAxis returns true for bottom/top", () => {
      const bottomAxis: Axis = {
        id: "x",
        type: "category",
        position: "bottom",
      };
      const topAxis: Axis = { id: "x", type: "category", position: "top" };

      expect(isHorizontalAxis(bottomAxis)).toBe(true);
      expect(isHorizontalAxis(topAxis)).toBe(true);
    });

    it("isVerticalAxis returns true for left/right", () => {
      const leftAxis: Axis = { id: "y", type: "value", position: "left" };
      const rightAxis: Axis = { id: "y", type: "value", position: "right" };

      expect(isVerticalAxis(leftAxis)).toBe(true);
      expect(isVerticalAxis(rightAxis)).toBe(true);
    });

    it("isHorizontalAxis returns false for left/right", () => {
      const leftAxis: Axis = { id: "y", type: "value", position: "left" };
      expect(isHorizontalAxis(leftAxis)).toBe(false);
    });

    it("isVerticalAxis returns false for bottom/top", () => {
      const bottomAxis: Axis = {
        id: "x",
        type: "category",
        position: "bottom",
      };
      expect(isVerticalAxis(bottomAxis)).toBe(false);
    });
  });
});
