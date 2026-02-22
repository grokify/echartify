/**
 * ECharts option types used by the compiler.
 * These are simplified versions focused on what we generate.
 */

// Define our own EChartsOption type to avoid echarts import issues.
// This covers the subset of options we actually generate.
export interface EChartsOption {
  title?: { text?: string; subtext?: string };
  dataset?: EChartsDataset | EChartsDataset[];
  series?: Record<string, unknown>[];
  xAxis?: EChartsAxis | EChartsAxis[];
  yAxis?: EChartsAxis | EChartsAxis[];
  legend?: Record<string, unknown>;
  tooltip?: Record<string, unknown>;
  grid?: Record<string, unknown>;
}

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
