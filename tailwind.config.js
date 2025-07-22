module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brew-brown': {
          '50': '#f6f4ef',
          '100': '#ece7d9',
          '200': '#d8cbb3',
          '300': '#c3ae8c',
          '400': '#b0926b',
          '500': '#a17f56',
          '600': '#8e6f4c',
          '700': '#705840',
          '800': '#5a4736',
          '900': '#4b3b30',
          '950': '#2c211a',
        },
        'brew-gold': {
          '500': '#facc15',
        }
      }
    }
  },
  plugins: [],
}