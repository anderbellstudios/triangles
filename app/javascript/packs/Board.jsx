import React from 'react'
import Cell from './Cell'

const Board = props => (
  <div className="board rounded p-1">
    { [...Array(4).keys()].map(x => (
      <div key={x} className="row g-0">
        { [...Array(4).keys()].map(y => (
          <Cell
            key={y}
            type={props.cellAt(x, y)}
            onEmptyCellClick={() => props.onEmptyCellClick(x, y)} />
        )) }
      </div>
    )) }
  </div>
)

export default Board
