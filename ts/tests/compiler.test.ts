import { describe, it, expect } from "vitest";
import { compile } from "../src/compiler/index.js";
import type { ChartIR } from "../src/types.js";

describe("Compiler", () => {
  describe("compile()", () => {
    it("compiles a minimal chart", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [
              ["a", "1"],
              ["b", "2"],
            ],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
          },
        ],
      };

      const option = compile(ir);

      expect(option.dataset).toHaveLength(1);
      expect(option.series).toHaveLength(1);
      expect((option.series as any[])[0].type).toBe("line");
    });

    it("compiles title", () => {
      const ir: ChartIR = {
        title: "My Chart",
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

      const option = compile(ir);

      expect(option.title).toEqual({ text: "My Chart" });
    });

    it("compiles datasets with dimensions and converts types", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "sales",
            columns: [
              { name: "month", type: "string" },
              { name: "revenue", type: "number" },
              { name: "profit", type: "number" },
            ],
            rows: [
              ["Jan", "100", "20"],
              ["Feb", "200", "40"],
            ],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "sales",
            geometry: "line",
            encode: { x: "month", y: "revenue" },
          },
        ],
      };

      const option = compile(ir);

      expect(option.dataset).toHaveLength(1);
      const dataset = (option.dataset as any[])[0];
      expect(dataset.id).toBe("sales");
      expect(dataset.dimensions).toEqual(["month", "revenue", "profit"]);
      expect(dataset.source).toHaveLength(2);
      // Verify type conversion
      expect(dataset.source[0]).toEqual(["Jan", 100, 20]);
      expect(dataset.source[1]).toEqual(["Feb", 200, 40]);
    });

    it("handles empty string as null", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [
              ["a", "10"],
              ["b", ""], // empty = null
            ],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
          },
        ],
      };

      const option = compile(ir);
      const dataset = (option.dataset as any[])[0];

      expect(dataset.source[0]).toEqual(["a", 10]);
      expect(dataset.source[1]).toEqual(["b", null]);
    });
  });

  describe("Line charts", () => {
    it("compiles line with smooth", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
            smooth: true,
          },
        ],
      };

      const option = compile(ir);
      const series = (option.series as any[])[0];

      expect(series.type).toBe("line");
      expect(series.smooth).toBe(true);
    });

    it("compiles line with style", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
            style: { color: "#ff0000", opacity: 0.8 },
          },
        ],
      };

      const option = compile(ir);
      const series = (option.series as any[])[0];

      expect(series.lineStyle).toEqual({ color: "#ff0000", opacity: 0.8 });
      expect(series.itemStyle).toEqual({ color: "#ff0000", opacity: 0.8 });
    });
  });

  describe("Area charts", () => {
    it("compiles area as line with areaStyle", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "area",
            encode: { x: "x", y: "y" },
          },
        ],
      };

      const option = compile(ir);
      const series = (option.series as any[])[0];

      expect(series.type).toBe("line");
      expect(series.areaStyle).toBeDefined();
    });

    it("compiles area with custom opacity", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "area",
            encode: { x: "x", y: "y" },
            style: { opacity: 0.5 },
          },
        ],
      };

      const option = compile(ir);
      const series = (option.series as any[])[0];

      expect(series.areaStyle).toEqual({ opacity: 0.5 });
    });
  });

  describe("Bar charts", () => {
    it("compiles bar chart", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "bar",
            encode: { x: "x", y: "y" },
          },
        ],
      };

      const option = compile(ir);
      const series = (option.series as any[])[0];

      expect(series.type).toBe("bar");
    });

    it("compiles stacked bar chart", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y1", type: "number" },
              { name: "y2", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "bar",
            encode: { x: "x", y: "y1" },
            stack: "total",
          },
          {
            id: "m2",
            datasetId: "d1",
            geometry: "bar",
            encode: { x: "x", y: "y2" },
            stack: "total",
          },
        ],
      };

      const option = compile(ir);
      const series = option.series as any[];

      expect(series[0].stack).toBe("total");
      expect(series[1].stack).toBe("total");
    });

    it("compiles bar with style", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "bar",
            encode: { x: "x", y: "y" },
            style: { color: "#00ff00", borderColor: "#000", borderWidth: 1 },
          },
        ],
      };

      const option = compile(ir);
      const series = (option.series as any[])[0];

      expect(series.itemStyle).toEqual({
        color: "#00ff00",
        borderColor: "#000",
        borderWidth: 1,
      });
    });
  });

  describe("Pie charts", () => {
    it("compiles pie chart with value/name encoding", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "category", type: "string" },
              { name: "value", type: "number" },
            ],
            rows: [
              ["A", "30"],
              ["B", "70"],
            ],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "pie",
            encode: { value: "value", name: "category" },
          },
        ],
      };

      const option = compile(ir);
      const series = (option.series as any[])[0];

      expect(series.type).toBe("pie");
      expect(series.encode).toEqual({ value: "value", itemName: "category" });
    });
  });

  describe("Scatter charts", () => {
    it("compiles scatter chart", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "number" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "scatter",
            encode: { x: "x", y: "y" },
          },
        ],
      };

      const option = compile(ir);
      const series = (option.series as any[])[0];

      expect(series.type).toBe("scatter");
    });
  });

  describe("Axes", () => {
    it("compiles x and y axes", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
          },
        ],
        axes: [
          { id: "x", type: "category", position: "bottom" },
          { id: "y", type: "value", position: "left" },
        ],
      };

      const option = compile(ir);

      expect(option.xAxis).toEqual({ type: "category" });
      expect(option.yAxis).toEqual({ type: "value" });
    });

    it("compiles axis with name and range", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
          },
        ],
        axes: [
          { id: "x", type: "category", position: "bottom", name: "Month" },
          {
            id: "y",
            type: "value",
            position: "left",
            name: "Revenue",
            min: 0,
            max: 100,
          },
        ],
      };

      const option = compile(ir);

      expect(option.xAxis).toEqual({ type: "category", name: "Month" });
      expect(option.yAxis).toEqual({
        type: "value",
        name: "Revenue",
        min: 0,
        max: 100,
      });
    });

    it("compiles multiple y axes", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
          },
        ],
        axes: [
          { id: "x", type: "category", position: "bottom" },
          { id: "y1", type: "value", position: "left" },
          { id: "y2", type: "value", position: "right" },
        ],
      };

      const option = compile(ir);

      expect(option.xAxis).toEqual({ type: "category" });
      expect(option.yAxis).toHaveLength(2);
    });
  });

  describe("Legend", () => {
    it("compiles legend with position", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
            name: "Series 1",
          },
        ],
        legend: { show: true, position: "top" },
      };

      const option = compile(ir);

      expect(option.legend).toMatchObject({
        show: true,
        top: "top",
        orient: "horizontal",
      });
    });

    it("compiles legend with custom items", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
          },
        ],
        legend: { show: true, items: ["Custom A", "Custom B"] },
      };

      const option = compile(ir);

      expect((option.legend as any).data).toEqual(["Custom A", "Custom B"]);
    });

    it("auto-generates legend items from marks", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
            name: "Sales",
          },
          {
            id: "m2",
            datasetId: "d1",
            geometry: "bar",
            encode: { x: "x", y: "y" },
            name: "Profit",
          },
        ],
        legend: { show: true },
      };

      const option = compile(ir);

      expect((option.legend as any).data).toEqual(["Sales", "Profit"]);
    });
  });

  describe("Tooltip", () => {
    it("compiles tooltip with trigger", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
          },
        ],
        tooltip: { show: true, trigger: "axis" },
      };

      const option = compile(ir);

      expect(option.tooltip).toEqual({ show: true, trigger: "axis" });
    });
  });

  describe("Grid", () => {
    it("compiles grid positioning", () => {
      const ir: ChartIR = {
        datasets: [
          {
            id: "d1",
            columns: [
              { name: "x", type: "string" },
              { name: "y", type: "number" },
            ],
            rows: [],
          },
        ],
        marks: [
          {
            id: "m1",
            datasetId: "d1",
            geometry: "line",
            encode: { x: "x", y: "y" },
          },
        ],
        grid: {
          left: "10%",
          right: "10%",
          top: "60",
          bottom: "60",
          containLabel: true,
        },
      };

      const option = compile(ir);

      expect(option.grid).toEqual({
        left: "10%",
        right: "10%",
        top: "60",
        bottom: "60",
        containLabel: true,
      });
    });
  });

  describe("Complete examples", () => {
    it("compiles a multi-series chart", () => {
      const ir: ChartIR = {
        title: "Monthly Revenue",
        datasets: [
          {
            id: "revenue",
            columns: [
              { name: "month", type: "string" },
              { name: "sales", type: "number" },
              { name: "profit", type: "number" },
            ],
            rows: [
              ["Jan", "120", "20"],
              ["Feb", "200", "45"],
              ["Mar", "150", "30"],
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
            name: "Sales",
            style: { color: "#5470c6" },
          },
          {
            id: "profit-bar",
            datasetId: "revenue",
            geometry: "bar",
            encode: { x: "month", y: "profit" },
            name: "Profit",
            style: { color: "#91cc75", opacity: 0.8 },
          },
        ],
        axes: [
          { id: "x", type: "category", position: "bottom" },
          { id: "y", type: "value", position: "left" },
        ],
        legend: { show: true, position: "top" },
        tooltip: { show: true, trigger: "axis" },
      };

      const option = compile(ir);

      // Verify structure
      expect(option.title).toEqual({ text: "Monthly Revenue" });
      expect(option.dataset).toHaveLength(1);
      expect(option.series).toHaveLength(2);
      expect(option.xAxis).toBeDefined();
      expect(option.yAxis).toBeDefined();
      expect(option.legend).toBeDefined();
      expect(option.tooltip).toBeDefined();

      // Verify series types
      const series = option.series as any[];
      expect(series[0].type).toBe("line");
      expect(series[0].smooth).toBe(true);
      expect(series[1].type).toBe("bar");

      // Verify data conversion
      const dataset = (option.dataset as any[])[0];
      expect(dataset.source[0]).toEqual(["Jan", 120, 20]);
    });
  });
});
