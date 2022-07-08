import { h } from 'preact'
import Hint from '@12joan/preact-hint'
import '@12joan/preact-hint/dist/style.css'
import { SubtleButton, IconButton } from './Button'
import useViewport from './useViewport'

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

      <div class="bg-slate-300 dark:bg-slate-700 rounded-lg grid grid-cols-4 gap-2 p-2">
        {
          Array.from({ length: 16 }).map((_, i) => (
            <button
              type="button"
              class="bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 ring-offset-slate-300 dark:ring-offset-slate-700 rounded-lg aspect-square"
            />
          ))
        }
      </div>

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
    </div>
  )
}

export default GameArea
