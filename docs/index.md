# EChartify

A non-polymorphic JSON Intermediate Representation (IR) for Apache ECharts that enables AI assistants to reliably generate and validate chart configurations.

## Why EChartify?

Apache ECharts uses a highly polymorphic `option` object where:

- The `series` array changes shape based on `type` (line, bar, pie, scatter, etc.)
- Fields are context-sensitive with implicit defaults
- Cross-field dependencies exist (e.g., coordinate systems affect valid fields)

This polymorphism makes it difficult for AI assistants to generate correct configurations. EChartify solves this with:

| Feature | Benefit |
|---------|---------|
| **Non-polymorphic IR** | Same structure for all chart types |
| **Simple JSON Schema** | No `oneOf`, `anyOf`, or conditional logic |
| **TypeScript-first** | Zod schemas as the source of truth |
| **Deterministic compiler** | IR → ECharts transformation |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Data Flow                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   AI / User                                             │
│       │                                                 │
│       ▼                                                 │
│   ┌─────────┐                                           │
│   │Chart IR │  ◄── Non-polymorphic JSON                 │
│   └────┬────┘                                           │
│        │                                                │
│        ├──────────────────┐                             │
│        ▼                  ▼                             │
│   ┌─────────┐       ┌───────────┐                       │
│   │  Zod    │       │JSON Schema│──► Go (backend)       │
│   │ Schema  │       │(generated)│                       │
│   └────┬────┘       └───────────┘                       │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                           │
│   │Compiler │                                           │
│   └────┬────┘                                           │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                           │
│   │ ECharts │                                           │
│   │ Option  │                                           │
│   └─────────┘                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Features

- **5 Chart Types**: Line, bar, pie, scatter, area
- **Typed Datasets**: Column metadata enables automatic type coercion
- **Validation**: Zod schemas provide detailed error messages
- **Dual Language**: TypeScript and Go implementations
- **AI-Ready**: Simple schema ideal for LLM code generation

## Quick Links

- [Getting Started](getting-started.md) - Installation and basic usage
- [Schema Reference](schema-reference.md) - Complete IR specification
- [Examples](examples.md) - Chart configuration examples
- [API Reference](api-reference.md) - TypeScript and Go APIs

## Project Status

[![Go CI](https://github.com/grokify/echartify/actions/workflows/go-ci.yaml/badge.svg)](https://github.com/grokify/echartify/actions/workflows/go-ci.yaml)
[![Go Lint](https://github.com/grokify/echartify/actions/workflows/go-lint.yaml/badge.svg)](https://github.com/grokify/echartify/actions/workflows/go-lint.yaml)
[![TS CI](https://github.com/grokify/echartify/actions/workflows/ts-ci.yaml/badge.svg)](https://github.com/grokify/echartify/actions/workflows/ts-ci.yaml)
[![TS Lint](https://github.com/grokify/echartify/actions/workflows/ts-lint.yaml/badge.svg)](https://github.com/grokify/echartify/actions/workflows/ts-lint.yaml)

## License

MIT
