import React from 'react'
import ShapeImage from './ShapeImage'

const Cell = props => {
  const [x, y] = props.position

  const squareLabel = `Square ${x+1}, ${y+1}`

  if (props.type === null) {
    return <button
      className={ `d-block border-0 board-cell board-cell-empty ${props.disabled ? '' : 'board-cell-action'} col rounded m-1 p-0` }
      onClick={ () => !props.disabled && props.onEmptyCellClick() }
      aria-label={`${squareLabel} - Empty`}
      aria-disabled={props.disabled}>
      <ShapeImage type={props.nextCellType} className="img-fluid hover-focus-visible" aria-hidden="true"/>
    </button>
  } else {
    return (
      <div className="board-cell col rounded m-1" aria-label={`${squareLabel} - ${props.type}`}>
        <ShapeImage type={props.type} className="img-fluid" aria-hidden="true"/>
      </div>
    )
  }
}

export default Cell
