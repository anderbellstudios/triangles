import { useEffect } from 'preact/hooks'

const useEventListener = (
  target,
  event,
  callback,
  dependencies = [],
  fireOnMount = false
) => {
  useEffect(() => {
    if (fireOnMount) callback()

    target.addEventListener(event, callback)
    return () => target.removeEventListener(event, callback)
  }, dependencies)
}

export default useEventListener
