import { JSX, h } from 'preact'
import { Shape } from '../../common/types'
import { capitalise } from './capitalise'

export interface GridCellProps
  extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'shape'> {
  shape: Shape | null
  nextShape: Shape
  disabled?: boolean
}

export const GridCell = ({
  shape = null,
  nextShape,
  disabled,
  ...otherProps
}: GridCellProps) => {
  const emptyClass = `bg-slate-200 dark:bg-slate-700 ${
    disabled
      ? 'cursor-not-allowed'
      : `strict-hover:hover:bg-slate-100 focus-visible:bg-slate-100 strict-hover:hover:after:bg-${nextShape} focus-visible:after:bg-${nextShape} strict-hover:hover:after:opacity-40 focus-visible:after:opacity-40 dark:strict-hover:hover:bg-slate-800 dark:focus-visible:bg-slate-800`
  }`

  const shapeClass =
    shape === null ? emptyClass : `bg-${shape} bg-slate-100 dark:bg-slate-800`

  return (
    <button
      type="button"
      class={`grid-cell relative aspect-square rounded bg-contain bg-no-repeat ring-offset-slate-100 after:absolute after:inset-0 after:bg-contain after:bg-no-repeat dark:ring-offset-slate-800 ${shapeClass}`}
      disabled={shape !== null || disabled}
      aria-live="polite"
      aria-label={
        shape === null
          ? `Play ${capitalise(nextShape)}`
          : `Square with ${capitalise(shape)}`
      }
      data-testid="grid-cell"
      {...otherProps}
    />
  )
}
