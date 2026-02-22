# Echartify - Product Requirements Document

## Overview

Echartify is a non-polymorphic JSON Intermediate Representation (IR) for Apache ECharts that enables AI assistants to reliably generate and validate chart configurations.

## Problem Statement

Apache ECharts uses a highly polymorphic `option` object where:

- The `series` array changes shape based on `type` (line, bar, pie, scatter, etc.)
- Coordinate systems vary by configuration
- Components like axes, visualMap, and dataZoom have type-dependent structures
- Fields are context-sensitive with implicit defaults

This polymorphism makes it difficult for:

1. **AI assistants** to generate correct configurations without errors
2. **JSON Schema validation** to be simple and deterministic
3. **Backend systems** to validate chart definitions reliably

## Goals

1. **AI-Friendly Generation**: Enable AI assistants to produce valid chart configurations with high confidence
2. **Deterministic Validation**: Provide simple JSON Schema validation without `oneOf`, `anyOf`, or conditional logic
3. **TypeScript-First Architecture**: Zod schemas as the canonical source of truth, with JSON Schema generated for backend validation
4. **Rendering Correctness**: Compile IR to valid Apache ECharts `option` objects

## Non-Goals

- Exposing full ECharts polymorphism in the IR
- Supporting every ECharts feature (target 80% of common use cases)
- Replacing ECharts directly (ECharts remains the rendering backend)

## Target Users

| User | Need |
|------|------|
| AI Assistants | Generate valid chart IR without understanding ECharts polymorphism |
| Backend Services | Validate and store chart definitions |
| Frontend Applications | Compile IR to ECharts and render charts |
| Developers | Define charts declaratively with type safety |

## User Stories

### AI Assistant

> As an AI assistant, I want to generate chart configurations using a simple, uniform schema so that I can produce valid charts without understanding ECharts internals.

### Backend Developer

> As a backend developer, I want to validate chart IR against a simple JSON Schema so that I can reject invalid configurations before storing them.

### Frontend Developer

> As a frontend developer, I want to compile chart IR to ECharts options so that I can render charts without manual transformation.

### Data Analyst

> As a data analyst, I want to describe charts in terms of data, geometry, and encoding so that I don't need to learn ECharts-specific configuration.

## Features

### P0 - Must Have

1. **Non-Polymorphic IR Schema**
   - Single, uniform structure for all chart types
   - No discriminated unions in schema
   - Enum-driven geometry selection

2. **Core Geometries**
   - Line charts
   - Bar charts
   - Pie charts
   - Scatter plots
   - Area charts

3. **Data Model**
   - Tabular dataset representation
   - Typed columns with name and type metadata
   - String-encoded row values for static type safety
   - Column type metadata drives value parsing

4. **TypeScript/Zod Schemas (Source of Truth)**
   - Zod schemas as canonical IR definition
   - Generated JSON Schema for backend validation
   - Static type compatibility (passes schemalint strict check)

5. **TypeScript Compiler**
   - IR → ECharts `option` transformation
   - Parses string values to numbers based on column type
   - Type-safe compilation

6. **Go Types (Secondary)**
   - Go structs for backend persistence
   - Embedded JSON Schema for validation

### P1 - Should Have

1. **Extended Geometries**
   - Heatmaps
   - Radar charts
   - Treemaps
   - Funnel charts

2. **Styling**
   - Color configuration
   - Opacity
   - Basic theming

3. **Interactivity**
   - Tooltips
   - Legends
   - Basic zoom/pan

### P2 - Nice to Have

1. **Advanced Features**
   - Animations
   - Custom series
   - Geo/map charts

2. **Tooling**
   - CLI for validation
   - Playground/preview

## Success Metrics

| Metric | Target |
|--------|--------|
| AI generation success rate | >95% valid IR on first attempt |
| Schema complexity | Zero `oneOf`/`anyOf` in JSON Schema |
| Chart type coverage | 80% of common ECharts use cases |
| Compilation correctness | 100% valid ECharts output from valid IR |

## Constraints

1. **Static Type Compatibility**: IR must pass schemalint strict check (no mixed-type arrays)
2. **No Cross-Field Validation in Schema**: Complex constraints handled by compiler
3. **ECharts as Backend**: IR compiles to ECharts; no direct rendering
4. **String-Encoded Values**: All data values stored as strings with type metadata for parsing

## Timeline

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | TypeScript/Zod foundation | ✅ Complete |
| 2 | JSON Schema generation + strict check | ✅ Complete |
| 3 | Go struct generation (optional) | ⏸️ Deferred |
| 4 | TypeScript compiler (IR → ECharts) | ✅ Complete |
| 5 | Documentation + examples | ✅ Complete |
| 6 | Visual demo + validation | ✅ Complete |
