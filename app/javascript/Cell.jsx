import React from 'react'
import ShapeImage from './ShapeImage'

const Cell = props => {
  const { type, onEmptyCellClick, disabled, position } = props
  const [x, y] = position

  const squareLabel = `Square ${x+1}, ${y+1}`

  if (type === null) {
    return <button
      className={ `d-block border-0 board-cell board-cell-empty ${disabled ? '' : 'board-cell-action'} col rounded m-1 p-0` }
      onClick={ () => !disabled && onEmptyCellClick() }
      aria-label={`${squareLabel} - Empty`}
      aria-disabled={disabled}>
    </button>
  } else {
    return (
      <div className="board-cell col rounded m-1" aria-label={`${squareLabel} - ${type}`}>
        <ShapeImage type={type} className="img-fluid" aria-hidden="true"/>
      </div>
    )
  }
}

export default Cell
