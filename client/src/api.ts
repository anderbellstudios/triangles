import {Game} from '../../common/types'
import { wrappedFetch } from './wrappedFetch'

export const gameExists = (gameID: string) =>
  wrappedFetch(`/api/game/${gameID}`, {
    method: 'HEAD',
    acceptResponse: response => /200|404/.test(response.status.toString()),
  }).then(response => response.ok)

export const uploadGame = (gameID: string, game: Game) =>
  wrappedFetch(`/api/game/${gameID}`, {
    method: 'POST',
    body: JSON.stringify(game),
    headers: {
      'Content-Type': 'application/json',
    },
  })
