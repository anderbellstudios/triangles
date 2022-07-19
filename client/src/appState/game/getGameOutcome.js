import getNthNextTurn from './getNthNextTurn'

const positionToIndex = ([x, y]) => x + 4 * y
const indexToPosition = index => [index % 4, Math.floor(index / 4)]

const makeWinningLine = ([x, y], [dx, dy]) =>
  [
    [x, y],
    [x + dx, y + dy],
    [x + 2 * dx, y + 2 * dy],
  ].map(positionToIndex)

const horizontal = [1, 0]
const vertical = [0, 1]
const leadingDiagonal = [1, 1]
const trailingDiagonal = [-1, 1]

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

const getGameOutcome = game => {
  const { board, moveHistory, currentTurn } = game
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

  if (winner !== null) return { type: 'win', winner, winningLineEndpoints }
  else if (moveHistory.length === 16) return { type: 'draw' }
  else return { type: 'in-progress' }
}

export default getGameOutcome
