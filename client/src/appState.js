import AppState from '@12joan/app-state'

const makeEmptyBoard = () => Array.from({ length: 16 }, () => null)

const appState = new AppState({
  app: {
    game: {
      board: makeEmptyBoard(),
      currentTurn: 'cross',
    },
  },
})

const getNthNextTurn = (currentTurn, n) => {
  if (n === 0) return currentTurn

  if (n === 1) return ({
    cross: 'circle',
    circle: 'triangle',
    triangle: 'cross',
  }[currentTurn])

  return getNthNextTurn(getNthNextTurn(currentTurn, 1), n - 1)
}

const performMove = index => {
  appState.transaction(t => {
    t.transform('app.game.board', board => {
      const newBoard = [...board]
      newBoard[index] = appState.get('app.game.currentTurn')
      return newBoard
    })

    t.transform('app.game.currentTurn', currentTurn => getNthNextTurn(currentTurn, 1))
  })
}

const performNewGame = () => {
  appState.transform('app.game', game => ({
    ...game,
    board: makeEmptyBoard(),
    currentTurn: 'cross',
  }))
}

export {
  getNthNextTurn,
  performMove,
  performNewGame,
}

export default appState
