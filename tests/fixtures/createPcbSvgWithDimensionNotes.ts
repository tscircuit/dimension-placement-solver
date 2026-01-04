import type { AnyCircuitElement, PcbNoteDimension } from "circuit-json"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import type { SolverOutput } from "src"

export async function createPcbSvgWithDimensionNotes(
  circuitJson: AnyCircuitElement[],
  dimensions: SolverOutput,
): Promise<string> {
  const dimension_notes: PcbNoteDimension[] = dimensions.map(
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
    ...circuitJson,
    ...dimension_notes,
  ]

  return convertCircuitJsonToPcbSvg(circuitJsonWithDimensions, {
    showPcbGroups: true,
  })
}

export default createPcbSvgWithDimensionNotes
