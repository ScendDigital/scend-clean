/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scendPink: "#ff2d87",
        scendGrey: "#4b5563"
      },
      borderRadius: {
        "2xl": "1rem"
      }
    },
  },
  plugins: [],
};
