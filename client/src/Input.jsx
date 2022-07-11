import elem from './elem'

const Input = elem({
  tag: 'input',
  defaultProps: { type: 'text' },
  defaultClass: 'p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900',
})

export {
  Input,
}
