import { h } from 'preact'
import { useState } from 'preact/hooks'
import useAppState from './useAppState'
import { leaveRemoteGame } from './appState/onlinePlay/actions'
import { Button, SubtleButton } from './Button'
import { H2, LeadParagraph } from './typography'
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

      <div class="space-y-4">
        {child}
      </div>
    </div>
  )
}

const WhenLocal = () => {
  const [showHostGameDialog, setShowHostGameDialog] = useState(false)
  const [showJoinGameDialog, setShowJoinGameDialog] = useState(false)

  return (
    <>
      <LeadParagraph>
        You are playing locally
      </LeadParagraph>

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
    </>
  )
}

const WhenOnline = ({ remoteGameID }) => {
  const [justCopied, setJustCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href)

    setJustCopied(true)
    if (!justCopied) setTimeout(() => setJustCopied(false), 1000)
  }

  return (
    <>
      <LeadParagraph>
        You are playing online
      </LeadParagraph>

      <p>
        Game ID:{' '}
        <code class="p-1 rounded bg-slate-100 text-pink-700 dark:bg-slate-800 dark:text-pink-500 select-all">
          {remoteGameID}
        </code>
      </p>

      <div class="space-x-2">
        <Button
          onClick={handleCopy}
          class={justCopied ? 'relative after:animate-ping after:absolute after:inset-0 after:bg-pink-600 after:rounded-lg' : ''}
          children="Copy link"
        />

        <SubtleButton onClick={() => leaveRemoteGame()}>Leave game</SubtleButton>
      </div>
    </>
  )
}

export default OnlineControls
