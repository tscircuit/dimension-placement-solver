# dimension-placement-solver

Solves for the placement of dimension lines for engineering diagrams.

```typescript
import { DimensionPlacementSolver } from "dimension-placement-solver"

const solver = new DimensionPlacementSolver([
  // Array of circuit elements from circuit-json
  // e.g. pcb_dimension, smd_port, trace etc.
])

solver.solve()

solver.getOutput()
// SolvedAnchorDimensions object
```

### Solved Anchor Dimensions

This is the format of the output from `getOutput`. It is a map from a `circuit_json_element_id` to the solved dimension anchor offsets.

```typescript
export interface SolvedAnchorDimensions {
  [circuitJsonElementId: string]: {
    horizontal_offset: number
    vertical_offset: number
  }
}
```
