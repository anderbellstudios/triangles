import { appState } from '..'
import * as API from '../../api'

const setRemoteGameID = (gameID: string | null, pushState: boolean) => {
  appState.set('app.onlinePlay.remoteGameID', gameID)

  if (pushState) {
    const path = gameID === null ? '/' : `/game/${encodeURIComponent(gameID)}`
    window.history.pushState(null, '', path)
  }
}

export const hostRemoteGame = async (gameID: string, pushState = true) => {
  await API.uploadGame(gameID, appState.get('app.game'))
  setRemoteGameID(gameID, pushState)
}

export const joinRemoteGame = async (gameID: string, pushState = true) => {
  setRemoteGameID(gameID, pushState)
}

export const leaveRemoteGame = async (pushState = true) => {
  setRemoteGameID(null, pushState)
}
