import { h } from 'preact'

const GridCell = ({ shape = null, nextShape, ...otherProps }) => {
  const enabledClass = `bg-slate-100 dark:bg-slate-600 hocus:bg-slate-200 hocus:after:bg-${nextShape} hocus:after:opacity-50 dark:hocus:bg-slate-700`
  const disabledClass = 'bg-slate-300 dark:bg-slate-800'

  const shapeClass =
    shape === null ? enabledClass : `bg-${shape} ${disabledClass}`

  return (
    <button
      type="button"
      class={`grid-cell relative aspect-square rounded bg-contain bg-no-repeat ring-offset-slate-300 after:absolute after:inset-0 after:bg-contain after:bg-no-repeat dark:ring-offset-slate-800 ${shapeClass}`}
      disabled={shape !== null}
      aria-live="polite"
      aria-label={shape === null ? `Play ${nextShape}` : `Square with ${shape}`}
      {...otherProps}
    />
  )
}

export default GridCell
