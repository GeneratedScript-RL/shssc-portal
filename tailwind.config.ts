/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        none: '0px', // Set all border-radius to 0 globally
      },
      colors: {
        brand: {
          yellow: '#F5C400',
          green: '#2D7D32',
          lime: '#A8D500',
          orange: '#F57C00',
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};