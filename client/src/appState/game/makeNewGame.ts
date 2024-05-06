import { getNthNextTurn } from './getNthNextTurn'
import { clientID } from '../../clientID'
import { makeRandomIdentifier } from '../../randomIdentifier'
import {Board, Game} from '../../../../common/types'

export const makeNewGame = (oldGame: Partial<Game> = {}, cycleStartingTurn = false): Game => {
  const startingTurn = getNthNextTurn(
    oldGame.startingTurn ?? 'cross',
    cycleStartingTurn ? 1 : 0
  )

  return {
    lastUpdatedBy: clientID,
    tag: makeRandomIdentifier(),
    computerPlayers: {
      cross: false,
      circle: false,
      triangle: false,
    },
    ...oldGame,
    board: Array.from({ length: 16 }, () => null) as Board,
    startingTurn,
    currentTurn: startingTurn,
    moveHistory: [],
  }
}
