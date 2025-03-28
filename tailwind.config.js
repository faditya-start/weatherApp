/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E293B",
        secondary: "#334155",
        accent: "#38BDF8"
      }
    },
  },
  plugins: [],
} 