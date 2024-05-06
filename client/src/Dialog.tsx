import { ComponentChildren, h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { useA11yDialog } from 'react-a11y-dialog'
// @ts-ignore
import Hint from '@12joan/preact-hint'
import { IconButton } from './Button'

export interface DialogProps {
  id: string
  title: string
  open: boolean
  onClose: () => void
  children: ComponentChildren
}

export const Dialog = ({ id, title, open, onClose, children }: DialogProps) => {
  const [instance, dialogProps] = useA11yDialog({ id, title, role: 'dialog' })

  const actuallyOpen = useRef(false)

  useEffect(() => {
    if (open && !actuallyOpen.current) {
      instance.show()
      instance.on('hide', onClose)
    } else if (!open && actuallyOpen.current) {
      instance.hide()
      instance.off('hide', onClose)
    }

    actuallyOpen.current = open
  }, [open])

  return (
    <div
      {...dialogProps.container}
      class="fixed inset-0 z-10 flex overflow-y-auto p-4 aria-hidden:hidden"
    >
      <div
        {...dialogProps.overlay}
        class="fixed inset-0 bg-black/50 dark:bg-black/75"
      />

      <div
        {...dialogProps.dialog}
        class="relative z-10 m-auto w-full max-w-screen-sm rounded-lg bg-white p-8 shadow-lg dark:bg-slate-900"
      >
        {children}
      </div>
    </div>
  )
}

export const DialogCloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Hint>
      <IconButton onClick={onClick} data-hint="Close" aria-label="Close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          fill="currentColor"
          viewBox="0 0 16 16"
          class="pointer-events-none"
          aria-hidden="true"
        >
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>
      </IconButton>
    </Hint>
  )
}
