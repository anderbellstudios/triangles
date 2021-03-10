import React from 'react'
import ReactDOM from 'react-dom'

import cross from '../images/cross.svg'
import circle from '../images/circle.svg'
import triangle from '../images/triangle.svg'

const Application = () => (
  <>
    <h1>Hello world!</h1>

    <Game />
  </>
)

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

  handleEmptyCellClicked(x, y) {
    const cellType = ['cross', 'circle', 'triangle'][(this.state.currentTurn - 1) % 3]

    this.setState({
      cellsMap: {
        ...this.state.cellsMap,
        [[x, y]]: cellType,
      }
    })

    this.setState({
      currentTurn: this.state.currentTurn + 1
    })
  }

  render() {
    return <Board
      cellAt={this.cellAt.bind(this)}
      onEmptyCellClick={this.handleEmptyCellClicked.bind(this)} />
  }
}

const Board = props => (
  <div className="board">
    { [...Array(4).keys()].map(x => (
      <div key={x} className="board-row">
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

const Cell = props => {
  const { type } = props

  if (type === null) {
    return <div
      className="board-cell board-cell-empty"
      onClick={props.onEmptyCellClick}>
    </div>
  } else {
    return (
      <div className="board-cell">
        <img src={{ cross, circle, triangle }[type]} className="board-cell-img" />
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () =>
  ReactDOM.render(
    <Application />,
    document.querySelector('#app'),
  )
)
