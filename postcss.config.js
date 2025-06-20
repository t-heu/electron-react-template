// postcss.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
const tailwindcss = require('@tailwindcss/postcss')

module.exports = {
  plugins: [
    tailwindcss()
  ],
}
