import type {
  AnyCircuitElement,
  PcbBoard,
  PcbComponent,
  PcbGroup,
  PcbPanel,
} from "circuit-json"

interface PositionedElement {
  id: string
  type: "pcb_component" | "pcb_group" | "pcb_board" | "pcb_panel"
  center: { x: number; y: number }
  width: number
  height: number
}

// Represents a positional relationship between two elements
export interface NormalizedAnchorOffset {
  from: { x: number; y: number }
  to: { x: number; y: number }
  offset: { x: string | number; y: string | number }
}

type PcbEle = PcbComponent | PcbGroup | PcbBoard | PcbPanel

export const normalizeAnchorOffsets = (
  elements: AnyCircuitElement[],
): NormalizedAnchorOffset[] => {
  const normalized_offsets: NormalizedAnchorOffset[] = []

  const pcb_elements_with_id = elements.filter(
    (e): e is PcbEle =>
      e.type === "pcb_component" ||
      e.type === "pcb_group" ||
      e.type === "pcb_board" ||
      e.type === "pcb_panel",
  )

  const elements_by_id: Record<string, PcbEle> = {}
  for (const elm of pcb_elements_with_id) {
    if (elm.type === "pcb_component") elements_by_id[elm.pcb_component_id] = elm
    if (elm.type === "pcb_group") elements_by_id[elm.pcb_group_id] = elm
    if (elm.type === "pcb_board") elements_by_id[elm.pcb_board_id] = elm
    if (elm.type === "pcb_panel") elements_by_id[elm.pcb_panel_id] = elm
  }

  const getPosElm = (id: string): PositionedElement | null => {
    const elm = elements_by_id[id]
    if (!elm) return null
    if (elm.width === undefined || elm.height === undefined) return null
    // All these types have a center, width and height
    return {
      id,
      type: elm.type,
      center: elm.center,
      width: elm.width,
      height: elm.height,
    }
  }

  for (const elm of pcb_elements_with_id) {
    let parent_id: string | undefined
    let child_id: string | undefined

    if (elm.type === "pcb_component" || elm.type === "pcb_group") {
      if (elm.position_mode === "relative_to_group_anchor") {
        child_id =
          elm.type === "pcb_component" ? elm.pcb_component_id : elm.pcb_group_id
        parent_id =
          elm.positioned_relative_to_pcb_group_id ??
          elm.positioned_relative_to_pcb_board_id
      }
    } else if (elm.type === "pcb_board") {
      if (elm.position_mode === "relative_to_panel_anchor") {
        child_id = elm.pcb_board_id
        const panel = pcb_elements_with_id.find((e) => e.type === "pcb_panel")
        if (panel) {
          parent_id = panel.pcb_panel_id
        }
      }
    }

    if (
      child_id &&
      parent_id &&
      "display_offset_x" in elm &&
      "display_offset_y" in elm &&
      elm.display_offset_x !== undefined &&
      elm.display_offset_y !== undefined
    ) {
      const child = getPosElm(child_id)
      const parent = getPosElm(parent_id)

      if (child && parent) {
        normalized_offsets.push({
          from: parent.center,
          to: child.center,
          offset: { x: elm.display_offset_x, y: elm.display_offset_y },
        })
      }
    }
  }

  return normalized_offsets
}
