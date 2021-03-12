import React from 'react'
import Cell from './Cell'

const Board = props => {
  const { cellAt, onEmptyCellClick, onResetGame, playing, gameOverMessage } = props

  return (
    <div className="board rounded p-1" aria-label="Grid">
      { [...Array(4).keys()].map(y => (
        <div key={y} className="row g-0">
          { [...Array(4).keys()].map(x => (
            <Cell
              key={x}
              position={[x, y]}
              type={cellAt(x, y)}
              onEmptyCellClick={() => onEmptyCellClick(x, y)}
              disabled={!playing} />
          )) }
        </div>
      )) }

      {
        !playing && (
          <div className="gameover-overlay d-flex justify-content-center align-items-center">
            <div className="text-center">
              <h1>{gameOverMessage}</h1>

              <button
                className="btn btn-dark"
                onClick={onResetGame}>
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
