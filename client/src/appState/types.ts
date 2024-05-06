import { Game } from '../../../common/types'

export type AppState = {
  game: Game
  onlinePlay: OnlinePlayState
}

export type OnlinePlayState = {
  remoteGameID: string | null
  connected: boolean
  forcefullyDisconnected: boolean
}
