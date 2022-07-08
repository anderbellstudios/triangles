import elem from './elem'

const LargeSwitch = elem({
  tag: 'input',
  defaultProps: { type: 'checkbox' },
  defaultClass:
    'appearance-none w-12 h-6 rounded-full bg-slate-300 dark:bg-slate-700 relative hover:brightness-95 after:block after:absolute after:w-4 after:h-4 after:left-1 after:top-1 checked:after:translate-x-6 after:transition-transform checked:bg-pink-500 transition-colors after:bg-white after:rounded-full',
})

export { LargeSwitch }
