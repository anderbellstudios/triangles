const makeNewGame = (oldGame = {}) => ({
  version: 1,
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
