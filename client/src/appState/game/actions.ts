import { AppStateTransactionHelper, appState } from '..'
import { clientID } from '../../clientID'
import { makeRandomIdentifier } from '../../randomIdentifier'
import { getNthNextTurn } from './getNthNextTurn'
import { gameWithMove } from './gameWithMove'
import { makeNewGame } from './makeNewGame'
import {Board, Move, Shape} from '../../../../common/types'

const modifyGame = (fn: (t: AppStateTransactionHelper) => void) => {
  appState.transaction(t => {
    t.set('app.game.lastUpdatedBy', clientID)
    t.set('app.game.tag', makeRandomIdentifier())
    fn(t)
  })
}

export const performMove = (move: Move) =>
  modifyGame(t => {
    t.transform('app.game', game => gameWithMove(game, move))
  })

export const performNewGame = (cycleStartingTurn: boolean) =>
  modifyGame(t => {
    t.transform('app.game', game => makeNewGame(game, cycleStartingTurn))
  })

export const performUndo = () =>
  modifyGame(t => {
    const moveHistory = [...appState.get('app.game.moveHistory')]

    if (moveHistory.length === 0) return

    const lastMove = moveHistory.pop() as Move

    t.transform('app.game.board', board => {
      const newBoard: Board = [...board]
      newBoard[lastMove] = null
      return newBoard
    })

    t.set('app.game.moveHistory', moveHistory)

    t.transform('app.game.currentTurn', currentTurn =>
      getNthNextTurn(currentTurn, -1)
    )
  })

export const setComputerPlayer = (player: Shape, isComputer: boolean) =>
  modifyGame(t => {
    t.transform('app.game.computerPlayers', computerPlayers => ({
      ...computerPlayers,
      [player]: isComputer,
    }))
  })
