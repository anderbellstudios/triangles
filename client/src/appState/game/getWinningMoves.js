import getEmptyCells from './getEmptyCells'
import gameWithMove from './gameWithMove'
import getGameOutcome from './getGameOutcome'

const getWinningMoves = (game, player) => {
  const gameWithCurrentTurn = { ...game, currentTurn: player }

  return getEmptyCells(gameWithCurrentTurn.board).filter(move => {
    const gameAfterMove = gameWithMove(gameWithCurrentTurn, move)
    return getGameOutcome(gameAfterMove).type === 'win'
  })
}

export default getWinningMoves
