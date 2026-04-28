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
        "primary": "#000666",
        "on-primary": "#ffffff",
        "primary-container": "#1a237e",
        "on-primary-container": "#8690ee",
        "primary-fixed": "#e0e0ff",
        "on-primary-fixed": "#000767",
        "primary-fixed-dim": "#bdc2ff",
        "on-primary-fixed-variant": "#343d96",

        "secondary": "#006b5e",
        "on-secondary": "#ffffff",
        "secondary-container": "#94f0df",
        "on-secondary-container": "#006f62",
        "secondary-fixed": "#97f3e2",
        "on-secondary-fixed": "#00201b",
        "secondary-fixed-dim": "#7ad7c6",
        "on-secondary-fixed-variant": "#005047",

        "tertiary": "#301300",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#4f2400",
        "on-tertiary-container": "#ec7700",
        "tertiary-fixed": "#ffdcc6",
        "on-tertiary-fixed": "#311300",
        "tertiary-fixed-dim": "#ffb786",
        "on-tertiary-fixed-variant": "#723600",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        "background": "#fbf8fe",
        "on-background": "#1b1b1f",

        "surface": "#fbf8fe",
        "on-surface": "#1b1b1f",
        "surface-variant": "#e4e1e7",
        "on-surface-variant": "#454652",

        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f2f8",
        "surface-container": "#f0edf2",
        "surface-container-high": "#eae7ed",
        "surface-container-highest": "#e4e1e7",

        "surface-dim": "#dcd9de",
        "surface-bright": "#fbf8fe",
        "surface-tint": "#4c56af",

        "inverse-surface": "#303034",
        "inverse-on-surface": "#f3f0f5",
        "inverse-primary": "#bdc2ff",

        "outline": "#767683",
        "outline-variant": "#c6c5d4",

        // Keeping some original brand specific utility colors
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
