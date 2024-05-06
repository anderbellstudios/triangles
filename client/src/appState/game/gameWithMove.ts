import {Board, Game, Move} from '../../../../common/types'
import { getNthNextTurn } from './getNthNextTurn'

export const gameWithMove = (game: Game, move: Move): Game => ({
  ...game,
  board: [
    ...game.board.slice(0, move),
    game.currentTurn,
    ...game.board.slice(move + 1),
  ] as Board,
  moveHistory: [...game.moveHistory, move],
  currentTurn: getNthNextTurn(game.currentTurn, 1),
})
