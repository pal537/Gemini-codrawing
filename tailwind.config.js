/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['GT-Maru', 'sans-serif'],
        'mono': ['GT-Maru-Mono', 'monospace'],
        'mega': ['GT-Maru-Mega-Midi', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 