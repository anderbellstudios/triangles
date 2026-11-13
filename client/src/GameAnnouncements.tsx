import { h } from 'preact'
import { useAppState } from './useAppState'
import { useEffect, useState } from 'preact/hooks'

// https://stackoverflow.com/a/80016388/18253892
export const GameAnnouncements = () => {
  const recentEvents = useAppState('app.game.recentEvents')

  const [readUpToIndex, setReadUpToIndex] = useState(recentEvents.length - 1)
  const hasUnreadEvents = recentEvents.length > readUpToIndex + 1

  useEffect(() => {
    if (!hasUnreadEvents) return

    const timer = setInterval(() => {
      setReadUpToIndex(index => index + 1)
    }, 100)

    return () => clearInterval(timer)
  }, [hasUnreadEvents])

  return (
    <div class="sr-only" aria-label="Recent events (oldest first)">
      {recentEvents.map((message, i) => (
        <div key={i} aria-live="polite">
          {i <= readUpToIndex ? message : null}
        </div>
      ))}
    </div>
  )
}
