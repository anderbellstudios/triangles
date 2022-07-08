import { useEffect } from 'preact/hooks'

const useEventListener = (target, event, callback, dependencies = []) => {
  useEffect(() => {
    target.addEventListener(event, callback)
    return () => target.removeEventListener(event, callback)
  }, dependencies)
}

export default useEventListener
