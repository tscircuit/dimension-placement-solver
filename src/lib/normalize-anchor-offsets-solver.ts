import { BaseSolver } from "@tscircuit/solver-utils"
import type { AnyCircuitElement } from "circuit-json"
import {
  normalizeAnchorOffsets,
  type NormalizedAnchorOffset,
} from "./normalize-anchor-offsets"

export class NormalizeAnchorOffsetsSolver extends BaseSolver {
  _output: NormalizedAnchorOffset[] = []

  constructor(private elements: AnyCircuitElement[]) {
    super()
  }

  override _setup() {
    this._output = normalizeAnchorOffsets(this.elements)
    this.solved = true
  }

  override getOutput(): NormalizedAnchorOffset[] {
    return this._output
  }
}
