import { expect, test } from "bun:test"
import { type AnyCircuitElement } from "circuit-json"
import { DimensionPlacementSolver } from "../src/index"
import circuitJson from "./assets/group-to-board.json"
import createPcbSvgWithDimensionNotes from "./fixtures/createPcbSvgWithDimensionNotes"

test("group to board", async () => {
  const solver = new DimensionPlacementSolver(
    circuitJson as AnyCircuitElement[],
  )

  solver.solve()
  const dimensions = solver.getOutput()

  const pcbSvg = createPcbSvgWithDimensionNotes(
    circuitJson as AnyCircuitElement[],
    dimensions,
  )

  await expect(pcbSvg).toMatchSvgSnapshot(import.meta.path)
})
