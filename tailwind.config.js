/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#415A77',
          dark: '#1B263B',
          darker: '#0D1B2A'
        },
        background: '#F4F4F4'
      }
    },
  },
  plugins: [],
};