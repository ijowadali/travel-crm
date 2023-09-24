/** @type {import('tailwindcss').Config} */
const DEFAULT_FONTS =
  'system-ui, -apple-system, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        default: [DEFAULT_FONTS]
      },
      textColor: {
        muted: '#999999'
      },
      backgroundColor: {
        'layout-light': '#F5F6F7',
        'layout-dark': '#0F0F0F',
        'default-light': '#FEFEFE',
        'default-dark': '#36393F'
      }
    }
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]']
};
