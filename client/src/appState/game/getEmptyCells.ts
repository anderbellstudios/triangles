import {Board, Move} from "../../../../common/types"

export const getEmptyCells = (board: Board): Move[] =>
  board.reduce(
    (emptyCells, playerInCell, cellIndex) =>
      playerInCell === null ? [...emptyCells, cellIndex as Move] : emptyCells,
    [] as Move[]
  )
