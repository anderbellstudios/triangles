import { h } from 'preact'

const Grid = () => {
  return (
    <div class="bg-slate-300 dark:bg-slate-700 rounded-lg grid grid-cols-4 gap-1 p-1 sm:gap-2 sm:p-2" id="grid">
        {
          Array.from({ length: 16 }).map((_, i) => (
            <button
              type="button"
              class="bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 ring-offset-slate-300 dark:ring-offset-slate-700 rounded aspect-square"
            />
          ))
        }
      </div>
  )
}

export default Grid
