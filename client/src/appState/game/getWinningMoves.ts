import { getEmptyCells } from './getEmptyCells'
import { gameWithMove } from './gameWithMove'
import { getGameOutcome } from './getGameOutcome'
import {Game, Shape} from '../../../../common/types'

export const getWinningMoves = (game: Game, player: Shape) => {
  const gameWithCurrentTurn: Game = { ...game, currentTurn: player }

  return getEmptyCells(gameWithCurrentTurn.board).filter(move => {
    const gameAfterMove = gameWithMove(gameWithCurrentTurn, move)
    return getGameOutcome(gameAfterMove).type === 'win'
  })
}
