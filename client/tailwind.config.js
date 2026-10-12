/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Cairo', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F0E9DD',
        },
        terracotta: {
          400: '#D97757',
          500: '#C85A3C',
          600: '#A84730',
          700: '#8A3924',
        },
        olive: {
          400: '#7A8F72',
          500: '#5C7457',
          600: '#46593F',
        },
      },
    },
  },
  plugins: [],
}