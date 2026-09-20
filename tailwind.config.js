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
        // Mukesh's Journey: Shades of green (mainly cyan, turquoise & teal)
        mukesh: {
          DEFAULT: '#0D9488', // Teal-600
          light: '#14B8A6',   // Teal-500
          cyan: '#06B6D4',    // Cyan-500
          turquoise: '#2DD4BF', // Turquoise
          dark: '#0F766E',    // Teal-700
          subtle: '#F0FDFA',  // Teal-50
          border: '#99F6E4',  // Teal-200
        },
        // Anne's Journey: Shades of Blue, Purple & Pink
        anne: {
          DEFAULT: '#8B5CF6', // Violet-500
          pink: '#EC4899',    // Pink-500
          blue: '#6366F1',    // Indigo-500
          light: '#A855F7',   // Purple-500
          dark: '#6D28D9',    // Purple-700
          subtle: '#FAF5FF',  // Purple-50
          border: '#E9D5FF',  // Purple-200
        },
        // Copiko & Milo's Soul: Shades of Orange
        soul: {
          DEFAULT: '#F97316', // Orange-500
          light: '#FB923C',   // Orange-400
          amber: '#F59E0B',   // Amber-500
          dark: '#C2410C',    // Orange-700
          subtle: '#FFF7ED',  // Orange-50
          border: '#FED7AA',  // Orange-200
        },
      },
      animation: {
        'float-slow': 'float 18s ease-in-out infinite',
        'float-delayed': 'float 22s ease-in-out 4s infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.08)' },
          '66%': { transform: 'translate(-25px, 20px) scale(0.95)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
