import { h } from 'preact'
import { Button, SubtleButton } from './Button'
import { H2 } from './typography'

const OnlineControls = () => {
  return (
    <div>
      <H2>Play with friends</H2>

      <div class="flex gap-2">
        <Button>Host game</Button>
        <SubtleButton>Join game</SubtleButton>
      </div>
    </div>
  )
}

export default OnlineControls
