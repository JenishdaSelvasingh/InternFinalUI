/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        themeC:'var(--themeC)'
      }
    },
  },
  plugins: [],
}