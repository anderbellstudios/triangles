import useAppState from './useAppState'

const useTryingToConnect = () => {
  const remoteGameID = useAppState('app.onlinePlay.remoteGameID')
  const connected = useAppState('app.onlinePlay.connected')
  const forcefullyDisconnected = useAppState('app.onlinePlay.forcefullyDisconnected')

  return [
    remoteGameID != null && !connected,
    forcefullyDisconnected,
  ]
}

export default useTryingToConnect
