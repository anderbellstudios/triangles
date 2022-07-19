import { h } from 'preact'
import Hint from '@12joan/preact-hint'
import { performNewGame, performUndo } from './appState/game/actions'
import useAppState from './useAppState'
import useTryingToConnect from './useTryingToConnect'
import useGameOutcome from './useGameOutcome'
import capitalise from './capitalise'
import Grid from './Grid'
import UpNext from './UpNext'
import { Button, SubtleButton, IconButton } from './Button'

const GameArea = ({ twoColumnLayout }) => {
  const freshGame = useAppState('app.game.moveHistory').length === 0
  const gameOutcome = useGameOutcome()
  const [tryingToConnect] = useTryingToConnect()

  return (
    <div
      class="grid gap-x-4 gap-y-2 md:w-[512px]"
      style={{ gridTemplateColumns: 'minmax(0, 1fr) min(72px, 13vw)' }}
    >
      <div class="flex justify-between gap-4 text-xs md:text-sm">
        <SubtleButton onClick={performNewGame} disabled={freshGame || tryingToConnect}>
          New game
        </SubtleButton>

        <div class="flex gap-2">
          <Hint>
            <IconButton
              data-hint="Undo"
              class="translate-y-1/2"
              aria-label="Undo"
              onClick={performUndo}
              disabled={freshGame || tryingToConnect}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                fill="currentColor"
                viewBox="0 0 16 16"
                class="pointer-events-none"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
              </svg>
            </IconButton>
          </Hint>
        </div>
      </div>

      <div />

      <Grid disabled={tryingToConnect || gameOutcome.type !== 'in-progress'}>
        {gameOutcome.type !== 'in-progress' && (
          <div class="absolute inset-0 bg-white/75 dark:bg-slate-900/75 backdrop-blur-sm rounded-lg flex" aria-live="polite">
            <div class="m-auto text-center">
              <div class="text-2xl mb-4 sm:text-3xl">
                {{
                  'draw': () => "It's a draw!",
                  'win': () => `${capitalise(gameOutcome.winner)} wins!`,
                }[gameOutcome.type]()}
              </div>

              <Button onClick={performNewGame}>Play again</Button>
            </div>
          </div>
        )}
      </Grid>

      <UpNext {...{ twoColumnLayout }} />
    </div>
  )
}

export default GameArea
