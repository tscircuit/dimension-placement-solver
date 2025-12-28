import type { AnyCircuitElement, Length } from "circuit-json"
import { BasePipelineSolver } from "@tscircuit/solver-utils"
import type { PipelineStep } from "@tscircuit/solver-utils"

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
  pipelineDef: PipelineStep<any>[] = []

  constructor(inputProblem: SolverInput) {
    super(inputProblem)
  }

  override getOutput(): SolverOutput {
    // TODO.
    return []
  }
}
