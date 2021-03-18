import React from 'react'
import { Tooltip } from 'bootstrap'
import Board from './Board'
import ShapeImage from './ShapeImage'
import { ArrowCounterclockwise } from 'react-bootstrap-icons'

class GameComponent extends React.Component {
  constructor(props) {
    super(props)

    this.undoButtonRef = React.createRef()
  }

  componentDidMount() {
    new Tooltip(this.undoButtonRef.current)
  }

  render() {
    const { game } = this.props

    const { playing, draw, winner } = game.state()

    const gameOverMessage = !playing && (
      draw
      ? 'It\'s a draw'
      : `${winner?.replace(/\b(\w)/, s => s.toUpperCase())} wins`
    )

    return (
      <>
        <div className="row g-1 justify-content-md-start justify-content-between align-items-center mb-2">
          <div className="col-auto">
            <button
              className="btn btn-sm btn-dark"
              onClick={() => playing ? game.reset() : game.playAgain() }
              disabled={this.props.disabled}>
              New game
            </button>
          </div>

          <div className="col-auto flex-grow-1 text-end">
            <button
              ref={this.undoButtonRef}
              className="btn btn-link text-decoration-none"
              onClick={game.undo.bind(game)}
              aria-label="Undo"
              data-bs-toggle="tooltip"
              title="Undo">
              <ArrowCounterclockwise size="1.5em" color="black" className="pe-none" />
            </button>
          </div>

          <div className="col-md-2"></div>
        </div>

        <div className="row g-1 align-items-start">
          <div className="col-md">
            <Board
              cellAt={game.moveAt.bind(game)}
              onEmptyCellClick={game.performMove.bind(game)}
              onPlayAgain={game.playAgain.bind(game)}
              nextCellType={game.nextPlayer()}
              playing={playing}
              disabled={this.props.disabled}
              gameOverMessage={gameOverMessage} />
          </div>

          <div className="col-md-2 up-next d-flex flex-md-column align-items-center" aria-label="Up next">
            <ShapeImage type={game.nextPlayer()} className="up-next-img up-next-img-1" />
            <ShapeImage type={game.nextPlayer(1)} className="up-next-img up-next-img-2" />
            <ShapeImage type={game.nextPlayer(2)} className="up-next-img up-next-img-3" />
          </div>
        </div>

        <div className="mt-5">
          <h5>Play against computer</h5>

          <div className="row px-3">
            {
              [
                ['cross', 'Cross', 'primary'],
                ['circle', 'Circle', 'success'],
                ['triangle', 'Triangle', 'danger'],
              ].map(([shape, shapeName, colour]) => (
                <div key={shape} className={`col-auto form-check form-check-${colour} form-switch`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`computer-${shape}`}
                    checked={game.computerPlayers[shape]}
                    onChange={event => game.setComputerPlayer(shape, event.target.checked)} />

                  <label className="form-check-label" htmlFor={`computer-${shape}`}>
                    {shapeName}
                  </label>
                </div>
              ))
            }
          </div>
        </div>
      </>
    )
  }
}

export default GameComponent
