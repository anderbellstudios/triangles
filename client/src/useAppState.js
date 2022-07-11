import { useState, useEffect } from 'preact/hooks'
import appState from './appState'

const useAppState = pathString => {
  const [value, setValue] = useState(appState.get(pathString))

  useEffect(() => {
    const handler = data => setValue(data)
    appState.addEventListener(pathString, handler)
    return () => appState.removeEventListener(pathString, handler)
  }, [pathString])

  return value
}

export default useAppState
