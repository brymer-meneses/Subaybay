import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
  plugins: [
    require("@tailwindcss/forms"),
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "pale-red": {
          100: "#F6EDED",
          200: "#F0E2E2",
          300: "#E1C4C5",
          400: "#E9D9D9",
          500: "#BA9798",
          600: "#FFCFCF",
        },
        "pale-yellow": {
          100: "#F6EEC2",
        },
        primary: "hsl(358, 70%, 27%)",
        secondary: {
          100: "hsl(0, 88%, 97%)",
          200: "hsl(2, 90%, 92%)",
        },
        accent: "hsl(42, 89%, 66%)",
        confirm: "hsl(149, 97%, 13%)",
        reject: "hsl(0,72.2%,50.6%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        inter: ["Inter Variable", "sans-seriff"],
        poppins: ["Poppins", "sans-seriff"],
        sans: [...fontFamily.sans],
      },
    },
  },
};

export default config;