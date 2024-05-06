import { Socket, io } from 'socket.io-client'
import { appState } from './appState'
import { clientID } from './clientID'
import {Game} from '../../common/types'

let socket: Socket | null = null
let teardownSocket = () => {}
let previousRemoteGameID: string | null = null

appState.addEventListener('app.game', (game: Game) => {
  if (
    appState.get('app.onlinePlay.connected') &&
    game.lastUpdatedBy === clientID
  ) {
    socket?.emit('game-updated', game)
  }
})

const handleRemoteGameID = (remoteGameID: string | null) => {
  teardownSocket()

  if (remoteGameID === null) {
    return
  }

  appState.set('app.onlinePlay.forcefullyDisconnected', false)

  socket = io('', {
    query: { gameID: remoteGameID },
    timeout: 2000,
    forceNew: true,
  })

  socket.on('connect', () => {
    appState.set('app.onlinePlay.connected', true)
    socket?.emit('request-game', remoteGameID)
  })

  socket.on('disconnect', reason => {
    appState.set('app.onlinePlay.connected', false)

    if (reason !== 'io client disconnect')
      appState.set('app.onlinePlay.forcefullyDisconnected', true)
  })

  socket.on('game-updated', game => {
    if (game.tag !== appState.get('app.game.tag')) {
      appState.set('app.game', game)
    }
  })

  socket.on('game-not-found', () =>
    console.error('Tried to connect to game that does not exist')
  )

  teardownSocket = () => {
    socket?.close()
    socket?.off('connect')
    socket?.off('disconnect')
    socket?.off('game-updated')
    socket?.off('game-not-found')
  }
}

appState.addEventListener('app.onlinePlay.remoteGameID', (remoteGameID) => {
  if (remoteGameID !== previousRemoteGameID) {
    previousRemoteGameID = remoteGameID
    handleRemoteGameID(remoteGameID)
  }
})

handleRemoteGameID(appState.get('app.onlinePlay.remoteGameID'))
