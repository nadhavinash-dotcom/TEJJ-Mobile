/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // TEJJ brand colours
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        navy: {
          50: '#e8edf5',
          100: '#c5d0e6',
          200: '#9aafd3',
          300: '#6f8ebf',
          400: '#4a71af',
          500: '#1e549e',
          600: '#1a4a8e',
          700: '#153d7a',
          800: '#0f3066',
          900: '#0A1628', // primary dark navy
          950: '#060d18',
        },
        flash: '#EF4444',
        'same-day': '#F59E0B',
        contract: '#3B82F6',
        permanent: '#8B5CF6',
      },
      fontFamily: {
        sans: ['NotoSans', 'system-ui', 'sans-serif'],
        bold: ['NotoSans-Bold', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
