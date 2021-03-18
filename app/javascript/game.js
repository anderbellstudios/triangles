class Game {
  constructor(props) {
    this.moves = []
    this.currentTurn = 1
    this.startingShapeOffset = 0
    this.onChange = props.onChange
    this.onLocalChange = props.onLocalChange

    this.computerPlayers = {
      cross: false,
      circle: false,
      triangle: false,
    }
  }

  serialise() {
    return ({
      moves: this.moves,
      currentTurn: this.currentTurn,
      startingShapeOffset: this.startingShapeOffset,
      computerPlayers: this.computerPlayers,
    })
  }

  deserialise(data) {
    this.moves = data.moves
    this.currentTurn = data.currentTurn
    this.startingShapeOffset = data.startingShapeOffset
    this.computerPlayers = data.computerPlayers || this.computerPlayers

    this.afterChange()
  }

  clone() {
    const cloned = new Game({})
    cloned.deserialise(JSON.parse(JSON.stringify(this.serialise())))
    return cloned
  }

  afterChange() {
    this.onChange?.(this.serialise())
  }

  afterLocalChange() {
    this.onLocalChange?.(this.serialise())
    this.afterChange()
  }

  undo() {
    if (this.moves.length > 0) {
      this.moves.pop()
      this.currentTurn--

      this.afterLocalChange()
    }
  }

  nextPlayer(offset = 0) {
    return ['cross', 'circle', 'triangle'][
      (this.currentTurn - 1 + offset + this.startingShapeOffset) % 3
    ]
  }

  emptyCells() {
    return (
      [...Array(4).keys()].map(x =>
        [...Array(4).keys()].map(y =>
          [x, y]
        )
      ).flat().filter(([x, y]) => this.moveAt(x, y) === null)
    )
  }

  performMove(x, y, player = null) {
    this.moves.push({
      position: { x, y, },
      type: player || this.nextPlayer(),
    })

    this.currentTurn++

    this.afterLocalChange()
  }

  moveAt(x, y) {
    for (let move of this.moves) {
      if (move.position.x === x && move.position.y === y) {
        return move.type
      }
    }

    return null
  }

  setComputerPlayer(player, isComputer) {
    this.computerPlayers[player] = isComputer
    this.afterLocalChange()
  }

  reset() {
    this.moves = []
    this.currentTurn = 1

    this.afterLocalChange()
  }

  playAgain() {
    this.startingShapeOffset = (this.startingShapeOffset + 1) % 3
    this.reset()
  }

  state() {
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
      line.map(([x, y]) => this.moveAt(x, y)).reduce((a, b) => a === b ? a : null)
    ).filter(x => x !== null)

    const isDraw = [...Array(4).keys()].every(y =>
      [...Array(4).keys()].every(x =>
        this.moveAt(x, y) !== null
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
}

export default Game
