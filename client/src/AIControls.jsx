import { h } from 'preact'
import { H2 } from './typography'
import { LargeSwitch } from './Switch'

const AIControls = () => {
  return (
    <div>
      <H2 class="whitespace-nowrap">Play against computer</H2>

      <div class="flex flex-col gap-2">
        {['Cross', 'Circle', 'Triangle'].map(shape => (
          <label class="flex items-center gap-2">
            <LargeSwitch /> {shape}
          </label>
        ))}
      </div>
    </div>
  )
}

export default AIControls
