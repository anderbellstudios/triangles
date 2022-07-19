import getNthNextTurn from './getNthNextTurn'

const gameWithMove = (game, move) => ({
  ...game,
  board: [
    ...game.board.slice(0, move),
    game.currentTurn,
    ...game.board.slice(move + 1),
  ],
  moveHistory: [...game.moveHistory, move],
  currentTurn: getNthNextTurn(game.currentTurn, 1),
})

export default gameWithMove
