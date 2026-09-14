/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F4EFE6',
          300: '#EAE1D2',
          400: '#D6C8B2',
          500: '#B8A488',
        },
        ink: {
          900: '#1A1817',
          800: '#2A2624',
          700: '#3D3835',
          600: '#5A534E',
          500: '#7B736D',
          400: '#A49C94',
        },
        mukesh: {
          DEFAULT: '#2B5B84',
          light: '#4B7B9E',
          dark: '#1C3E5A',
          subtle: '#EDF4F9',
          border: '#BED4E3',
        },
        anne: {
          DEFAULT: '#B86B77',
          light: '#D48A96',
          dark: '#85424D',
          subtle: '#FAF0F2',
          border: '#E8C5CC',
        },
        soul: {
          DEFAULT: '#C29236',
          light: '#DCAB50',
          dark: '#8E671D',
          subtle: '#FAF5EA',
          border: '#E8D4A8',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

