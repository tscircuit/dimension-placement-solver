import type { AnyCircuitElement, Length } from "circuit-json"
import { BasePipelineSolver } from "@tscircuit/solver-utils"
import type { PipelineStep } from "@tscircuit/solver-utils"
import { NormalizeAnchorOffsetsSolver } from "./lib/normalize-anchor-offsets-solver"
import { SplitOffsetsSolver } from "./lib/split-offsets-solver"
export type { NormalizedAnchorOffset } from "./lib/normalize-anchor-offsets"

export type SolverInput = AnyCircuitElement[]

export interface CreatedDimension {
  /** The two points on the PCB being dimensioned */
  from: { x: number; y: number }
  to: { x: number; y: number }
  offset_distance?: Length
  offset_direction?: {
    x: number
    y: number
  }
  /** For split dimensions, the x/y offset values to display */
  x_offset?: number
  y_offset?: number
}

export type SolverOutput = CreatedDimension[]

export class DimensionPlacementSolver extends BasePipelineSolver<SolverInput> {
  pipelineDef: PipelineStep<
    NormalizeAnchorOffsetsSolver | SplitOffsetsSolver
  >[] = [
    {
      solverName: "normalize_anchor_offsets",
      solverClass: NormalizeAnchorOffsetsSolver,
      getConstructorParams: (self: DimensionPlacementSolver) => [
        self.inputProblem,
      ],
      onSolved: (self: DimensionPlacementSolver) => {
        const solver = self.getSolver<NormalizeAnchorOffsetsSolver>(
          "normalize_anchor_offsets",
        )
        if (solver) {
          self.pipelineOutputs.normalized_anchor_offsets = solver.getOutput()
        }
      },
    },
    {
      solverName: "split_offsets",
      solverClass: SplitOffsetsSolver,
      getConstructorParams: (self: DimensionPlacementSolver) => [
        self.pipelineOutputs.normalized_anchor_offsets ?? [],
      ],
      onSolved: (self: DimensionPlacementSolver) => {
        const solver = self.getSolver<SplitOffsetsSolver>("split_offsets")
        if (solver) {
          self.pipelineOutputs.created_dimensions = solver.getOutput()
        }
      },
    },
  ]

  override getOutput(): SolverOutput {
    return this.pipelineOutputs.created_dimensions ?? []
  }
}
