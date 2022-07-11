import appState from '..'
import wrappedFetch from '../../wrappedFetch'

const hostRemoteGame = async gameID => {
  await wrappedFetch(`/api/game/${gameID}`, {
    method: 'POST',
    body: JSON.stringify(appState.get('app.game')),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  appState.set('app.onlinePlay.remoteGameID', gameID)
}

const joinRemoteGame = gameID => {
  appState.set('app.onlinePlay.remoteGameID', gameID)
}

const leaveRemoteGame = () => appState.set('app.onlinePlay.remoteGameID', null)

export { hostRemoteGame, joinRemoteGame, leaveRemoteGame }
