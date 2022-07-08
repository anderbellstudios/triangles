import { h } from 'preact'
import Hint from '@12joan/preact-hint'

const UpNext = ({ twoColumnLayout }) => {
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
          ['Current turn', 'Cross', 'bg-cross aspect-square'],
          ['Next turn', 'Circle', 'bg-circle aspect-[4/3] opacity-85'],
          ['Last turn', 'Triangle', 'bg-triangle aspect-[4/2] opacity-70'],
        ].map(([descriptor, player, className]) => (
          <div
            class={`rounded-lg bg-contain bg-center bg-no-repeat ${className}`}
            aria-label={`${descriptor} is ${player}`}
            data-hint={[descriptor, player]}
            tabindex="0"
          />
        ))}
      </div>
    </Hint>
  )
}

export default UpNext
