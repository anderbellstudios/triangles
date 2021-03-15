import React from 'react'
import Board from './Board'
import ShapeImage from './ShapeImage'
import { ArrowCounterclockwise } from 'react-bootstrap-icons'

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      moves: [],
      currentTurn: 1,
      startingShapeOffset: 0,
    }
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
    this.setState({
      moves: this.state.moves.slice(0, -1),
      currentTurn: this.state.currentTurn - 1,
    }, this.gameDataDidChange.bind(this))
  }

  get gameData() {
    return ({
      moves: this.state.moves,
      currentTurn: this.state.currentTurn,
      startingShapeOffset: this.state.startingShapeOffset,
    })
  }

  setGameData(gameData) {
    this.setState({
      moves: gameData.moves,
      currentTurn: gameData.currentTurn,
      startingShapeOffset: gameData.startingShapeOffset,
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
              onClick={this.resetGame.bind(this)}
              disabled={this.props.disabled}>
              New game
            </button>
          </div>

          <div className="col-auto flex-grow-1 text-end">
            <button
              className="btn btn-link text-decoration-none"
              onClick={this.undo.bind(this)}
              disabled={this.state.moves.length === 0}
              aria-label="Undo">
              <ArrowCounterclockwise size="1.5em" color="black" />
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
      </>
    )
  }
}

export default Game
