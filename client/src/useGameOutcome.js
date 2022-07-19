import useAppState from './useAppState'
import getGameOutcome from './appState/game/getGameOutcome'

const useGameOutcome = () => {
  const game = useAppState('app.game')
  return getGameOutcome(game)
}

export default useGameOutcome
