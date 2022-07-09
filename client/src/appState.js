import AppState from '@12joan/app-state'
import { useState, useEffect } from 'preact/hooks'

const appState = new AppState({
  app: {
    game: {
      board: Array.from({ length: 16 }, () => null),
      currentTurn: 'cross',
    },
  },
})

const useAppState = (pathString) => {
  const [value, setValue] = useState(appState.get(pathString))

  useEffect(() => {
    const handler = data => setValue(data)
    appState.addEventListener(pathString, handler)
    return () => appState.removeEventListener(pathString, handler)
  }, [pathString])

  return value
}

export {
  useAppState,
}

export default appState
