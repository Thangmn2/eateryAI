/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#a48e74',
          light: '#dec19e',
          dark: '#6c5e4d'
        },
        cream: '#F0EAE2',
        black: '#000000',
        terra: {
          DEFAULT: '#C45D35',
          light: '#D97B56',
          dark: '#A84B29',
          50: '#FEF3EE',
          100: '#FCDDC9',
        },
        sage: {
          DEFAULT: '#5F8B64',
          light: '#7BA680',
          dark: '#4A7050',
          50: '#F0F5F0',
        },
        warmgray: {
          DEFAULT: '#7A746E',
          light: '#A39D97',
          dark: '#5C5752',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(44,42,40,0.06), 0 4px 12px rgba(44,42,40,0.04)',
        'card-hover': '0 4px 16px rgba(44,42,40,0.1), 0 1px 4px rgba(44,42,40,0.06)',
        modal: '0 24px 80px rgba(44,42,40,0.2)',
      },
    },
  },
  plugins: [],
}
