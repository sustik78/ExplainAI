/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["IBM Plex Sans", "sans-serif"],
      },
      colors: {
        panel: "#111827",
        accent: "#34d399",
        accentSoft: "#0f3b33",
      },
      boxShadow: {
        glow: "0 0 40px rgba(52, 211, 153, 0.15)",
      },
      animation: {
        pulseSlow: "pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
