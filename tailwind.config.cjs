const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './client/index.html',
    './client/src/**/*.{jsx,js}',
  ],
  safelist: [
    'bg-cross',
    'bg-circle',
    'bg-triangle',
    'hocus:after:bg-cross',
    'hocus:after:bg-circle',
    'hocus:after:bg-triangle',
  ],
  theme: {
    extend: {
      backgroundImage: {
        cross: 'url(/src/cross.svg)',
        circle: 'url(/src/circle.svg)',
        triangle: 'url(/src/triangle.svg)',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('hocus', ['&:hover', '&:focus-visible'])
      addVariant('aria-hidden', ['&[aria-hidden="true"]'])
    }),
  ],
}
