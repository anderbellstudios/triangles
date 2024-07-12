import { Game } from '../../../common/types'

export type AppState = {
  game: Game
  onlinePlay: OnlinePlayState
  notificationPermission: NotificationPermission
}

export type OnlinePlayState = {
  remoteGameID: string | null
  connected: boolean
  forcefullyDisconnected: boolean
}
