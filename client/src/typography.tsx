import { elem } from './elem'

export const H1 = elem({ tag: 'h1', defaultClass: 'text-4xl lg:text-5xl mb-3' })
export const H2 = elem({ tag: 'h2', defaultClass: 'text-2xl lg:text-3xl mb-3' })
export const H3 = elem({ tag: 'h3', defaultClass: 'text-xl lg:text-2xl mb-3' })

export const Paragraph = elem({ tag: 'p', defaultClass: 'mb-2' })

export const LeadParagraph = elem({
  tag: 'p',
  defaultClass: 'text-lg lg:text-xl font-light',
})
