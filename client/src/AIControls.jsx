import { h } from 'preact'
import useAppState from './useAppState'
import { setComputerPlayer } from './appState/game/actions'
import useTryingToConnect from './useTryingToConnect'
import capitalise from './capitalise'
import { H2 } from './typography'
import { LargeSwitch } from './Switch'

const AIControls = () => {
  const computerPlayers = useAppState('app.game.computerPlayers')
  const [tryingToConnect] = useTryingToConnect()

  return (
    <div>
      <H2 class="whitespace-nowrap">Play against computer</H2>

      <div class="flex flex-col gap-2">
        {['cross', 'circle', 'triangle'].map(player => (
          <label class="flex items-center gap-2">
            <LargeSwitch
              checked={computerPlayers[player]}
              onChange={event =>
                setComputerPlayer(player, event.target.checked)
              }
              disabled={tryingToConnect}
            />

            {capitalise(player)}
          </label>
        ))}
      </div>
    </div>
  )
}

export default AIControls
