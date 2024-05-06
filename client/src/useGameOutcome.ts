import { useAppState } from './useAppState'
import { getGameOutcome } from './appState/game/getGameOutcome'

export const useGameOutcome = () => {
  const game = useAppState('app.game')
  return getGameOutcome(game)
}
