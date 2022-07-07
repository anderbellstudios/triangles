import { io } from 'socket.io-client'
import { useMemo, useState, useEffect } from 'preact/hooks'

const socket = io()

const useSocket = ({ query = {}, queryDependencies = [], handlers = {}, handlerDependencies = [] }) => {
  const socket = useMemo(() => io('', { query }), queryDependencies)

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [socket])

  useEffect(() => {
    Object.keys(handlers).forEach(event => {
      socket.on(event, handlers[event])
    })

    return () => Object.keys(handlers).forEach(event => socket.off(event))
  }, [socket, ...handlerDependencies])

  return [connected, socket.emit.bind(socket)]
}

export default useSocket
