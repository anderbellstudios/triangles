import { h } from 'preact'
import { forwardRef } from 'preact/compat'
import { performMove } from './appState/game/actions'
import useAppState from './useAppState'
import GridCell from './GridCell'

const Grid = forwardRef(({ disabled, children }, ref) => {
  const boardState = useAppState('app.game.board')
  const currentTurn = useAppState('app.game.currentTurn')

  return (
    <div
      ref={ref}
      class="relative grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 sm:gap-2 sm:p-2"
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <GridCell
          key={i}
          shape={boardState[i]}
          nextShape={currentTurn}
          onClick={() => performMove(i)}
          disabled={disabled}
        />
      ))}

      {children}
    </div>
  )
})

export default Grid
