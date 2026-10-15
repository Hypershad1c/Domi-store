import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1F4D",
        signal: "#2563EB",
        cloud: "#F4F7FB",
        line: "#E4EAF2",
        mint: "#DDF7EB",
        amber: "#FFF3D6"
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: {
        soft: "0 18px 45px rgba(15,31,77,.10)",
        card: "0 8px 28px rgba(15,31,77,.07)"
      },
      borderRadius: { xl: "1.25rem", "2xl": "1.75rem" }
    }
  },
  plugins: []
};
export default config;
