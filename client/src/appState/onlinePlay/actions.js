import appState from '..'
import * as API from '../../api'

const hostRemoteGame = async gameID => {
  await API.uploadGame(gameID, appState.get('app.game'))
  appState.set('app.onlinePlay.remoteGameID', gameID)
}

const joinRemoteGame = async gameID => {
  appState.set('app.onlinePlay.remoteGameID', gameID)
}

const leaveRemoteGame = () => appState.set('app.onlinePlay.remoteGameID', null)

export { hostRemoteGame, joinRemoteGame, leaveRemoteGame }
