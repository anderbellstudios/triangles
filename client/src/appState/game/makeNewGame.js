const makeNewGame = ({ version = 1 } = {}) => ({
  version,
  board: Array.from({ length: 16 }, () => null),
  currentTurn: 'cross',
  moveHistory: [],
})

export default makeNewGame
