/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#78BD1F',
          50: '#f1f9e6',
          100: '#e2f3cc',
          200: '#c5e699',
          300: '#a8d966',
          400: '#8acc33',
          500: '#78BD1F', 
          600: '#6ca61b',
          700: '#597e16',
          800: '#455711',
          900: '#313f0c',
        },
      },
    },
  },
  plugins: [],
});

