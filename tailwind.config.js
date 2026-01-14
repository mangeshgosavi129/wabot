/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#22d3ee', // cyan-400
          DEFAULT: '#7c3aed', // violet-600
          dark: '#4c1d95', // violet-900
        },
        accent: {
          light: '#f472b6', // pink-400
          DEFAULT: '#db2777', // pink-600
          dark: '#be185d', // pink-700
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
