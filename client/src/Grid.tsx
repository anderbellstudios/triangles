import { ComponentChildren, Ref, h } from 'preact'
import { forwardRef } from 'preact/compat'
import { performMove } from './appState/game/actions'
import { useAppState } from './useAppState'
import { GridCell } from './GridCell'
import { Move, Shape } from '../../common/types'
import { getWinningMoves } from './appState/game/getWinningMoves'

export interface GridProps {
  disabled: boolean
  children: ComponentChildren
}

export const Grid = forwardRef(
  ({ disabled, children }: GridProps, ref: Ref<HTMLDivElement>) => {
    const game = useAppState('app.game')
    const currentPlayer = useAppState('app.game.currentTurn')

    const crossWinningMoves = getWinningMoves(game, 'cross')
    const circleWinningMoves = getWinningMoves(game, 'circle')
    const triangleWinningMoves = getWinningMoves(game, 'triangle')

    const getThreateningPlayers = (move: Move) => {
      const threateningPlayers: Shape[] = []

      if (crossWinningMoves.includes(move)) {
        threateningPlayers.push('cross')
      }

      if (circleWinningMoves.includes(move)) {
        threateningPlayers.push('circle')
      }

      if (triangleWinningMoves.includes(move)) {
        threateningPlayers.push('triangle')
      }

      return threateningPlayers
    }

    return (
      <div
        ref={ref}
        class="relative grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1 sm:gap-2 sm:p-2 dark:bg-slate-800"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <GridCell
            key={i}
            move={i as Move}
            shape={game.board[i]}
            nextShape={currentPlayer}
            threateningShapes={getThreateningPlayers(i as Move)}
            onClick={() => performMove(i as Move)}
            disabled={disabled}
          />
        ))}

        {children}
      </div>
    )
  },
)
