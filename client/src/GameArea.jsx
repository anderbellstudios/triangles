import { h } from 'preact'
import { useRef, useState } from 'preact/hooks'
import Hint from '@12joan/preact-hint'
import { performNewGame, performUndo } from './appState/game/actions'
import useTryingToConnect from './useTryingToConnect'
import useGameOutcome from './useGameOutcome'
import useEventListener from './useEventListener'
import capitalise from './capitalise'
import Grid from './Grid'
import UpNext from './UpNext'
import { Button, SubtleButton, IconButton } from './Button'

const GameArea = ({ twoColumnLayout }) => {
  const gameOutcome = useGameOutcome()
  const [tryingToConnect] = useTryingToConnect()

  const gridRef = useRef()
  const [gridDimensions, setGridDimensions] = useState({ padding: 0, width: 4 })

  useEventListener(
    window,
    'resize',
    () => {
      const gridEl = gridRef.current
      const padding = parseFloat(getComputedStyle(gridEl).paddingLeft)
      const width = gridEl.clientWidth
      setGridDimensions({ padding, width })
    },
    [],
    true
  )

  const centreOfCell = x =>
    (x + 1) * gridDimensions.padding +
    (x + 0.5) * 0.25 * (gridDimensions.width - 5 * gridDimensions.padding)

  return (
    <div
      class="grid gap-x-4 gap-y-2 md:w-[512px]"
      style={{ gridTemplateColumns: 'minmax(0, 1fr) min(72px, 13vw)' }}
    >
      <div class="flex justify-between gap-4 text-xs md:text-sm">
        <SubtleButton
          onClick={() => performNewGame(false)}
          disabled={tryingToConnect}
        >
          New game
        </SubtleButton>

        <div class="flex gap-2">
          <Hint>
            <IconButton
              data-hint="Undo"
              class="translate-y-1/2"
              aria-label="Undo"
              onClick={performUndo}
              disabled={tryingToConnect}
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

      <Grid
        ref={gridRef}
        disabled={tryingToConnect || gameOutcome.type !== 'in-progress'}
      >
        {gameOutcome.type === 'win' && (
          <svg
            class="absolute inset-0 stroke-black dark:stroke-white"
            viewBox={`0 0 ${gridDimensions.width} ${gridDimensions.width}`}
            aria-hidden="true"
          >
            <line
              x1={centreOfCell(gameOutcome.winningLineEndpoints.start[0])}
              y1={centreOfCell(gameOutcome.winningLineEndpoints.start[1])}
              x2={centreOfCell(gameOutcome.winningLineEndpoints.end[0])}
              y2={centreOfCell(gameOutcome.winningLineEndpoints.end[1])}
              stroke-linecap="round"
              stroke-width="1rem"
            />
          </svg>
        )}

        {gameOutcome.type !== 'in-progress' && (
          <div
            class="absolute inset-0 flex rounded-lg bg-white/75 backdrop-blur-sm dark:bg-slate-900/75"
            aria-live="polite"
          >
            <div class="m-auto text-center">
              <div class="mb-4 text-2xl sm:text-3xl">
                {{
                  draw: () => "It's a draw!",
                  win: () => `${capitalise(gameOutcome.winner)} wins!`,
                }[gameOutcome.type]()}
              </div>

              <Button onClick={() => performNewGame(true)}>Play again</Button>
            </div>
          </div>
        )}
      </Grid>

      <UpNext {...{ twoColumnLayout }} />
    </div>
  )
}

export default GameArea
