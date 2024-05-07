import { h, JSX } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { hostRemoteGame, joinRemoteGame } from './appState/onlinePlay/actions'
import { makeRandomIdentifier } from './randomIdentifier'
import * as API from './api'
import { usePromise } from './usePromise'
import { maxGameIDLength, sanitiseGameID } from '../../common/gameIDUtils'
import { Dialog, DialogCloseButton, DialogProps } from './Dialog'
import { Button, ButtonLink } from './Button'
import { Input } from './Input'
import { TargetedEvent } from 'preact/compat'

const makeRandomGameID = () => makeRandomIdentifier(8)

export type HostGameDialogProps = Pick<
  BaseHostOrJoinGameDialogProps,
  'open' | 'onClose'
>

export const HostGameDialog = ({ ...otherProps }: HostGameDialogProps) => {
  return (
    <BaseHostOrJoinGameDialog
      {...otherProps}
      id="host-game-dialog"
      title="Host a new game"
      initialGameID={makeRandomGameID()}
      inputPlaceholder="Purple Octopus Ruins Opera"
      primaryButtonText="Create game"
      expectedExists={false}
      primaryAction={hostRemoteGame}
      alternativeAction={joinRemoteGame}
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

export type JoinGameDialogProps = Pick<
  BaseHostOrJoinGameDialogProps,
  'open' | 'onClose'
>

export const JoinGameDialog = ({ ...otherProps }: JoinGameDialogProps) => {
  return (
    <BaseHostOrJoinGameDialog
      {...otherProps}
      id="join-game-dialog"
      title="Join an existing game"
      inputPlaceholder="Type a game ID to join"
      primaryButtonText="Join"
      expectedExists={true}
      primaryAction={joinRemoteGame}
      alternativeAction={hostRemoteGame}
      hint={(gameExists, AlternativeActionButton) => {
        if (gameExists === null) {
          return (
            <span class="text-slate-600 dark:text-slate-400">
              To join an existing game, enter its ID and click Join.
            </span>
          )
        }

        return gameExists ? (
          <span class="text-green-700 dark:text-green-400">
            Looks good to me! Click Join to confirm.
          </span>
        ) : (
          <>
            <span class="text-red-600 dark:text-red-400">
              No game with that ID exists.
            </span>{' '}
            <AlternativeActionButton children="Create it now" />
          </>
        )
      }}
    />
  )
}

interface BaseHostOrJoinGameDialogProps extends Omit<DialogProps, 'children'> {
  initialGameID?: string
  inputPlaceholder: string
  primaryButtonText: string
  expectedExists: boolean
  primaryAction: (gameID: string) => Promise<void>
  alternativeAction: (gameID: string) => Promise<void>
  hint: (
    gameExists: boolean | null,
    AlternativeActionButton: (props: { children: string }) => JSX.Element,
    RandomiseButton: () => JSX.Element
  ) => JSX.Element
}

const BaseHostOrJoinGameDialog = ({
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
}: BaseHostOrJoinGameDialogProps) => {
  const inputRef = useRef<HTMLInputElement>()
  const [gameID, setGameID] = useState(initialGameID)
  const [gameExists, setGameExists] = useState<boolean | null>(null)
  const [promiseState, setPromise] = usePromise()

  useEffect(() => {
    if (open) inputRef.current?.select()
  }, [open])

  useEffect(() => {
    if (!open) return

    setGameExists(null)
    setPromise(null)

    if (!/[^\s]+/.test(gameID)) return

    const timeout = setTimeout(
      () => setPromise(API.gameExists(gameID).then(setGameExists)),
      500
    )

    return () => clearTimeout(timeout)
  }, [open, gameID])

  const handleSubmit = (event: TargetedEvent) => {
    event.preventDefault()
    setPromise(primaryAction(gameID).then(onClose))
  }

  const handlePaste = (event: ClipboardEvent) => {
    const text = event.clipboardData?.getData('text/plain')
    if (!text) return

    let pathname: string

    try {
      pathname = new URL(text).pathname
    } catch {
      console.warn('Pasted text is not a URL')
      return
    }

    const match = pathname.match(/\/game\/([^/]+)/)
    if (!match) return

    event.preventDefault()
    setGameID(sanitiseGameID(decodeURIComponent(match[1])))
  }

  const AlternativeActionButton = ({ children }: { children: string }) => (
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
            {promiseState.error?.message}
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
              maxLength={maxGameIDLength}
              onInput={event =>
                setGameID(sanitiseGameID((event.target as any).value))
              }
              onPaste={handlePaste}
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
