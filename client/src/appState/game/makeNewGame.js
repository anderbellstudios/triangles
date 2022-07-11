import clientID from '../../clientID'
import makeRandomIdentifier from '../../randomIdentifier'

const makeNewGame = (oldGame = {}) => ({
  lastUpdatedBy: clientID,
  tag: makeRandomIdentifier(),
  computerPlayers: {
    cross: false,
    circle: false,
    triangle: false,
  },
  ...oldGame,
  board: Array.from({ length: 16 }, () => null),
  currentTurn: 'cross',
  moveHistory: [],
})

export default makeNewGame
