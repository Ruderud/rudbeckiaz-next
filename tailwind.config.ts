/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0, transform: 'translateY(40px)' },
        },
      },
      animation: {
        scroll: 'scroll 1.5s ease-in-out infinite',
      },
      boxShadow: {
        'scroll-box': 'inset 0 0 0 4px #fff',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
  plugins: [require('tailwind-scrollbar-hide')],
};
