import { useState, useEffect } from 'preact/hooks'
import { AppStatePathMap, appState } from './appState'

export const useAppState = <K extends keyof AppStatePathMap>(pathString: K): AppStatePathMap[K] => {
  type T = AppStatePathMap[K]
  const [value, setValue] = useState<T>(appState.get(pathString))

  useEffect(() => {
    const handler = (data: T) => setValue(data)
    appState.addEventListener(pathString, handler)
    return () => appState.removeEventListener(pathString, handler)
  }, [pathString])

  return value
}
