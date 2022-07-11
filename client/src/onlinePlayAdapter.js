import { io } from 'socket.io-client'
import appState from './appState'
import clientID from './clientID'

let socket = null
let teardownSocket = () => {}
let previousRemoteGameID = null

appState.addEventListener('app.game', game => {
  if (appState.get('app.onlinePlay.connected') && game.lastUpdatedBy === clientID) {
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
    socket.emit('request-game', remoteGameID)
  })

  socket.on('disconnect', () => {
    appState.set('app.onlinePlay.connected', false)
  })

  socket.on('game-updated', game => {
    if (game.tag !== appState.get('app.game.tag')) {
      appState.set('app.game', game)
    }
  })

  socket.on('game-not-found', () => console.error('Tried to connect to game that does not exist'))

  teardownSocket = () => {
    socket.close()
    socket.off('connect')
    socket.off('disconnect')
    socket.off('game-updated')
    socket.off('game-not-found')
  }
}

appState.addEventListener('app.onlinePlay.remoteGameID', remoteGameID => {
  if (remoteGameID !== previousRemoteGameID) {
    previousRemoteGameID = remoteGameID
    handleRemoteGameID(remoteGameID)
  }
})

handleRemoteGameID(appState.get('app.onlinePlay.remoteGameID'))
