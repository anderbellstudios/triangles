import { useAppState } from './useAppState'

export const useTryingToConnect = (): [boolean, boolean] => {
  const remoteGameID = useAppState('app.onlinePlay.remoteGameID')
  const connected = useAppState('app.onlinePlay.connected')
  const forcefullyDisconnected = useAppState(
    'app.onlinePlay.forcefullyDisconnected'
  )

  return [remoteGameID != null && !connected, forcefullyDisconnected] as any
}
