import appState from '..'
import * as API from '../../api'

const setRemoteGameID = (gameID, pushState) => {
  appState.set('app.onlinePlay.remoteGameID', gameID)

  if (pushState) {
    const path = gameID === null ? '/' : `/game/${encodeURIComponent(gameID)}`
    window.history.pushState(null, null, path)
  }
}

const hostRemoteGame = async (gameID, pushState = true) => {
  await API.uploadGame(gameID, appState.get('app.game'))
  setRemoteGameID(gameID, pushState)
}

const joinRemoteGame = async (gameID, pushState = true) => {
  setRemoteGameID(gameID, pushState)
}

const leaveRemoteGame = async (pushState = true) => {
  setRemoteGameID(null, pushState)
}

export { hostRemoteGame, joinRemoteGame, leaveRemoteGame }
