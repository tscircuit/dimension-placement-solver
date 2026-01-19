import { BaseSolver } from "@tscircuit/solver-utils"
import type { CreatedDimension } from "../index"
import type { NormalizedAnchorOffset } from "./normalize-anchor-offsets"

export class SplitOffsetsSolver extends BaseSolver {
  _output: CreatedDimension[] = []

  constructor(private normalizedAnchorOffsets: NormalizedAnchorOffset[]) {
    super()
  }

  override _setup() {
    this._output = this.normalizedAnchorOffsets.flatMap((norm_offset) => {
      const { from, offset } = norm_offset
      const offsetX =
        typeof offset.x === "number"
          ? offset.x
          : Number.parseFloat(offset.x as string)
      const offsetY =
        typeof offset.y === "number"
          ? offset.y
          : Number.parseFloat(offset.y as string)
      const to = { x: from.x + offsetX, y: from.y + offsetY }
      if (offsetX !== 0 && offsetY !== 0) {
        // diagonal, split into x and y dimensions in sequence
        const result = []
        // X dimension: horizontal from start to horizontal end
        const horizontalEnd = { x: from.x + offsetX, y: from.y }
        const vxX = horizontalEnd.x - from.x
        const vyX = horizontalEnd.y - from.y
        const lenX = Math.hypot(vxX, vyX)
        const perpXX = -vyX / lenX
        const perpYX = vxX / lenX
        result.push({
          from,
          to: horizontalEnd,
          offset_distance: 0,
          offset_direction: { x: perpXX, y: perpYX },
          x_offset: offsetX,
        })
        // Y dimension: vertical from horizontal end to final end
        const finalEnd = { x: from.x + offsetX, y: from.y + offsetY }
        const vxY = finalEnd.x - horizontalEnd.x
        const vyY = finalEnd.y - horizontalEnd.y
        const lenY = Math.hypot(vxY, vyY)
        const perpXY = -vyY / lenY
        const perpYY = vxY / lenY
        result.push({
          from: horizontalEnd,
          to: finalEnd,
          offset_distance: 0,
          offset_direction: { x: perpXY, y: perpYY },
          y_offset: offsetY,
        })
        return result
      }
      // non-diagonal, keep the diagonal dimension
      const vx = to.x - from.x
      const vy = to.y - from.y
      const len = Math.hypot(vx, vy)
      let perpX = 0
      let perpY = 1
      if (len > 0) {
        perpX = -vy / len
        perpY = vx / len
      }
      return [
        {
          from,
          to,
          offset_distance: 0,
          offset_direction: { x: perpX, y: perpY },
        },
      ]
    })
    this.solved = true
  }

  override getOutput(): CreatedDimension[] {
    return this._output
  }
}
