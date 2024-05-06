import { makeNewGame } from './game/makeNewGame'
import { AppState } from './types'

export const initialAppState: { app: AppState } = {
  app: {
    game: makeNewGame(),
    onlinePlay: {
      remoteGameID: null,
      connected: false,
      forcefullyDisconnected: false,
    },
  },
}
