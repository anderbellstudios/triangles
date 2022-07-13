import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { hostRemoteGame, joinRemoteGame } from './appState/onlinePlay/actions'
import makeRandomIdentifier from './randomIdentifier'
import wrappedFetch from './wrappedFetch'
import usePromise from './usePromise'
import Dialog, { DialogCloseButton } from './Dialog'
import { Button, ButtonLink } from './Button'
import { Input } from './Input'

const makeRandomGameID = () => makeRandomIdentifier(8)

const handleHost = gameID => hostRemoteGame(gameID)
const handleJoin = gameID => joinRemoteGame(gameID)

const HostGameDialog = ({ ...otherProps }) => {
  return (
    <HostOrJoinGameDialog
      {...otherProps}
      id="host-game-dialog"
      title="Host a new game"
      initialGameID={makeRandomGameID()}
      inputPlaceholder="Purple Octopus Ruins Opera"
      primaryButtonText="Create game"
      expectedExists={false}
      primaryAction={handleHost}
      alternativeAction={handleJoin}
      hint={(gameExists, AlternativeActionButton, RandomiseButton) => {
        return gameExists ? (
          <>
            <span class="text-red-600 dark:text-red-400">
              That ID is already in use.
            </span>{' '}
            <AlternativeActionButton children="Join that game" />
          </>
        ) : (
          <>
            <span class="text-slate-600 dark:text-slate-400">
              Enter an ID that people will use to join your game.
            </span>{' '}
            <RandomiseButton />
          </>
        )
      }}
    />
  )
}

const JoinGameDialog = ({ ...otherProps }) => {
  return (
    <HostOrJoinGameDialog
      {...otherProps}
      id="join-game-dialog"
      title="Join an existing game"
      inputPlaceholder="Type a game ID to join"
      primaryButtonText="Join"
      expectedExists={true}
      primaryAction={handleJoin}
      alternativeAction={handleHost}
      hint={(gameExists, AlternativeActionButton) =>
        ({
          null: (
            <span class="text-slate-600 dark:text-slate-400">
              To join an existing game, enter its ID and click Join.
            </span>
          ),

          false: (
            <>
              <span class="text-red-600 dark:text-red-400">
                No game with that ID exists.
              </span>{' '}
              <AlternativeActionButton children="Create it now" />
            </>
          ),

          true: (
            <span class="text-green-700 dark:text-green-400">
              Looks good to me! Click Join to confirm.
            </span>
          ),
        }[gameExists])
      }
    />
  )
}

const HostOrJoinGameDialog = ({
  id,
  title,
  initialGameID = '',
  inputPlaceholder,
  primaryButtonText,
  expectedExists,
  primaryAction,
  alternativeAction,
  hint,
  open,
  onClose,
}) => {
  const inputRef = useRef()
  const [gameID, setGameID] = useState(initialGameID)
  const [gameExists, setGameExists] = useState(null)
  const [promiseState, setPromise] = usePromise()

  useEffect(() => {
    if (open) inputRef.current.select()
  }, [open])

  useEffect(() => {
    if (!open) return

    setGameExists(null)
    setPromise(null)

    if (!/[^\s]+/.test(gameID)) return

    const timeout = setTimeout(() => {
      setPromise(
        wrappedFetch(`/api/game/${gameID}`, {
          method: 'HEAD',
          acceptResponse: response => /200|404/.test(response.status),
        }).then(response => {
          setGameExists(response.ok)
        })
      )
    }, 500)

    return () => clearTimeout(timeout)
  }, [open, gameID])

  const handleSubmit = event => {
    event.preventDefault()
    setPromise(primaryAction(gameID).then(onClose))
  }

  const AlternativeActionButton = ({ children }) => (
    <ButtonLink
      onClick={() => setPromise(alternativeAction(gameID).then(onClose))}
      children={children}
    />
  )

  const RandomiseButton = () => (
    <ButtonLink
      onClick={() => setGameID(makeRandomGameID())}
      children="Use a random ID"
    />
  )

  const inputID = `${id}-input`

  return (
    <Dialog id={id} title={title} open={open} onClose={onClose}>
      <form class="space-y-4" onSubmit={handleSubmit}>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-medium">{title}</h1>
          <DialogCloseButton onClick={onClose} />
        </div>

        {promiseState.rejected && (
          <p aria-live="polite" class="text-red-600 dark:text-red-500">
            <span class="font-medium">Something went wrong:</span>{' '}
            {promiseState.error.message}
          </p>
        )}

        <div class="space-y-2">
          <label class="block font-medium" for={inputID}>
            Game ID
          </label>

          <div class="grid gap-4 sm:flex">
            <Input
              id={inputID}
              ref={inputRef}
              class="grow"
              placeholder={inputPlaceholder}
              value={gameID}
              onInput={event => setGameID(event.target.value)}
            />

            <Button type="submit" disabled={gameExists !== expectedExists}>
              {primaryButtonText}
            </Button>
          </div>
        </div>

        <p aria-live="polite">
          {hint(gameExists, AlternativeActionButton, RandomiseButton)}
        </p>
      </form>
    </Dialog>
  )
}

export { HostGameDialog, JoinGameDialog }
