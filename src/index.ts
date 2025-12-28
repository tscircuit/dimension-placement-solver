import type { AnyCircuitElement } from "circuit-json"
import { BasePipelineSolver } from "@tscircuit/solver-utils"
import type { PipelineStep } from "@tscircuit/solver-utils"

export type SolverInput = AnyCircuitElement[]

export interface SolvedAnchorDimensions {
  [circuitJsonElementId: string]: {
    horizontal_offset: number
    vertical_offset: number
  }
}

export type SolverOutput = SolvedAnchorDimensions

export class DimensionPlacementSolver extends BasePipelineSolver<SolverInput> {
  pipelineDef: PipelineStep<any>[] = []

  constructor(inputProblem: SolverInput) {
    super(inputProblem)
  }

  override getOutput(): SolverOutput {
    // TODO.
    return {}
  }
}
