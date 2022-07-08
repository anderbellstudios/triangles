import { h } from 'preact'
import Hint from '@12joan/preact-hint'

const UpNext = ({ twoColumnLayout }) => {
  return (
    <Hint placement={twoColumnLayout ? 'right' : 'left'} template={content => {
      const [descriptor, player] = content.split(',')

      return (
        <>
          <div class="text-xs">{descriptor}</div>
          <div>{player}</div>
        </>
      )
    }}>
      <div class="flex flex-col gap-4">
        <div class="aspect-square bg-pink-100 rounded-lg" data-hint={['Current turn', 'Cross']} tabindex="0" />
        <div class="aspect-square bg-pink-100 rounded-lg" data-hint={['Next turn', 'Circle']} tabindex="0" />
        <div class="aspect-square bg-pink-100 rounded-lg" data-hint={['Last turn', 'Triangle']} tabindex="0" />
      </div>
    </Hint>
  )
}

export default UpNext
