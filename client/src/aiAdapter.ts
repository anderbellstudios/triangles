import { appState } from './appState'
import { clientID } from './clientID'
import { getGameOutcome } from './appState/game/getGameOutcome'
import { getOptimalMove } from './appState/game/getOptimalMove'
import { performMove } from './appState/game/actions'
import {AppState} from './appState/types'

let timeoutID: ReturnType<typeof setTimeout> | null = null

appState.addEventListener('app', (app: AppState) => {
  const { onlinePlay, game } = app

  if (timeoutID !== null) clearTimeout(timeoutID)

  timeoutID = setTimeout(() => {
    if (onlinePlay.remoteGameID !== null && !onlinePlay.connected) return

    if (game.lastUpdatedBy !== clientID) return

    if (getGameOutcome(game).type !== 'in-progress') return

    if (!game.computerPlayers[game.currentTurn]) return

    const optimalMove = getOptimalMove(game)
    performMove(optimalMove)
  }, 500)
})
