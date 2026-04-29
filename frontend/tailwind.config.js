/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cream: { 50: '#fdfcf7', 100: '#f9f6ed', 200: '#f0ead7' },
        forest: { 400: '#5a8a6a', 500: '#3d6b4f', 600: '#2d5239', 700: '#1f3b29', 800: '#142618', 900: '#0a1510' },
        amber: { 300: '#fbbf24', 400: '#f59e0b', 500: '#d97706' },
        rust: { 400: '#cd5c3a', 500: '#b54530', 600: '#9a3825' },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
      },
    },
  },
  plugins: [],
}
