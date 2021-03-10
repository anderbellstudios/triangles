import React from 'react'
import Cell from './Cell'

const Board = props => {
  const { cellAt, onEmptyCellClick, ...other } = props

  return (
    <div className="board rounded p-1">
      { [...Array(4).keys()].map(y => (
        <div key={y} className="row g-0">
          { [...Array(4).keys()].map(x => (
            <Cell
              key={x}
              type={cellAt(x, y)}
              onEmptyCellClick={() => onEmptyCellClick(x, y)}
              {...other} />
          )) }
        </div>
      )) }
    </div>
  )
}

export default Board
