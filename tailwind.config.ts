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
        flare: {
          50: "#fffbeb",
          100: "#fef3c7",
          400: "var(--flare)",
          500: "var(--flare)",
          600: "#ea580c",
        },
        solar: {
          400: "#fbbf24",
          500: "#f59e0b",
          900: "#78350f",
        },
        green: {
          400: "#34d399",
          500: "#10b981",
        },
        red: {
          400: "#f87171",
          500: "#ef4444",
        },
        yellow: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        gray: {
          300: "#cbd5e1",
          400: "var(--muted)",
          500: "var(--muted)",
        },
        card: "var(--card-bg)",
        cardBorder: "var(--card-border)",
        stellar: {
          amber: "#f59e0b",
          gold: "#fbbf24",
          dark: "#020617",
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
