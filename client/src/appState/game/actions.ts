import { AppStateTransactionHelper, appState } from '..'
import { clientID } from '../../clientID'
import { makeRandomIdentifier } from '../../randomIdentifier'
import { getNthNextTurn } from './getNthNextTurn'
import { gameWithMove } from './gameWithMove'
import { makeNewGame } from './makeNewGame'
import { Board, Move, Shape } from '../../../../common/types'
import { capitalise } from '../../capitalise'
import { getCoordinates } from '../../coordinates'

const modifyGame = (
  fn: (t: AppStateTransactionHelper) => void,
  message: string,
) => {
  appState.transaction(t => {
    t.set('app.game.lastUpdatedBy', clientID)
    t.set('app.game.tag', makeRandomIdentifier())
    t.transform('app.game.recentEvents', recentEvents =>
      recentEvents.concat(message),
    )
    fn(t)
  })
}

export const performMove = (move: Move) => {
  const shape = appState.get('app.game.currentTurn')

  modifyGame(
    t => t.transform('app.game', game => gameWithMove(game, move)),
    `${capitalise(shape)} played ${getCoordinates(move)}`,
  )
}

export const performNewGame = (cycleStartingTurn: boolean) =>
  modifyGame(t => {
    t.transform('app.game', game => makeNewGame(game, cycleStartingTurn))
  }, 'New game started')

export const performUndo = () => {
  const moveHistory = [...appState.get('app.game.moveHistory')]
  const lastMove = moveHistory.pop()
  if (!lastMove) return

  modifyGame(t => {
    t.transform('app.game.board', board => {
      const newBoard: Board = [...board]
      newBoard[lastMove] = null
      return newBoard
    })

    t.set('app.game.moveHistory', moveHistory)

    t.transform('app.game.currentTurn', currentTurn =>
      getNthNextTurn(currentTurn, -1),
    )
  }, 'Last move undone')
}

export const setComputerPlayer = (player: Shape, isComputer: boolean) =>
  modifyGame(
    t =>
      t.transform('app.game.computerPlayers', computerPlayers => ({
        ...computerPlayers,
        [player]: isComputer,
      })),
    `Computer ${isComputer ? 'enabled' : 'disabled'} for ${capitalise(player)}`,
  )
