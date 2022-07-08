import { h } from 'preact'
import { useReducer } from 'preact/hooks'
import GridCell from './GridCell'

const Grid = () => {
  const [[cellShapes, nextShape], setCellShape] = useReducer(
    ([cellShapes, nextShape], index) => {
      const newCellShapes = [...cellShapes]
      newCellShapes[index] = nextShape

      const newNextShape = {
        cross: 'circle',
        circle: 'triangle',
        triangle: 'cross',
      }[nextShape]

      return [newCellShapes, newNextShape]
    },
    [[], 'cross']
  )

  return (
    <div class="grid grid-cols-4 gap-1 rounded-lg bg-slate-300 p-1 dark:bg-slate-800 sm:gap-2 sm:p-2">
      {Array.from({ length: 16 }).map((_, i) => (
        <GridCell
          key={i}
          shape={cellShapes[i]}
          nextShape={nextShape}
          onClick={() => setCellShape(i)}
        />
      ))}
    </div>
  )
}

export default Grid
