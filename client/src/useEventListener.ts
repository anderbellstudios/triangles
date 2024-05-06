import { Inputs, useEffect } from 'preact/hooks'

export const useEventListener = <E extends keyof HTMLElementEventMap>(
  target: EventTarget,
  event: E,
  callback: () => void,
  dependencies: Inputs = [],
  fireOnMount = false
) => {
  useEffect(() => {
    if (fireOnMount) callback()
    target.addEventListener(event, callback)
    return () => target.removeEventListener(event, callback)
  }, dependencies)
}
