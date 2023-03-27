/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        'app-height': 'var(--app-height)',
        'body-height': 'calc(var(--app-height) - 64px)',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
