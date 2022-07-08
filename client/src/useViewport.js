import { useState } from 'preact/hooks'
import useEventListener from './useEventListener'

const useViewport = () => {
  const getViewport = () => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  })

  const [viewport, setViewport] = useState(getViewport())

  useEventListener(window, 'resize', () => setViewport(getViewport()))

  return { viewportWidth: viewport.width, viewportHeight: viewport.height }
}

export default useViewport
