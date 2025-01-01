/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React files
  ],
  theme: {
    extend: {
      colors: {
        sky: "#4FC3F7",
        lightsky: "#9ee1ff",
        carbon: "#333333",
        watermelon: "#FC6C85",
      },
    },
  },
  plugins: [],
};
