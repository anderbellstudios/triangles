import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import Dialog, { DialogCloseButton } from './Dialog'
import { Button, ButtonLink } from './Button'
import { Input } from './Input'
import { joinRemoteGame } from './appState/onlinePlay/actions'
import wrappedFetch from './wrappedFetch'

const JoinGameDialog = ({ open, onClose }) => {
  const [gameID, setGameID] = useState('')
  const [gameExists, setGameExists] = useState(null)

  useEffect(() => {
    setGameExists(null)

    if (!/[^\s]+/.test(gameID)) return

    const timeout = setTimeout(async () => {
      const response = await wrappedFetch(`/api/game/${gameID}`, {
        method: 'HEAD',
        acceptResponse: response => /200|404/.test(response.status),
      })

      setGameExists(response.ok)
    }, 500)

    return () => clearTimeout(timeout)
  }, [gameID])

  const title = 'Join an existing game'

  const handleJoin = event => {
    event.preventDefault()
    joinRemoteGame(gameID)
    onClose()
  }

  return (
    <Dialog id="join-game-dialog" title={title} open={open} onClose={onClose}>
      <form class="space-y-4" onSubmit={handleJoin}>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-medium">{title}</h1>
          <DialogCloseButton onClick={onClose} />
        </div>

        <div class="grid gap-4 sm:flex">
          <Input
            autofocus
            class="grow"
            placeholder="Type a game ID to join"
            value={gameID}
            onInput={event => setGameID(event.target.value)}
          />

          <Button type="submit" disabled={gameExists !== true}>
            Join
          </Button>
        </div>

        <p aria-live="polite">
          {
            {
              null: (
                <span class="text-slate-600 dark:text-slate-400">
                  To join an existing game, enter its ID and click Join.
                </span>
              ),

              false: (
                <>
                  <span class="text-red-700 dark:text-red-400">
                    No game with that ID exists.
                  </span>{' '}
                  <ButtonLink
                    class="font-medium"
                    onClick={() => alert('Not implemented yet')}
                  >
                    Create it now
                  </ButtonLink>
                </>
              ),

              true: (
                <span class="text-green-700 dark:text-green-400">
                  Looks good to me! Click Join to confirm.
                </span>
              ),
            }[gameExists]
          }
        </p>
      </form>
    </Dialog>
  )
}

export default JoinGameDialog
