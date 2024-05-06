import { elem } from './elem'

const commonClass =
  'whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50'

const common = {
  tag: 'button',
  defaultProps: { type: 'button' },
} as const

export const Button = elem({
  ...common,
  defaultClass: `${commonClass} py-2 px-4 rounded-lg hover:brightness-95 bg-pink-600 text-white`,
})

export const SubtleButton = elem({
  ...common,
  defaultClass: `${commonClass} py-2 px-4 rounded-lg hover:brightness-95 bg-slate-100 dark:bg-slate-800 dark:hover:brightness-110 text-pink-700 dark:text-pink-500`,
})

export const IconButton = elem({
  ...common,
  defaultClass: `${commonClass} rounded-lg text-pink-600 -m-1 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-pink-500`,
})

export const ButtonLink = elem({
  ...common,
  defaultClass: `${commonClass} text-pink-600 dark:text-pink-500 underline hover:brightness-75 dark:hover:brightness-125`,
})
