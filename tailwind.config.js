/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d5a2d',
        secondary: '#4a7c4a',
        text: '#1F2937',
        background: '#F9FAFB',
      },
    },
  },
  plugins: [],
}