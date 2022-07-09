import appState from '..'
import getNthNextTurn from './getNthNextTurn'
import makeNewGame from './makeNewGame'

const withIncrementVersion = procedure => {
  appState.transaction(t => {
    t.transform('app.game.version', version => version + 1)
    procedure(t)
  })
}

const performMove = index => withIncrementVersion(t => {
  t.transform('app.game.board', board => {
    const newBoard = [...board]
    newBoard[index] = appState.get('app.game.currentTurn')
    return newBoard
  })

  t.transform('app.game.currentTurn', currentTurn => getNthNextTurn(currentTurn, 1))

  t.transform('app.game.moveHistory', moveHistory => [...moveHistory, index])
})

const performNewGame = () => withIncrementVersion(t => {
  t.transform('app.game', game => makeNewGame(game))
})

const performUndo = () => withIncrementVersion(t => {
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

const setComputerPlayer = (player, isComputer) => withIncrementVersion(t => {
  t.transform('app.game.computerPlayers', computerPlayers => ({
    ...computerPlayers,
    [player]: isComputer,
  }))
})

export {
  performMove,
  performNewGame,
  performUndo,
  setComputerPlayer,
}
