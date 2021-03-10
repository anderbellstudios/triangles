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

  render() {
    return (
      <div className="d-flex align-items-start">
        <Board
          cellAt={this.cellAt.bind(this)}
          onEmptyCellClick={this.handleEmptyCellClicked.bind(this)} />

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
