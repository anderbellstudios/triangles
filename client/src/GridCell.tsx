import { h } from 'preact'
import { Shape } from '../../common/types'
import { capitalise } from './capitalise'
import { getCoordinates } from './coordinates'

export interface GridCellProps {
  index: number
  shape: Shape | null
  nextShape: Shape
  disabled?: boolean
  onClick?: () => void
}

export const GridCell = ({
  index,
  shape = null,
  nextShape,
  disabled: disabledProp = false,
  onClick,
}: GridCellProps) => {
  const emptyClass = `bg-slate-200 dark:bg-slate-700 ${
    disabledProp
      ? 'cursor-not-allowed'
      : `strict-hover:hover:bg-slate-100 focus-visible:bg-slate-100 strict-hover:hover:after:bg-${nextShape} focus-visible:after:bg-${nextShape} strict-hover:hover:after:opacity-40 focus-visible:after:opacity-40 dark:strict-hover:hover:bg-slate-800 dark:focus-visible:bg-slate-800`
  }`

  const disabled = !!shape || disabledProp

  const coordinates = getCoordinates(index)
  const ariaLabel =
    shape === null
      ? `${coordinates}, empty, next turn is ${capitalise(nextShape)}`
      : ` ${coordinates}, ${capitalise(shape)}`

  const shapeClass =
    shape === null
      ? emptyClass
      : `bg-${shape} bg-slate-100 dark:bg-slate-800 cursor-default!`

  return (
    <button
      type="button"
      class={`grid-cell relative aspect-square rounded-sm bg-contain bg-no-repeat ring-offset-slate-100 after:absolute after:inset-0 after:bg-contain after:bg-no-repeat dark:ring-offset-slate-800 ${shapeClass}`}
      aria-disabled={disabled}
      disabled={disabledProp}
      tabIndex={0}
      aria-label={ariaLabel}
      data-testid="grid-cell"
      onClick={disabled ? undefined : onClick}
    />
  )
}
