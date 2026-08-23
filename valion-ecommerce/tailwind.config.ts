import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        valion: {
          navy: "#0F172A",   // Primario - confianza/seguridad
          amber: "#F59E0B",  // Secundario - energía/rapidez
          orange: "#FF6B00", // Acento CTA - comprar ahora
          bg: "#F8FAFC",     // Fondo base
          ink: "#1E293B",    // Texto principal
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        cta: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
