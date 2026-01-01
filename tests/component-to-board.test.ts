import { expect, test } from "bun:test"
import type { AnyCircuitElement, PcbNoteDimension } from "circuit-json"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import { DimensionPlacementSolver } from "../src/index"
import circuitJson from "./assets/component-to-board.json"

test("svg snapshot example", async () => {
  const solver = new DimensionPlacementSolver(
    circuitJson as AnyCircuitElement[],
  )

  const solved_dimensions = solver.getOutput()

  const dimension_notes: PcbNoteDimension[] = solved_dimensions.map(
    (d, i): PcbNoteDimension => {
      const length = Math.hypot(d.to.x - d.from.x, d.to.y - d.from.y)
      return {
        type: "pcb_note_dimension",
        pcb_note_dimension_id: `dim_${i}`,
        from: d.from,
        to: d.to,
        text: length.toFixed(2),
        offset_distance: d.offset_distance,
        offset_direction: d.offset_direction,
        font: "tscircuit2024",
        font_size: 0.5,
        arrow_size: 0.5,
      }
    },
  )

  const circuitJsonWithDimensions: AnyCircuitElement[] = [
    ...(circuitJson as AnyCircuitElement[]),
    ...dimension_notes,
  ]

  const pcbSvg = convertCircuitJsonToPcbSvg(circuitJsonWithDimensions)

  await expect(pcbSvg).toMatchSvgSnapshot(import.meta.path)
})
