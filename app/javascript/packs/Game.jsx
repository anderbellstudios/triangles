import React from 'react'
import Board from './Board'
import ShapeImage from './ShapeImage'

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cellsMap: {},
      currentTurn: 1,
    }
  }

  resetGame() {
    this.setState({
      cellsMap: {},
      currentTurn: 1
    })
  }

  cellAt(x, y) {
    return this.state.cellsMap[[x, y]] || null
  }

  nextCellType(offset = 0) {
    return ['cross', 'circle', 'triangle'][(this.state.currentTurn - 1 + offset) % 3]
  }

  handleEmptyCellClicked(x, y) {
    this.setState({
      cellsMap: {
        ...this.state.cellsMap,
        [[x, y]]: this.nextCellType(),
      }
    })

    this.setState({
      currentTurn: this.state.currentTurn + 1
    })
  }

  gameState() {
    const isDraw = [...Array(4).keys()].every(y =>
      [...Array(4).keys()].every(x =>
        this.cellAt(x, y) !== null
      )
    )

    if (isDraw)
      return { playing: false, draw: true, winner: null }

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

    if (winners.length > 0) {
      return { playing: false, draw: false, winner: winners[0] }
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
      <div className="d-flex align-items-start">
        <Board
          cellAt={this.cellAt.bind(this)}
          onEmptyCellClick={this.handleEmptyCellClicked.bind(this)}
          onResetGame={this.resetGame.bind(this)}
          playing={playing}
          gameOverMessage={gameOverMessage} />

        <div className="up-next d-flex flex-column align-items-center ms-3">
          <ShapeImage type={this.nextCellType()} className="up-next-img up-next-img-1" />
          <ShapeImage type={this.nextCellType(1)} className="up-next-img up-next-img-2" />
          <ShapeImage type={this.nextCellType(2)} className="up-next-img up-next-img-3" />
        </div>
      </div>
    )
  }
}

export default Game
