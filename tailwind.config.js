/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include all files inside src directory
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
