import getNthNextTurn from './getNthNextTurn'
import clientID from '../../clientID'
import makeRandomIdentifier from '../../randomIdentifier'

const makeNewGame = (oldGame = {}, cycleStartingTurn = false) => {
  const startingTurn = getNthNextTurn(oldGame.startingTurn ?? 'cross', cycleStartingTurn ? 1 : 0)

  return {
    lastUpdatedBy: clientID,
    tag: makeRandomIdentifier(),
    computerPlayers: {
      cross: false,
      circle: false,
      triangle: false,
    },
    ...oldGame,
    board: Array.from({ length: 16 }, () => null),
    startingTurn,
    currentTurn: startingTurn,
    moveHistory: [],
  }
}

export default makeNewGame
