import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { hostRemoteGame, joinRemoteGame } from './appState/onlinePlay/actions'
import makeRandomIdentifier from './randomIdentifier'
import wrappedFetch from './wrappedFetch'
import usePromise from './usePromise'
import Dialog, { DialogCloseButton } from './Dialog'
import { Button, ButtonLink } from './Button'
import { Input } from './Input'

const handleHost = gameID => hostRemoteGame(gameID)
const handleJoin = gameID => joinRemoteGame(gameID)

const HostGameDialog = ({ ...otherProps }) => {
  return (
    <HostOrJoinGameDialog
      {...otherProps}
      id="host-game-dialog"
      title="Host a new game"
      inputPlaceholder="Purple Octopus Ruins Opera"
      primaryButtonText="Host"
      defaultHintText="Enter an ID that people will use to join your game."
      expectedHintText="Looks good to me! Click Host to confirm."
      unexpectedHintText="That ID is already in use."
      alternativeActionText="Join that game"
      expectedExists={false}
      primaryAction={handleHost}
      alternativeAction={handleJoin}
      showRandomiseButton
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
      defaultHintText="To join an existing game, enter its ID and click Join."
      expectedHintText="Looks good to me! Click Join to confirm."
      unexpectedHintText="No game with that ID exists."
      alternativeActionText="Create it now"
      expectedExists={true}
      primaryAction={handleJoin}
      alternativeAction={handleHost}
    />
  )
}

const HostOrJoinGameDialog = ({
  id,
  title,
  inputPlaceholder,
  primaryButtonText,
  defaultHintText,
  expectedHintText,
  unexpectedHintText,
  alternativeActionText,
  expectedExists,
  primaryAction,
  alternativeAction,
  showRandomiseButton = false,
  open,
  onClose,
}) => {
  const [gameID, setGameID] = useState('')

  const [gameExists, setGameExists] = useState(null)

  const gameExistsIsExpected =
    gameExists === null ? null : gameExists === expectedExists

  const [promiseState, setPromise] = usePromise()

  useEffect(() => {
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
  }, [gameID])

  const handlePrimaryButton = event => {
    event.preventDefault()

    setPromise(primaryAction(gameID).then(onClose))
  }

  const handleAlternativeButton = () => {
    setPromise(alternativeAction(gameID).then(onClose))
  }

  const inputID = `${id}-input`

  return (
    <Dialog id={id} title={title} open={open} onClose={onClose}>
      <form class="space-y-4" onSubmit={handlePrimaryButton}>
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
              autofocus
              class="grow"
              placeholder={inputPlaceholder}
              value={gameID}
              onInput={event => setGameID(event.target.value)}
            />

            <Button type="submit" disabled={gameExistsIsExpected !== true}>
              {primaryButtonText}
            </Button>
          </div>
        </div>

        <p aria-live="polite">
          {
            {
              null: (
                <>
                  <span class="text-slate-600 dark:text-slate-400">
                    {defaultHintText}
                  </span>

                  {showRandomiseButton && (
                    <>
                      {' '}
                      <ButtonLink
                        class="font-medium"
                        onClick={() => setGameID(makeRandomIdentifier())}
                        children="Use a random ID"
                      />
                    </>
                  )}
                </>
              ),

              false: (
                <>
                  <span class="text-red-600 dark:text-red-400">
                    {unexpectedHintText}
                  </span>{' '}
                  <ButtonLink
                    class="font-medium"
                    onClick={handleAlternativeButton}
                    children={alternativeActionText}
                  />
                </>
              ),

              true: (
                <span class="text-green-700 dark:text-green-400">
                  {expectedHintText}
                </span>
              ),
            }[gameExistsIsExpected]
          }
        </p>
      </form>
    </Dialog>
  )
}

export { HostGameDialog, JoinGameDialog }
