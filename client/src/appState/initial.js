import makeNewGame from './game/makeNewGame'

const initialAppState = {
  app: {
    game: makeNewGame(),
    onlinePlay: {
      remoteGameID: null,
      connected: false,
      forcefullyDisconnected: false,
    },
  },
}

export default initialAppState