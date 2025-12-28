# dimension-placement-solver

Solves for the placement of dimension lines for engineering diagrams.

```typescript
import { DimensionPlacementSolver } from "dimension-placement-solver"

const example_elements = [
  // A PCB board, which acts as the coordinate space and a group for
  // child components.
  {
    type: "pcb_board",
    pcb_board_id: "board_0",
    center: { x: 0, y: 0 },
    width: 20,
    height: 12,
  },
  // A component on the board
  {
    type: "pcb_component",
    pcb_component_id: "comp_0",
    center: { x: 1.5, y: 2.5 },
    width: 1.56,
    height: 0.64,
    position_mode: "relative_to_group_anchor",
    positioned_relative_to_pcb_board_id: "board_0",
  },
  // A port on the first component
  {
    type: "pcb_port",
    pcb_port_id: "port_0",
    pcb_component_id: "comp_0",
    x: 2.01,
    y: 2.5,
  },
  // A second component
  {
    type: "pcb_component",
    pcb_component_id: "comp_1",
    center: { x: -1.5, y: -2.5 },
    width: 1.56,
    height: 0.64,
    position_mode: "relative_to_group_anchor",
    positioned_relative_to_pcb_board_id: "board_0",
  },
  // A port on the second component
  {
    type: "pcb_port",
    pcb_port_id: "port_1",
    pcb_component_id: "comp_1",
    x: -2.01,
    y: -2.5,
  },
]

const solver = new DimensionPlacementSolver(example_elements)

solver.solve()

const solved_dimensions = solver.getOutput()

console.log(solved_dimensions)
// e.g.
// [
//   {
//     "from": { "x": 2.01, "y": 2.5 },
//     "to": { "x": -2.01, "y": -2.5 },
//     "offset_distance": 5,
//     "offset_direction": {
//       "x": 0,
//       "y": 1
//     }
//   }
// ]
```

### Solver Output: Created Dimensions

This is the format of the output from `getOutput()`. It is an array of `CreatedDimension` objects, where each object contains all the information necessary to draw a dimension line.

```typescript
export interface CreatedDimension {
  /** The two points on the PCB being dimensioned */
  from: { x: number; y: number }
  to: { x: number; y: number }
  offset_distance?: number | string // e.g. 5 or "5mm"
  offset_direction?: {
    x: number
    y: number
  }
}
```
