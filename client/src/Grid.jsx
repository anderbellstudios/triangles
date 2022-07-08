import { h } from 'preact'
import appState, { useAppState } from './appState'
import GridCell from './GridCell'

const Grid = () => {
  const boardState = useAppState('app.game.board')
  const currentTurn = useAppState('app.game.currentTurn')

  const handleCellClick = index => {
    appState.transaction(t => {
      t.update('app.game.board', board => {
        const newBoard = [...board]
        newBoard[index] = currentTurn
        return newBoard
      })

      t.update('app.game.currentTurn', turn => ({
        cross: 'circle',
        circle: 'triangle',
        triangle: 'cross',
      }[turn]))
    })
  }

  return (
    <div class="grid grid-cols-4 gap-1 rounded-lg bg-slate-300 p-1 dark:bg-slate-800 sm:gap-2 sm:p-2">
      {Array.from({ length: 16 }).map((_, i) => (
        <GridCell
          key={i}
          shape={boardState[i]}
          nextShape={currentTurn}
          onClick={() => handleCellClick(i)}
        />
      ))}
    </div>
  )
}

export default Grid
