import { io } from 'socket.io-client'
import appState from './appState'

let socket = null
let teardownSocket = () => {}
let previousRemoteGameID = null

appState.addEventListener('app.game', game => {
  if (appState.get('app.onlinePlay.connected')) {
    socket.emit('game-updated', game)
  }
})

const handleRemoteGameID = remoteGameID => {
  teardownSocket()

  if (remoteGameID === null) {
    return
  }

  socket = io('', { query: { gameID: remoteGameID } })

  socket.on('connect', () => {
    appState.set('app.onlinePlay.connected', true)
  })

  socket.on('disconnect', () => {
    appState.set('app.onlinePlay.connected', false)
  })

  socket.on('game-updated', game => {
    if (game.version > appState.get('app.game.version')) {
      appState.set('app.game', game)
    }
  })

  teardownSocket = () => {
    socket.close()
    socket.off('connect')
    socket.off('disconnect')
    socket.off('game-updated')
  }
}

appState.addEventListener('app.onlinePlay.remoteGameID', remoteGameID => {
  if (remoteGameID !== previousRemoteGameID) {
    previousRemoteGameID = remoteGameID
    handleRemoteGameID(remoteGameID)
  }
})

handleRemoteGameID(appState.get('app.onlinePlay.remoteGameID'))
