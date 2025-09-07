/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#0A2463',
        'golden-yellow': '#FFD700',
        'deep-blue': '#1A237E',
        'rich-gold': '#C49000',
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg,rgb(23, 72, 25) 0%, #1A237E 50%, #C49000 100%)',
      }
    },
  },
  plugins: [],
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
    safelist: ['no-scrollbar', 'no-scrollbar-track', 'no-scrollbar-thumb'],
  },
 }