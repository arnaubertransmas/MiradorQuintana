/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef6ee',
          100: '#fdead7',
          200: '#fad2ae',
          300: '#f7b47b',
          400: '#f38b46',
          500: '#ef6c22',
          600: '#e05316',
          700: '#ba3e14',
          800: '#943318',
          900: '#782c16',
        },
      },
    },
  },
  plugins: [],
};
