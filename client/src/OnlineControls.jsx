import { h } from 'preact'
import { useState } from 'preact/hooks'
import useAppState from './useAppState'
import { hostRemoteGame, leaveRemoteGame } from './appState/onlinePlay/actions'
import { Button, SubtleButton } from './Button'
import { H2 } from './typography'
import { HostGameDialog, JoinGameDialog } from './HostOrJoinGameDialog'

const OnlineControls = () => {
  const remoteGameID = useAppState('app.onlinePlay.remoteGameID')
  const playingOnline = remoteGameID !== null

  const child = playingOnline ? (
    <WhenOnline {...{ remoteGameID }} />
  ) : (
    <WhenLocal />
  )

  return (
    <div>
      <H2>Play with friends</H2>
      {child}
    </div>
  )
}

const WhenLocal = () => {
  const [showHostGameDialog, setShowHostGameDialog] = useState(false)
  const [showJoinGameDialog, setShowJoinGameDialog] = useState(false)

  return (
    <div class="space-x-2">
      <Button onClick={() => setShowHostGameDialog(true)}>Host game</Button>

      <HostGameDialog
        open={showHostGameDialog}
        onClose={() => setShowHostGameDialog(false)}
      />

      <SubtleButton onClick={() => setShowJoinGameDialog(true)}>
        Join game
      </SubtleButton>

      <JoinGameDialog
        open={showJoinGameDialog}
        onClose={() => setShowJoinGameDialog(false)}
      />
    </div>
  )
}

const WhenOnline = ({ remoteGameID }) => {
  return (
    <div class="space-y-2">
      <div>
        <span class="font-medium">Game ID:</span> {remoteGameID}
      </div>

      <SubtleButton onClick={() => leaveRemoteGame()}>Leave game</SubtleButton>
    </div>
  )
}

export default OnlineControls
