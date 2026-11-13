/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        retro: {
          dark: '#1e232a',
          board: '#2a323d',
          cell: '#374151',
          'cell-revealed': '#1f2937',
          'cell-hover': '#4b5563',
        }
      },
      boxShadow: {
        'retro-out': 'inset 2px 2px 0px rgba(255,255,255,0.25), inset -2px -2px 0px rgba(0,0,0,0.4)',
        'retro-in': 'inset 2px 2px 0px rgba(0,0,0,0.4), inset -1px -1px 0px rgba(255,255,255,0.1)',
        'retro-window': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}

