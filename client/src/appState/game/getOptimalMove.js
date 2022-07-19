import getEmptyCells from './getEmptyCells'

const getOptimalMove = game => {
  const emptyCells = getEmptyCells(game.board)
  return emptyCells[Math.floor(Math.random() * emptyCells.length)]
}

export default getOptimalMove
