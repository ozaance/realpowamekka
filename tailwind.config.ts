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
        ivory: "#F5F2EC",
        stone: "#E8E3D9",
        sand: "#D4C9B0",
        charcoal: "#1C1C1A",
        "charcoal-light": "#2E2E2C",
        bronze: "#8B7355",
        "bronze-muted": "#A68B5B",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        mono: ["DM Mono", "monospace"],
      },
      fontSize: {
        hero: ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "1.05" }],
        display: ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.1" }],
        title: ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.2" }],
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
