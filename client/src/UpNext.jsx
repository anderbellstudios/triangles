import { h } from 'preact'
import Hint from '@12joan/preact-hint'
import useAppState from './useAppState'
import getNthNextTurn from './appState/game/getNthNextTurn'
import capitalise from './capitalise'

const UpNext = ({ twoColumnLayout }) => {
  const currentTurn = useAppState('app.game.currentTurn')
  const nextTurn = getNthNextTurn(currentTurn, 1)
  const lastTurn = getNthNextTurn(currentTurn, 2)

  return (
    <Hint
      placement={twoColumnLayout ? 'right' : 'left'}
      template={content => {
        const [descriptor, player] = content.split(',')

        return (
          <>
            <div class="text-xs">{descriptor}</div>
            <div>{player}</div>
          </>
        )
      }}
    >
      <div class="flex flex-col gap-4">
        {[
          ['Current turn', currentTurn, `bg-${currentTurn} aspect-square`],
          ['Next turn', nextTurn, `bg-${nextTurn} aspect-[4/3] opacity-85`],
          ['Last turn', lastTurn, `bg-${lastTurn} aspect-[4/2] opacity-70`],
        ].map(([descriptor, player, className]) => (
          <div
            class={`rounded-lg bg-contain bg-center bg-no-repeat ${className}`}
            aria-label={`${descriptor} is ${capitalise(player)}`}
            data-hint={[descriptor, capitalise(player)]}
            tabindex="0"
          />
        ))}
      </div>
    </Hint>
  )
}

export default UpNext
