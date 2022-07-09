import AppState from '@12joan/app-state'

const makeNewGame = () => ({
  board: Array.from({ length: 16 }, () => null),
  currentTurn: 'cross',
  moveHistory: [],
})

const appState = new AppState({
  app: {
    game: makeNewGame(),
  },
})

const getNthNextTurn = (currentTurn, n) => {
  if (n === 0) return currentTurn

  if (n === 1) return ({
    cross: 'circle',
    circle: 'triangle',
    triangle: 'cross',
  }[currentTurn])

  if (n === 2) return ({
    cross: 'triangle',
    circle: 'cross',
    triangle: 'circle',
  }[currentTurn])

  return getNthNextTurn(currentTurn, ((n % 3) + 3) % 3)
}

const performMove = index => {
  appState.transaction(t => {
    t.transform('app.game.board', board => {
      const newBoard = [...board]
      newBoard[index] = appState.get('app.game.currentTurn')
      return newBoard
    })

    t.transform('app.game.currentTurn', currentTurn => getNthNextTurn(currentTurn, 1))

    t.transform('app.game.moveHistory', moveHistory => [...moveHistory, index])
  })
}

const performNewGame = () => appState.set('app.game', makeNewGame())

const performUndo = () => appState.transaction(t => {
  const moveHistory = [...appState.get('app.game.moveHistory')]
  const lastMove = moveHistory.pop()

  t.transform('app.game.board', board => {
    const newBoard = [...board]
    newBoard[lastMove] = null
    return newBoard
  })

  t.set('app.game.moveHistory', moveHistory)

  t.transform('app.game.currentTurn', currentTurn => getNthNextTurn(currentTurn, -1))
})

export {
  getNthNextTurn,
  performMove,
  performNewGame,
  performUndo,
}

export default appState
