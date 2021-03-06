class AI {
  constructor(props) {
    this.game = props.game
    this.isDisabled = props.isDisabled
    this.timeoutId = null
  }

  gameChanged() {
    clearTimeout(this.timeoutId)
    this.timeoutId = setInterval(this.performMove.bind(this), 500)
  }

  performMove() {
    if (this.isDisabled()) {
      return
    } else {
      clearTimeout(this.timeoutId)
    }

    if (this.game.state().playing && this.game.computerPlayers[this.game.nextPlayer()]) {
      const moveOptions = this.pickMoves()

      const [x, y] = this.randomCell(
        moveOptions,
        {
          [[0, 0]]: 5,
          [[1, 0]]: 24,
          [[2, 0]]: 24,
          [[3, 0]]: 5,
          [[0, 1]]: 24,
          [[1, 1]]: 75,
          [[2, 1]]: 75,
          [[3, 1]]: 24,
          [[0, 2]]: 24,
          [[1, 2]]: 75,
          [[2, 2]]: 75,
          [[3, 2]]: 24,
          [[0, 3]]: 5,
          [[1, 3]]: 24,
          [[2, 3]]: 24,
          [[3, 3]]: 5,
        },
      )

      this.game.performMove(x, y)
    }
  }

  pickMoves() {
    const { game } = this

    const player = game.nextPlayer()
    const nextPlayer = game.nextPlayer(1)
    const lastPlayer = game.nextPlayer(2)

    // If player can win in 1 move, take that move
    {
      const winningMoves = this.winningMoves(game, player)

      if (winningMoves.length >= 1) {
        return winningMoves
      }
    }

    // If next player can win in 1 move, occupy that cell first
    {
      const winningMoves = this.winningMoves(game, nextPlayer)

      if (winningMoves.length >= 1) {
        return winningMoves
      }
    }

    // If last player can win in more than 1 way, occupy one of those cells
    {
      const winningMoves = this.winningMoves(game, lastPlayer)

      if (winningMoves.length >= 2) {
        return winningMoves
      }
    }

    // Pick a move that maximises winning moves next turn
    {
      let optimalMoves = []
      let maxWinningMoves = 0

      game.emptyCells().forEach(([x, y]) => {
        const clonedGame = game.clone()
        clonedGame.performMove(x, y, player)

        const winningMoves = this.winningMoves(clonedGame, player)

        if (winningMoves.length > maxWinningMoves) {
          optimalMoves = [[x, y]]
          maxWinningMoves = winningMoves.length
        } else if (winningMoves.length === maxWinningMoves) {
          optimalMoves.push([x, y])
        }
      })

      return optimalMoves
    }
  }

  winningMoves(game, player) {
    return game.emptyCells().map(([x, y]) => {
      const clonedGame = game.clone()

      clonedGame.performMove(x, y, player)

      if (clonedGame.state().winner) {
        return [x, y]
      } else {
        return null
      }
    }).filter(cell => cell !== null)
  }

  randomCell(moveOptions, cellWeightings) {
    const randomVariable = Math.random() * moveOptions.reduce(
      (acc, cell) => acc + cellWeightings[cell],
      0,
    )

    let cumulativeWeight = 0

    for (let cell of moveOptions) {
      cumulativeWeight += cellWeightings[cell]

      if (cumulativeWeight >= randomVariable) {
        return cell
      }
    }

    return moveOptions[moveOptions.length - 1]
  }
}

export default AI
