import { h } from 'preact'

const GridCell = ({ shape = null, nextShape, disabled, ...otherProps }) => {
  const emptyClass = `bg-slate-200 dark:bg-slate-700 ${
    disabled
      ? 'cursor-not-allowed'
      : `hocus:bg-slate-100 hocus:after:bg-${nextShape} hocus:after:opacity-40 dark:hocus:bg-slate-800`
  }`

  const shapeClass =
    shape === null ? emptyClass : `bg-${shape} bg-slate-100 dark:bg-slate-800`

  return (
    <button
      type="button"
      class={`grid-cell relative aspect-square rounded bg-contain bg-no-repeat ring-offset-slate-100 after:absolute after:inset-0 after:bg-contain after:bg-no-repeat dark:ring-offset-slate-800 ${shapeClass}`}
      disabled={shape !== null || disabled}
      aria-live="polite"
      aria-label={shape === null ? `Play ${nextShape}` : `Square with ${shape}`}
      {...otherProps}
    />
  )
}

export default GridCell
