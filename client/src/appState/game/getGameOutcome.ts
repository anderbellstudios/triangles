import {Game, Shape} from '../../../../common/types'
import { getNthNextTurn } from './getNthNextTurn'

type Vec2 = [number, number]
type Line = [number, number, number]

export type GameOutcome =
  | { type: 'in-progress' }
  | { type: 'draw' }
  | { type: 'win'; winner: Shape; winningLineEndpoints: { start: Vec2; end: Vec2 } }

const positionToIndex = ([x, y]: Vec2) => x + 4 * y
const indexToPosition = (index: number): Vec2 => [index % 4, Math.floor(index / 4)]

const makeWinningLine = ([x, y]: Vec2, [dx, dy]: Vec2): Line =>
  [
    [x, y],
    [x + dx, y + dy],
    [x + 2 * dx, y + 2 * dy],
  ].map((position) => positionToIndex(position as Vec2)) as Line

const horizontal: Vec2 = [1, 0]
const vertical: Vec2 = [0, 1]
const leadingDiagonal: Vec2 = [1, 1]
const trailingDiagonal: Vec2 = [-1, 1]

const winningLines = [
  makeWinningLine([0, 0], horizontal),
  makeWinningLine([1, 0], horizontal),
  makeWinningLine([0, 1], horizontal),
  makeWinningLine([1, 1], horizontal),
  makeWinningLine([0, 2], horizontal),
  makeWinningLine([1, 2], horizontal),
  makeWinningLine([0, 3], horizontal),
  makeWinningLine([1, 3], horizontal),

  makeWinningLine([0, 0], vertical),
  makeWinningLine([0, 1], vertical),
  makeWinningLine([1, 0], vertical),
  makeWinningLine([1, 1], vertical),
  makeWinningLine([2, 0], vertical),
  makeWinningLine([2, 1], vertical),
  makeWinningLine([3, 0], vertical),
  makeWinningLine([3, 1], vertical),

  makeWinningLine([0, 0], leadingDiagonal),
  makeWinningLine([1, 1], leadingDiagonal),
  makeWinningLine([1, 0], leadingDiagonal),
  makeWinningLine([0, 1], leadingDiagonal),

  makeWinningLine([3, 0], trailingDiagonal),
  makeWinningLine([2, 1], trailingDiagonal),
  makeWinningLine([2, 0], trailingDiagonal),
  makeWinningLine([3, 1], trailingDiagonal),
]

export const getGameOutcome = ({ board, moveHistory, currentTurn }: Game): GameOutcome => {
  const lastTurn = getNthNextTurn(currentTurn, -1)

  let winner = null
  let winningLineEndpoints = null

  winningLines.forEach(winningLine => {
    if (winningLine.every(index => board[index] === lastTurn)) {
      winner = lastTurn

      winningLineEndpoints = {
        start: indexToPosition(winningLine[0]),
        end: indexToPosition(winningLine[2]),
      }
    }
  })

  if (winner !== null) return { type: 'win', winner, winningLineEndpoints: winningLineEndpoints! }
  else if (moveHistory.length === 16) return { type: 'draw' }
  else return { type: 'in-progress' }
}
