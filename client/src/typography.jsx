import elem from './elem'

const H1 = elem({ tag: 'h1', defaultClass: 'text-4xl lg:text-5xl mb-3' })
const H2 = elem({ tag: 'h2', defaultClass: 'text-2xl lg:text-3xl mb-3' })

const Paragraph = elem({ tag: 'p', defaultClass: 'mb-2' })

const LeadParagraph = elem({
  tag: 'p',
  defaultClass: 'text-lg lg:text-xl font-light',
})

export { H1, H2, Paragraph, LeadParagraph }
