import React from 'react'
import { Tooltip } from 'bootstrap'
import Board from './Board'
import ShapeImage from './ShapeImage'
import { ArrowCounterclockwise } from 'react-bootstrap-icons'

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.undoButtonRef = React.createRef()

    this.state = {
      moves: [],
      currentTurn: 1,
      startingShapeOffset: 0,
      computerPlayers: {
        cross: false,
        circle: false,
        triangle: false,
      },
    }
  }

  componentDidMount() {
    new Tooltip(this.undoButtonRef.current)
  }

  resetGame() {
    this.setState({
      moves: [],
      currentTurn: 1
    }, this.gameDataDidChange.bind(this))
  }

  playAgain() {
    this.setState({
      startingShapeOffset: (this.state.startingShapeOffset + 1) % 3,
    }, this.resetGame.bind(this))
  }

  undo() {
    if (this.state.moves.length > 0) {
      this.setState({
        moves: this.state.moves.slice(0, -1),
        currentTurn: this.state.currentTurn - 1,
      }, this.gameDataDidChange.bind(this))
    }
  }

  get gameData() {
    return ({
      moves: this.state.moves,
      currentTurn: this.state.currentTurn,
      startingShapeOffset: this.state.startingShapeOffset,
      computerPlayers: this.state.computerPlayers,
    })
  }

  setGameData(gameData) {
    this.setState({
      moves: gameData.moves,
      currentTurn: gameData.currentTurn,
      startingShapeOffset: gameData.startingShapeOffset,
      computerPlayers: gameData.computerPlayers || this.state.computerPlayers,
    })
  }

  gameDataDidChange() {
    this.props.onUpdate?.(this.gameData)
  }

  nextCellType(offset = 0) {
    return ['cross', 'circle', 'triangle'][
      (this.state.currentTurn - 1 + offset + this.state.startingShapeOffset) % 3
    ]
  }

  cellAt(x, y) {
    for (let move of this.state.moves) {
      if (move.position.x === x && move.position.y === y) {
        return move.type
      }
    }

    return null
  }

  handleEmptyCellClicked(x, y) {
    this.setState({
      moves: [
        ...this.state.moves,

        {
          position: { x, y },
          type: this.nextCellType(),
        },
      ],

      currentTurn: this.state.currentTurn + 1
    }, this.gameDataDidChange.bind(this))
  }

  gameState() {
    const lines = [
      [[0, 0], [1, 0], [2, 0]],
      [[1, 0], [2, 0], [3, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[1, 1], [2, 1], [3, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[1, 2], [2, 2], [3, 2]],
      [[0, 3], [1, 3], [2, 3]],
      [[1, 3], [2, 3], [3, 3]],
      [[0, 0], [0, 1], [0, 2]],
      [[0, 1], [0, 2], [0, 3]],
      [[1, 0], [1, 1], [1, 2]],
      [[1, 1], [1, 2], [1, 3]],
      [[2, 0], [2, 1], [2, 2]],
      [[2, 1], [2, 2], [2, 3]],
      [[3, 0], [3, 1], [3, 2]],
      [[3, 1], [3, 2], [3, 3]],
      [[1, 0], [2, 1], [3, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[1, 1], [2, 2], [3, 3]],
      [[0, 1], [1, 2], [2, 3]],
      [[0, 2], [1, 1], [2, 0]],
      [[0, 3], [1, 2], [2, 1]],
      [[1, 2], [2, 1], [3, 0]],
      [[1, 3], [2, 2], [3, 1]],
    ]

    const winners = lines.map(line =>
      line.map(([x, y]) => this.cellAt(x, y)).reduce((a, b) => a === b ? a : null)
    ).filter(x => x !== null)

    const isDraw = [...Array(4).keys()].every(y =>
      [...Array(4).keys()].every(x =>
        this.cellAt(x, y) !== null
      )
    )

    if (winners.length > 0) {
      return { playing: false, draw: false, winner: winners[0] }
    } else if (isDraw) {
      return { playing: false, draw: true, winner: null }
    } else {
      return { playing: true, draw: false, winner: null }
    }
  }

  render() {
    const { playing, draw, winner } = this.gameState()

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
              onClick={() => this.gameState().playing ? this.resetGame() : this.playAgain() }
              disabled={this.props.disabled}>
              New game
            </button>
          </div>

          <div className="col-auto flex-grow-1 text-end">
            <button
              ref={this.undoButtonRef}
              className="btn btn-link text-decoration-none"
              onClick={this.undo.bind(this)}
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
              cellAt={this.cellAt.bind(this)}
              onEmptyCellClick={this.handleEmptyCellClicked.bind(this)}
              onPlayAgain={this.playAgain.bind(this)}
              nextCellType={this.nextCellType()}
              playing={playing}
              disabled={this.props.disabled}
              gameOverMessage={gameOverMessage} />
          </div>

          <div className="col-md-2 up-next d-flex flex-md-column align-items-center" aria-label="Up next">
            <ShapeImage type={this.nextCellType()} className="up-next-img up-next-img-1" />
            <ShapeImage type={this.nextCellType(1)} className="up-next-img up-next-img-2" />
            <ShapeImage type={this.nextCellType(2)} className="up-next-img up-next-img-3" />
          </div>
        </div>

        <div className="mt-5">
          <h5>Computer plays as</h5>

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
                    checked={this.state.computerPlayers[shape]}
                    onChange={(event) => {
                      this.setState({
                        computerPlayers: {
                          ...this.state.computerPlayers,
                          [shape]: event.target.checked,
                        },
                      }, this.gameDataDidChange.bind(this))
                    }} />

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

export default Game
