/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22C55E', // Green color for agriculture
        secondary: '#F59E0B', // Amber/Orange
        text: '#1F2937', // Dark gray for text
        background: '#F9FAFB', // Light gray background
      },
    },
  },
  plugins: [],
}