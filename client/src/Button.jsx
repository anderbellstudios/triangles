import elem from './elem'

const commonClass = 'hover:brightness-95 py-2 px-4 rounded-lg whitespace-nowrap'

const common = {
  tag: 'button',
  defaultProps: { type: 'button' },
}

const Button = elem({ ...common, defaultClass: `${commonClass} bg-pink-500 text-white` })
const SubtleButton = elem({ ...common, defaultClass: `${commonClass} bg-slate-100 dark:bg-slate-800 dark:hover:brightness-110 text-pink-500` })
const IconButton = elem({ ...common, defaultClass: `${commonClass} text-pink-500 rounded-lg px-0 py-0` })

export { Button, SubtleButton, IconButton }
