import StateEvent from './StateEvent'

const transformState = (state, path, f) => {
  const [head, ...tail] = path
  const newState = Array.isArray(state) ? [...state] : { ...state }
  let eventsEmitted = []

  if (tail.length === 0)
    newState[head] = f(state[head])
  else
    [newState[head], eventsEmitted] = transformState(state[head], tail, f, eventsEmitted)

  const newEventsEmitted = [
    ...eventsEmitted.map(event => event.unshift(head)),
    new StateEvent(head, newState[head]),
  ]

  return [newState, newEventsEmitted]
}

export default transformState
