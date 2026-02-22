# Development

This guide covers setting up the development environment and contributing to EChartify.

## Prerequisites

- **Node.js** 20.x or 22.x
- **Go** 1.25.x or 1.26.x
- **npm** 9.x or later

## Setup

### Clone the Repository

```bash
git clone https://github.com/grokify/echartify.git
cd echartify
```

### TypeScript Setup

```bash
cd ts
npm install
```

### Go Setup

```bash
go mod download
```

## Development Workflow

### TypeScript

```bash
cd ts

# Run tests (53 tests)
npm test

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build

# Run linter
npm run lint

# Generate JSON Schema from Zod
npm run generate:schema

# Start visual demo
npm run demo
```

### Go

```bash
# Run tests (10 tests)
go test -v ./...

# Run linter
golangci-lint run

# Check coverage
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## Project Structure

```
echartify/
├── ts/                          # TypeScript (source of truth)
│   ├── src/
│   │   ├── schema/              # Zod schemas
│   │   ├── compiler/            # IR → ECharts compiler
│   │   └── index.ts             # Main exports
│   ├── tests/                   # Test files
│   ├── demo/                    # Visual demo
│   └── scripts/                 # Build scripts
│
├── schema/                      # JSON Schema (generated)
│   ├── schema.go                # Go embed
│   └── chartir.schema.json
│
├── chartir/                     # Go types
│
└── examples/                    # Example IR documents
```

## Adding a New Chart Type

### 1. Update TypeScript Schema

Edit `ts/src/schema/mark.ts`:

```typescript
export const geometrySchema = z.enum([
  "line",
  "bar",
  "pie",
  "scatter",
  "area",
  "radar",  // New geometry
]);
```

### 2. Update Compiler

Edit `ts/src/compiler/compile.ts`:

```typescript
function mapGeometry(geometry: Geometry): string {
  switch (geometry) {
    // ... existing cases
    case "radar":
      return "radar";
  }
}

function compileMark(mark: Mark): Record<string, unknown> {
  // ... add radar-specific handling
}
```

### 3. Add Tests

Create tests in `ts/tests/compiler.test.ts`:

```typescript
test("compiles radar chart", () => {
  const ir: ChartIR = {
    datasets: [{ /* ... */ }],
    marks: [{
      id: "radar",
      datasetId: "data",
      geometry: "radar",
      encode: { /* ... */ }
    }]
  };

  const option = compile(ir);
  expect(option.series?.[0]).toMatchObject({
    type: "radar"
  });
});
```

### 4. Update Go Types

Edit `chartir/mark.go`:

```go
const (
    GeometryLine    Geometry = "line"
    GeometryBar     Geometry = "bar"
    // ...
    GeometryRadar   Geometry = "radar"
)
```

### 5. Add Example

Create `examples/radar-chart.json`:

```json
{
  "datasets": [{ "id": "data", /* ... */ }],
  "marks": [{
    "id": "radar",
    "datasetId": "data",
    "geometry": "radar",
    "encode": { /* ... */ }
  }]
}
```

### 6. Regenerate Schema

```bash
cd ts && npm run generate:schema
```

### 7. Run All Tests

```bash
# TypeScript
cd ts && npm test

# Go
go test -v ./...
```

## Running the Demo

The visual demo renders charts from IR in the browser:

```bash
cd ts
npm run demo
# Opens http://localhost:3000
```

The demo includes:

- Line chart with smooth curves
- Bar chart with styling
- Stacked bar chart
- Pie chart with legend
- Multi-series chart

## Code Style

### TypeScript

- ESLint with `@typescript-eslint` rules
- 2-space indentation
- Semicolons required
- Single quotes for strings

### Go

- `gofmt` for formatting
- `golangci-lint` for linting
- Standard Go conventions

## CI/CD Workflows

| Workflow | Triggers | Description |
|----------|----------|-------------|
| Go CI | Push/PR to `**.go` | Tests on Go 1.25.x/1.26.x |
| Go Lint | Push/PR to `**.go` | golangci-lint |
| Go SAST | Push/PR, weekly | CodeQL security scan |
| TS CI | Push/PR to `ts/**` | Tests on Node 20.x/22.x |
| TS Lint | Push/PR to `ts/**` | ESLint |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make changes with tests
4. Run tests:
   - `npm test` (TypeScript)
   - `go test ./...` (Go)
5. Run linters:
   - `npm run lint` (TypeScript)
   - `golangci-lint run` (Go)
6. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
7. Push and create a pull request

## Release Process

1. Update version in `ts/package.json`
2. Update `CHANGELOG.json` with new entries
3. Run `schangelog generate CHANGELOG.json -o CHANGELOG.md`
4. Commit: `git commit -m "chore: prepare vX.Y.Z release"`
5. Tag: `git tag vX.Y.Z`
6. Push: `git push origin main --tags`
