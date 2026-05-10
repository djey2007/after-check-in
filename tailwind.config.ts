import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#021a35",
          900: "#06264a",
          800: "#0b345f"
        },
        lagoon: {
          500: "#12aeb7",
          400: "#23c5ca",
          100: "#d9fbfb"
        },
        gold: {
          400: "#f8bd4f",
          300: "#ffd37a"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(18, 174, 183, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;

