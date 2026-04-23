import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          400: "var(--blue)",
          500: "var(--blue)",
          600: "#2563eb",
        },
        purple: {
          400: "var(--purple)",
          500: "var(--purple)",
          900: "#4c1d95",
        },
        green: {
          400: "var(--green)",
          500: "var(--green)",
        },
        red: {
          400: "var(--red)",
          500: "var(--red)",
        },
        yellow: {
          400: "var(--yellow)",
          500: "var(--yellow)",
        },
        gray: {
          300: "#cbd5e1",
          400: "var(--muted)",
          500: "var(--muted)",
        },
        card: "var(--card-bg)",
        cardBorder: "var(--card-border)",
        stellar: {
          blue: "#3e1bdb",
          purple: "#7c3aed",
          dark: "#0f172a",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
