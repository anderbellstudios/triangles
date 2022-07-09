import appState from '..'
import clientID from '../../clientID'
import getNthNextTurn from './getNthNextTurn'
import makeNewGame from './makeNewGame'

const withLastUpdatedBy = procedure => {
  appState.transaction(t => {
    t.set('app.game.lastUpdatedBy', clientID)
    procedure(t)
  })
}

const performMove = index => withLastUpdatedBy(t => {
  t.transform('app.game.board', board => {
    const newBoard = [...board]
    newBoard[index] = appState.get('app.game.currentTurn')
    return newBoard
  })

  t.transform('app.game.currentTurn', currentTurn => getNthNextTurn(currentTurn, 1))

  t.transform('app.game.moveHistory', moveHistory => [...moveHistory, index])
})

const performNewGame = () => withLastUpdatedBy(t => {
  t.transform('app.game', game => makeNewGame(game))
})

const performUndo = () => withLastUpdatedBy(t => {
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

const setComputerPlayer = (player, isComputer) => withLastUpdatedBy(t => {
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
