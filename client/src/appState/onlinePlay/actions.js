import appState from '..'

const joinRemoteGame = gameID => {
  appState.set('app.onlinePlay.remoteGameID', gameID)
}
const leaveRemoteGame = () => appState.set('app.onlinePlay.remoteGameID', null)

export {
  joinRemoteGame,
  leaveRemoteGame,
}
