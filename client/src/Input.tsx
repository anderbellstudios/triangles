import elem from './elem'

export const Input = elem({
  tag: 'input',
  defaultProps: { type: 'text' },
  defaultClass:
    'appearance-none p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900',
})
