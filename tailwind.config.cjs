const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './client/index.html',
    './client/src/**/*.{jsx,js,ts,tsx}',
  ],
  safelist: [
    'bg-cross',
    'bg-circle',
    'bg-triangle',
    'strict-hover:hover:after:bg-cross',
    'strict-hover:hover:after:bg-circle',
    'strict-hover:hover:after:bg-triangle',
    'focus-visible:after:bg-cross',
    'focus-visible:after:bg-circle',
    'focus-visible:after:bg-triangle',
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
      addVariant('strict-hover', ['@media (hover: hover)'])
      addVariant('aria-hidden', ['&[aria-hidden="true"]'])
    }),
  ],
}
