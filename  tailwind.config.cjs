const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        roseSoft: '#f4d3d7',
        roseSoftDark: '#dba5ae',
        roseAccent: '#f3a8b8',
        rose: colors.rose, // Use Tailwind's full rose palette
      },
      borderRadius: {
        checkbox: '6px',
      },
    },
  },
  plugins: [],
};
