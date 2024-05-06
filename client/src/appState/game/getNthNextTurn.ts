import { Shape } from '../../../../common/types';

export const getNthNextTurn = (currentTurn: Shape, n: number): Shape => {
  if (n === 0) return currentTurn

  if (n === 1)
    return ({
      cross: 'circle',
      circle: 'triangle',
      triangle: 'cross',
    } as const)[currentTurn]

  if (n === 2)
    return ({
      cross: 'triangle',
      circle: 'cross',
      triangle: 'circle',
    } as const)[currentTurn]

  return getNthNextTurn(currentTurn, ((n % 3) + 3) % 3)
}
