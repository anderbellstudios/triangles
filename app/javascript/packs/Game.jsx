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
    }, this.gameDataDidChange.bind(this))
  }

  get gameData() {
    return ({
      cellsMap: this.state.cellsMap,
      currentTurn: this.state.currentTurn,
    })
  }

  setGameData(gameData) {
    this.setState({
      cellsMap: gameData.cellsMap,
      currentTurn: gameData.currentTurn,
    })
  }

  gameDataDidChange() {
    this.props.onUpdate?.(this.gameData)
  }

  nextCellType(offset = 0) {
    return ['cross', 'circle', 'triangle'][(this.state.currentTurn - 1 + offset) % 3]
  }

  cellAt(x, y) {
    return this.state.cellsMap[`${x},${y}`] || null
  }

  handleEmptyCellClicked(x, y) {
    this.setState({
      cellsMap: {
        ...this.state.cellsMap,
        [`${x},${y}`]: this.nextCellType(),
      },

      currentTurn: this.state.currentTurn + 1
    }, this.gameDataDidChange.bind(this))
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
      <div className="row g-1 align-items-start">
        <div className="col-md">
          <Board
            cellAt={this.cellAt.bind(this)}
            onEmptyCellClick={this.handleEmptyCellClicked.bind(this)}
            onResetGame={this.resetGame.bind(this)}
            playing={playing}
            gameOverMessage={gameOverMessage} />
        </div>

        <div className="col-md-auto up-next d-flex flex-md-column align-items-center" aria-label="Up next">
          <ShapeImage type={this.nextCellType()} className="up-next-img up-next-img-1" />
          <ShapeImage type={this.nextCellType(1)} className="up-next-img up-next-img-2" />
          <ShapeImage type={this.nextCellType(2)} className="up-next-img up-next-img-3" />
        </div>
      </div>
    )
  }
}

export default Game
