import { h } from 'preact'
import { useState } from 'preact/hooks'
import { useAppState } from './useAppState'
import { useTryingToConnect } from './useTryingToConnect'
import { leaveRemoteGame } from './appState/onlinePlay/actions'
import { Button, ButtonLink, SubtleButton } from './Button'
import { H2, LeadParagraph } from './typography'
import { HostGameDialog, JoinGameDialog } from './HostOrJoinGameDialog'
import { setNotificationPermission } from './appState/actions'

export const OnlineControls = () => {
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

      <div class="space-y-4">{child}</div>
    </div>
  )
}

const WhenLocal = () => {
  const [showHostGameDialog, setShowHostGameDialog] = useState(false)
  const [showJoinGameDialog, setShowJoinGameDialog] = useState(false)

  return (
    <>
      <LeadParagraph>You are playing locally</LeadParagraph>

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

const WhenOnline = ({ remoteGameID }: { remoteGameID: string }) => {
  const [justCopied, setJustCopied] = useState(false)
  const [tryingToConnect, forcefullyDisconnected] = useTryingToConnect()
  const notificationPermission = useAppState('app.notificationPermission')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href)

    setJustCopied(true)
    if (!justCopied) setTimeout(() => setJustCopied(false), 1000)
  }

  const handleEnableNotifications = () =>
    Notification.requestPermission(setNotificationPermission)

  return (
    <>
      <LeadParagraph aria-live="polite">
        {tryingToConnect && !forcefullyDisconnected ? (
          <>
            Connecting
            <span class="animate-ellipses" aria-hidden="true" />
          </>
        ) : (
          'You are playing online'
        )}
      </LeadParagraph>

      <p>
        Game ID:{' '}
        <code
          class="select-all rounded bg-slate-100 p-1 text-pink-700 dark:bg-slate-800 dark:text-pink-500"
          data-testid="current-game-id"
        >
          {remoteGameID}
        </code>
      </p>

      {notificationPermission === 'default' && (
        <p>
          <ButtonLink onClick={handleEnableNotifications}>
            Enable notifications
          </ButtonLink>
        </p>
      )}

      <div class="space-x-2">
        <Button
          onClick={handleCopy}
          class={
            justCopied
              ? 'relative after:absolute after:inset-0 after:animate-ping after:rounded-lg after:bg-pink-600 after:[animation-iteration-count:1]'
              : ''
          }
          children="Copy link"
        />

        <SubtleButton onClick={() => leaveRemoteGame()}>
          Leave game
        </SubtleButton>
      </div>
    </>
  )
}
