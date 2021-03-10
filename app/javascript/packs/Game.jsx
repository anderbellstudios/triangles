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

  winner() {
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
      return winners[0]
    } else {
      return null
    }
  }

  render() {
    const winner = this.winner()

    return (
      <>
        { winner && `The winner is ${winner}` }

        <div className="d-flex align-items-start">
          <Board
            cellAt={this.cellAt.bind(this)}
            onEmptyCellClick={this.handleEmptyCellClicked.bind(this)}
            disabled={winner !== null} />

          <div className="up-next d-flex flex-column align-items-center ms-3">
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
