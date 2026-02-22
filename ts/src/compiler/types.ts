/**
 * ECharts option types used by the compiler.
 * These are simplified versions focused on what we generate.
 */

import type { EChartsOption } from "echarts";

// Re-export EChartsOption for convenience
export type { EChartsOption };

// Series types we support
export type EChartsSeriesType = "line" | "bar" | "pie" | "scatter";

// Base series configuration
export interface EChartsSeries {
  type: EChartsSeriesType;
  name?: string;
  datasetIndex?: number;
  encode?: {
    x?: string;
    y?: string;
    value?: string;
    itemName?: string;
  };
  smooth?: boolean;
  stack?: string;
  areaStyle?: Record<string, unknown>;
  itemStyle?: {
    color?: string;
    opacity?: number;
    borderColor?: string;
    borderWidth?: number;
  };
  lineStyle?: {
    color?: string;
    opacity?: number;
  };
}

// Axis configuration
export interface EChartsAxis {
  type?: "category" | "value" | "time" | "log";
  name?: string;
  min?: number;
  max?: number;
  data?: string[];
}

// Dataset configuration
export interface EChartsDataset {
  id?: string;
  source: (string | number | null)[][];
  dimensions?: string[];
}
