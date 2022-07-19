import gameWithMove from './gameWithMove'
import getGameOutcome from './getGameOutcome'

const getWinningMoves = (game, player) => {
  const gameWithCurrentTurn = { ...game, currentTurn: player }

  return gameWithCurrentTurn.board.reduce((winningMoves, playerInCell, cellIndex) => {
    if (playerInCell !== null)
      return winningMoves

    const gameAfterMove = gameWithMove(gameWithCurrentTurn, cellIndex)
    const gameOutcome = getGameOutcome(gameAfterMove)

    if (gameOutcome.type === 'win')
      return [...winningMoves, cellIndex]

    return winningMoves
  }, [])
}

export default getWinningMoves
