/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          background: "#FFFFFF",
          light: "#232F3E",
          DEFAULT: "#131921",
          text: "#111111",
          blue: "#0066c0",
          orange: "#C7511F",
          yellow: "#FFD814",
          yellow_hover: "#F7CA00",
          secondary: "#FFA41C",
        },
      },
      fontFamily: {
        sans: ["Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
