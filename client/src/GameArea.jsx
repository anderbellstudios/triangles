import { h } from 'preact'
import Grid from './Grid'
import UpNext from './UpNext'
import Hint from '@12joan/preact-hint'
import { SubtleButton, IconButton } from './Button'

const GameArea = ({ twoColumnLayout }) => {
  return (
    <div class="md:w-[512px] grid gap-x-4 gap-y-2" style={{ gridTemplateColumns: 'minmax(0, 1fr) min(72px, 13vw)' }}>
      <div class="flex justify-between gap-4 text-xs md:text-sm">
        <SubtleButton>New game</SubtleButton>

        <div class="flex gap-2">
          <Hint>
            <IconButton data-hint="Undo" class="translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" viewBox="0 0 16 16" class="pointer-events-none">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
              </svg>
            </IconButton>
          </Hint>
        </div>
      </div>

      <div />

      <Grid />

      <UpNext {...{twoColumnLayout}} />
    </div>
  )
}

export default GameArea
