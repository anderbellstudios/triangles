const getEmptyCells = board => board.reduce((emptyCells, playerInCell, cellIndex) => playerInCell === null ? [...emptyCells, cellIndex] : emptyCells, [])

export default getEmptyCells
