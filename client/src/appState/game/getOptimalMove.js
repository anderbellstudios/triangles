import getWinningMoves from './getWinningMoves'
import getNthNextTurn from './getNthNextTurn'
import getEmptyCells from './getEmptyCells'
import gameWithMove from './gameWithMove'

// Pretrained weights for the likelihood of each starting move to result in a win
const moveWeights = {
  0: 5,
  1: 24,
  2: 24,
  3: 5,
  4: 24,
  5: 75,
  6: 75,
  7: 24,
  8: 24,
  9: 75,
  10: 75,
  11: 24,
  12: 5,
  13: 24,
  14: 24,
  15: 5,
}

// Moves that do not forgo a win or assure a loss
const getSensibleMoves = game => {
  const currentPlayer = game.currentTurn
  const nextPlayer = getNthNextTurn(currentPlayer, 1)
  const lastPlayer = getNthNextTurn(currentPlayer, 2)

  // Play a winning move if possible
  const winningMoves = getWinningMoves(game, currentPlayer)
  if (winningMoves.length > 0) return winningMoves

  // If the next player is about to win, block them
  const nextPlayerWinningMoves = getWinningMoves(game, nextPlayer)
  if (nextPlayerWinningMoves.length > 0) return nextPlayerWinningMoves

  // If the last player has at least 2 winning moves, block them
  const lastPlayerWinningMoves = getWinningMoves(game, lastPlayer)
  if (lastPlayerWinningMoves.length >= 2) return lastPlayerWinningMoves

  // Otherwise, any empty cell is a sensible move
  return getEmptyCells(game.board)
}

// All sensible moves with a maximal number of subsequent winning moves
const getOptimalMoves = game => {
  let maxWinningMoves = 0
  let optimalMoves = []

  getSensibleMoves(game).forEach(move => {
    const gameAfterMove = gameWithMove(game, move)
    const winningMoves = getWinningMoves(gameAfterMove, game.currentTurn).length

    if (winningMoves === maxWinningMoves) {
      optimalMoves.push(move)
    } else if (winningMoves > maxWinningMoves) {
      maxWinningMoves = winningMoves
      optimalMoves = [move]
    }
  })

  return optimalMoves
}

// Pick a weighted random move from the optimal moves using a set of pretrained weights
const getOptimalMove = game => {
  const optimalMoves = getOptimalMoves(game)

  const totalWeight = optimalMoves.reduce(
    (totalWeight, move) => totalWeight + moveWeights[move],
    0
  )
  const randomWeight = Math.floor(Math.random() * totalWeight)

  let cumulativeWeight = 0

  for (const move of optimalMoves) {
    cumulativeWeight += moveWeights[move]

    if (cumulativeWeight >= randomWeight) return move
  }

  throw new Error('Could not find an optimal move')
}

export default getOptimalMove
