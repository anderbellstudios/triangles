const getNthNextTurn = (currentTurn, n) => {
  if (n === 0) return currentTurn

  if (n === 1) return ({
    cross: 'circle',
    circle: 'triangle',
    triangle: 'cross',
  }[currentTurn])

  if (n === 2) return ({
    cross: 'triangle',
    circle: 'cross',
    triangle: 'circle',
  }[currentTurn])

  return getNthNextTurn(currentTurn, ((n % 3) + 3) % 3)
}

export default getNthNextTurn
