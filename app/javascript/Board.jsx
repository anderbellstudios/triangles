import React from 'react'
import Cell from './Cell'

const Board = props => {
  return (
    <div className="board rounded p-1" aria-label="Grid">
      { [...Array(4).keys()].map(y => (
        <div key={y} className="row g-0">
          { [...Array(4).keys()].map(x => (
            <Cell
              key={x}
              position={[x, y]}
              type={props.cellAt(x, y)}
              nextCellType={props.nextCellType}
              onEmptyCellClick={() => props.onEmptyCellClick(x, y)}
              disabled={props.disabled || !props.playing} />
          )) }
        </div>
      )) }

      {
        !props.playing && (
          <div className="gameover-overlay d-flex justify-content-center align-items-center">
            <div className="text-center">
              <h1>{props.gameOverMessage}</h1>

              <button
                className="btn btn-dark"
                onClick={props.onPlayAgain}
                disabled={props.disabled}>
                Play again
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Board
