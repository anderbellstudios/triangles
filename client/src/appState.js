import { useState, useEffect } from 'preact/hooks'
import transformState from './transformState'

const internal = {
  state: {},
}

const eventListeners = {}

const init = (state) => {
  internal.state = state
}

const get = (pathString) => pathString.split('.').reduce((obj, key) => obj[key], internal.state)

const broadcastEvents = events => events.forEach(event => (eventListeners[event.path] || []).forEach(h => h(event.data)))

const update = (pathString, f, inTransaction = false) => {
  let eventsEmitted
  [internal.state, eventsEmitted] = transformState(internal.state, pathString.split('.'), f)
  if (!inTransaction) broadcastEvents(eventsEmitted)
  return eventsEmitted
}

const transaction = procedure => {
  const eventsEmittedByPath = {}

  procedure({
    update: (pathString, f) => {
      update(pathString, f, true).forEach(event => {
        eventsEmittedByPath[event.path] = event
      })
    },
  })

  broadcastEvents(Object.values(eventsEmittedByPath))
}

const addEventListener = (path, handler) => {
  eventListeners[path] = [
    ...(eventListeners[path] || []),
    handler,
  ]
}

const removeEventListener = (event, handler) => {
  eventListeners[event] = eventListeners[event].filter(h => h !== handler)
}

const useAppState = (pathString) => {
  const [value, setValue] = useState(get(pathString))

  useEffect(() => {
    const handler = data => setValue(data)
    addEventListener(pathString, handler)
    return () => removeEventListener(pathString, handler)
  }, [pathString])

  return value
}

export { useAppState }

export default {
  init,
  get,
  update,
  transaction,
  addEventListener,
  removeEventListener,
}
