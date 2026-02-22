# EChartify v0.1.0 Release Notes

**Release Date:** 2026-02-21

## Overview

EChartify v0.1.0 is the initial release of a non-polymorphic JSON Intermediate Representation (IR) for Apache ECharts. This library enables AI assistants and developers to reliably generate and validate chart configurations using a simple, uniform schema.

## Highlights

- **Non-polymorphic JSON IR** - Same structure for all chart types, eliminating the complexity of ECharts' polymorphic options
- **TypeScript-first architecture** - Zod schemas serve as the source of truth with full type inference
- **Dual-language support** - Both TypeScript/JavaScript and Go implementations available

## Key Features

### Chart IR Schema

The IR supports common chart types with a unified structure:

| Component | Description |
|-----------|-------------|
| **Dataset** | Typed columns with string-based rows for static compatibility |
| **Mark** | Visual representation with geometry type (line, bar, pie, scatter, area) |
| **Axis** | Category, value, time, and log axis types |
| **Legend** | Configurable position and visibility |
| **Tooltip** | Item and axis trigger modes |
| **Grid** | Layout positioning |

### IR-to-ECharts Compiler

The TypeScript compiler transforms IR documents into valid ECharts options:

- Automatic type coercion (string → number based on column metadata)
- Geometry-specific option mapping
- Encode field translation

### Validation

Zod schemas provide runtime validation with detailed error messages, ideal for AI-generated content validation loops.

## Installation

```bash
# TypeScript/JavaScript
npm install @grokify/echartify

# Go
go get github.com/grokify/echartify
```

## Quick Example

```typescript
import { chartIRSchema, compile } from "@grokify/echartify";

const ir = {
  datasets: [{
    id: "data",
    columns: [
      { name: "month", type: "string" },
      { name: "sales", type: "number" }
    ],
    rows: [["Jan", "100"], ["Feb", "150"], ["Mar", "200"]]
  }],
  marks: [{
    id: "line",
    datasetId: "data",
    geometry: "line",
    encode: { x: "month", y: "sales" }
  }]
};

const option = compile(chartIRSchema.parse(ir));
// Use with echarts.setOption(option)
```

## Test Coverage

- **TypeScript:** 53 tests covering schemas, compiler, and examples
- **Go:** 10 tests covering type definitions and schema embedding

## CI/CD

All workflows passing:

- Go CI (1.26.x/1.25.x on Linux/macOS/Windows)
- Go Lint (golangci-lint)
- Go SAST (CodeQL)
- TypeScript CI (Node.js 20.x/22.x)
- TypeScript Lint (ESLint 9.x)

## Documentation

- [README](README.md) - Quick start and schema reference
- [PRD](PRD.md) - Product requirements and design goals
- [TRD](TRD.md) - Technical architecture and implementation details
- [CHANGELOG](CHANGELOG.md) - Version history

## What's Next

Potential future enhancements:

- Additional chart types (radar, heatmap, treemap)
- Go compiler implementation
- MkDocs documentation site
- npm package publication

## Links

- **Repository:** https://github.com/grokify/echartify
- **TypeScript Package:** `@grokify/echartify`
- **Go Module:** `github.com/grokify/echartify`
