import appState from '..'
import clientID from '../../clientID'
import makeRandomIdentifier from '../../randomIdentifier'
import getNthNextTurn from './getNthNextTurn'
import gameWithMove from './gameWithMove'
import makeNewGame from './makeNewGame'

const modifyGame = procedure => {
  appState.transaction(t => {
    t.set('app.game.lastUpdatedBy', clientID)
    t.set('app.game.tag', makeRandomIdentifier())
    procedure(t)
  })
}

const performMove = index =>
  modifyGame(t => {
    t.transform('app.game', game => gameWithMove(game, index))
  })

const performNewGame = () =>
  modifyGame(t => {
    t.transform('app.game', game => makeNewGame(game))
  })

const performUndo = () =>
  modifyGame(t => {
    const moveHistory = [...appState.get('app.game.moveHistory')]
    const lastMove = moveHistory.pop()

    t.transform('app.game.board', board => {
      const newBoard = [...board]
      newBoard[lastMove] = null
      return newBoard
    })

    t.set('app.game.moveHistory', moveHistory)

    t.transform('app.game.currentTurn', currentTurn =>
      getNthNextTurn(currentTurn, -1)
    )
  })

const setComputerPlayer = (player, isComputer) =>
  modifyGame(t => {
    t.transform('app.game.computerPlayers', computerPlayers => ({
      ...computerPlayers,
      [player]: isComputer,
    }))
  })

export { performMove, performNewGame, performUndo, setComputerPlayer }
