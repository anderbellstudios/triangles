import React from 'react'
import ShapeImage from './ShapeImage'

const Cell = props => {
  const { type } = props

  if (type === null) {
    return <div
      className="board-cell board-cell-empty col rounded m-1"
      onClick={props.onEmptyCellClick}>
    </div>
  } else {
    return (
      <div className="board-cell col rounded m-1">
        <ShapeImage type={type} className="img-fluid" />
      </div>
    )
  }
}

export default Cell
