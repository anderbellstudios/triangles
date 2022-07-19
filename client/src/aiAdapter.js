import appState from './appState'
import clientID from './clientID'
import getGameOutcome from './appState/game/getGameOutcome'
import getOptimalMove from './appState/game/getOptimalMove'
import { performMove } from './appState/game/actions'

let timeoutID = null

appState.addEventListener('app.game', game => {
  if (timeoutID !== null)
    clearTimeout(timeoutID)

  timeoutID = setTimeout(() => {
    if (game.lastUpdatedBy !== clientID)
      return

    if (getGameOutcome(game).type !== 'in-progress')
      return

    if (!game.computerPlayers[game.currentTurn])
      return

    const optimalMove = getOptimalMove(game)
    performMove(optimalMove)
  }, 500)
})
