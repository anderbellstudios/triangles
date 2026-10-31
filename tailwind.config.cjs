const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './client/index.html',
    './client/src/**/*.{jsx,js,ts,tsx}',
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
      addVariant('strict-hover', ['@media (hover: hover)'])
      addVariant('aria-hidden', ['&[aria-hidden="true"]'])
    }),
  ],
}
