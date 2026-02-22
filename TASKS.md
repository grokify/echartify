# Echartify Implementation Tasks

## Overview

Transition from Go-first to TypeScript/Zod-first architecture where:

- **TypeScript/Zod** is the canonical source of truth for the Chart IR
- **JSON Schema** is generated from Zod
- **Go structs** are generated from JSON Schema (simpler, for persistence)
- **TypeScript compiler** transforms IR → ECharts options

## Phase 1: TypeScript/Zod Foundation ✅

- [x] Task 1.1: Initialize TypeScript project in `ts/` directory
- [x] Task 1.2: Define Zod schemas for all IR types
  - [x] ChartIR (top-level)
  - [x] Dataset
  - [x] Mark (with Geometry, CoordinateSystem, Encode)
  - [x] Axis (with AxisType, AxisPosition)
  - [x] Style
  - [x] Legend (with LegendPosition)
  - [x] Tooltip (with TooltipTrigger)
  - [x] Grid
- [x] Task 1.3: Export TypeScript types from Zod schemas
- [x] Task 1.4: Add unit tests for Zod schemas (17 tests passing)

## Phase 2: JSON Schema Generation ✅

- [x] Task 2.1: Add `zod-to-json-schema` dependency
- [x] Task 2.2: Create schema generation script (`scripts/generate-schema.ts`)
- [x] Task 2.3: Generate `chartir.schema.json` from Zod
- [x] Task 2.4: Verify generated schema works with Go embed (all Go tests passing)
- [x] Task 2.5: Pass schemalint strict check for static typing compatibility
  - Updated Dataset schema to use typed columns (Column with name/type)
  - Changed rows from mixed types `(string | number | null)[][]` to `string[][]`
  - Compiler parses string values to numbers based on column type metadata

## Phase 3: Go Struct Generation

- [ ] Task 3.1: Research Go struct generation from JSON Schema
  - Options: `go-jsonschema`, `quicktype`, custom generator
- [ ] Task 3.2: Set up generation pipeline
- [ ] Task 3.3: Generate Go structs from TypeScript-generated JSON Schema
- [ ] Task 3.4: Compare generated Go with hand-written Go
- [ ] Task 3.5: Replace hand-written Go with generated Go (or keep as reference)

## Phase 4: TypeScript Compiler (IR → ECharts) ✅

- [x] Task 4.1: Add ECharts type definitions
- [x] Task 4.2: Implement compiler function `compile(ir: ChartIR): EChartsOption`
- [x] Task 4.3: Implement geometry-specific compilation:
  - [x] Line series (with smooth, style)
  - [x] Bar series (with stack, style)
  - [x] Pie series (with value/name encoding)
  - [x] Scatter series
  - [x] Area series (line with areaStyle)
- [x] Task 4.4: Implement axis compilation (single/multiple, with name/min/max)
- [x] Task 4.5: Implement legend/tooltip/grid compilation
- [x] Task 4.6: Add compiler tests with example IR documents (21 compiler tests + 12 example tests)

## Phase 5: Integration & Documentation ✅

- [x] Task 5.1: Update PRD.md to reflect TypeScript-first approach
- [x] Task 5.2: Update TRD.md with new architecture diagram
- [x] Task 5.3: Update README.md with TypeScript usage examples
- [x] Task 5.4: npm package configuration (package.json already configured)
- [x] Task 5.5: Go package works (10 tests passing, schema embedded)

## Phase 6: Validation & Examples ✅

- [x] Task 6.1: Validate all example JSON files against Zod schema (12 tests)
- [x] Task 6.2: Compile all examples to ECharts options (tested)
- [x] Task 6.3: Create visual demo (`ts/demo/index.html` - run with `npm run demo`)
- [x] Task 6.4: Document AI assistant usage patterns (in README.md)

## Architecture After Completion

```
TypeScript + Zod (CANONICAL)
        │
        ├──► JSON Schema (generated)
        │         │
        │         └──► Go structs (generated, for persistence)
        │
        └──► TypeScript Compiler
                  │
                  └──► ECharts Option
```

## File Structure After Completion

```
echartify/
├── ts/                          # TypeScript (canonical)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── schema/              # Zod schemas (source of truth)
│   │   │   ├── index.ts
│   │   │   ├── chartir.ts
│   │   │   ├── dataset.ts
│   │   │   ├── mark.ts
│   │   │   ├── axis.ts
│   │   │   ├── style.ts
│   │   │   ├── legend.ts
│   │   │   ├── tooltip.ts
│   │   │   └── grid.ts
│   │   ├── compiler/            # IR → ECharts compiler
│   │   │   ├── index.ts
│   │   │   └── compile.ts
│   │   ├── types.ts             # Exported types
│   │   └── index.ts             # Main entry
│   ├── scripts/
│   │   └── generate-schema.ts   # JSON Schema generator
│   └── tests/
│       ├── schema.test.ts
│       └── compiler.test.ts
│
├── schema/                      # Generated JSON Schema
│   ├── chartir.schema.json      # Generated from Zod
│   └── schema.go                # Go embed (unchanged)
│
├── chartir/                     # Go types (may become generated)
│   └── ...
│
├── examples/                    # Example IR documents
│   └── ...
│
├── PRD.md
├── TRD.md
├── TASKS.md
└── README.md
```

## Progress Tracking

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 | ✅ Complete | TypeScript/Zod foundation (19 tests) |
| Phase 2 | ✅ Complete | JSON Schema generation from Zod + schemalint strict check |
| Phase 3 | ⏸️ Deferred | Go struct generation (optional - hand-written Go works) |
| Phase 4 | ✅ Complete | TypeScript compiler (22 tests) |
| Phase 5 | ✅ Complete | Documentation updated |
| Phase 6 | ✅ Complete | Visual demo + example validation (12 tests) |

## Test Summary

- **TypeScript: 53 tests passing**
  - Schema: 19 tests
  - Compiler: 22 tests
  - Examples: 12 tests
- **Go: 10 tests passing**
- **Total: 63 tests**

## How to Run

```bash
# TypeScript tests
cd ts && npm test

# Go tests
go test -v ./...

# Visual demo
cd ts && npm run demo
```
