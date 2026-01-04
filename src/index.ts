import type { AnyCircuitElement, Length } from "circuit-json"
import { BasePipelineSolver } from "@tscircuit/solver-utils"
import type { PipelineStep } from "@tscircuit/solver-utils"
import { NormalizeAnchorOffsetsSolver } from "./lib/normalize-anchor-offsets-solver"
import type { NormalizedAnchorOffset } from "./lib/normalize-anchor-offsets"
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
}

export type SolverOutput = CreatedDimension[]

export class DimensionPlacementSolver extends BasePipelineSolver<SolverInput> {
  pipelineDef: PipelineStep<NormalizeAnchorOffsetsSolver>[] = [
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
  ]

  constructor(inputProblem: SolverInput) {
    super(inputProblem)
  }

  override getOutput(): SolverOutput {
    // TODO: implement next solver to calculate offset_distance and offset_direction
    const normalized_offsets: NormalizedAnchorOffset[] =
      this.pipelineOutputs.normalized_anchor_offsets ?? []

    return normalized_offsets.map((norm_offset) => ({
      from: norm_offset.from,
      to: norm_offset.to,
    }))
  }
}
