import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FCF9F2",
          100: "#F7F0DF",
          200: "#EEDDB8",
          300: "#E3C68E",
          400: "#D6AF66",
          500: "#C59A45",
          600: "#A87E30",
          700: "#866124",
          800: "#694B1F",
          900: "#4D3618",
        },
        sand: {
          50: "#FAF8F5",
          100: "#F5F2EB",
          200: "#ECE6DA",
          300: "#DDD4C1",
          400: "#C8BBA1",
          500: "#B2A182",
          600: "#948364",
          700: "#75664D",
          800: "#574C39",
          900: "#3D3427",
        },
        charcoal: {
          50: "#F7F7F8",
          100: "#EBEBEF",
          200: "#D3D3DC",
          300: "#B4B4C2",
          400: "#89899C",
          500: "#646477",
          600: "#494957",
          700: "#34343F",
          800: "#22222A",
          900: "#141419",
          950: "#0C0C0F",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        luxury: "0 10px 30px -10px rgba(184, 151, 88, 0.15)",
        card: "0 4px 20px -2px rgba(28, 25, 23, 0.06)",
      },
      borderRadius: {
        luxury: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
