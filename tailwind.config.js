/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      fontSize: {
        "10xl": "10rem",
        "11xl": "11rem",
        "12xl": "12rem",
        "13xl": "13rem",
      },
      animation: {
        "horizontal-scroll": "horizontal-scroll linear 16s infinite ",
        "horizontal-scroll-2": "horizontal-scroll-2 linear 16s infinite ",
        "fade-in": "fade-in 0.5s ease-in",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "glow-pulse-delayed": "glow-pulse 2s ease-in-out infinite 0.5s",
        "sparkle": "sparkle 3s ease-in-out infinite",
        "fireworks-magic": "fireworks-magic 2s ease-in-out infinite",
      },
      keyframes: {
        "horizontal-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "horizontal-scroll-2": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": {
            opacity: "0.3",
            transform: "scale(1)",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 107, 107, 0.2), 0 0 60px rgba(78, 205, 196, 0.1)",
          },
          "50%": {
            opacity: "0.6",
            transform: "scale(1.1)",
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 107, 107, 0.4), 0 0 90px rgba(78, 205, 196, 0.3)",
          },
        },
        "sparkle": {
          "0%": {
            opacity: "0",
            transform: "translate(0, 0) scale(0) rotate(0deg)",
          },
          "50%": {
            opacity: "1",
            transform: "translate(var(--sparkle-x, 60px), var(--sparkle-y, 0px)) scale(1) rotate(180deg)",
          },
          "100%": {
            opacity: "0",
            transform: "translate(var(--sparkle-x, 80px), var(--sparkle-y, 0px)) scale(0) rotate(360deg)",
          },
        },
        "fireworks-magic": {
          "0%, 100%": {
            transform: "translateY(0) scale(1) rotate(0deg)",
            filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
          },
          "25%": {
            transform: "translateY(-8px) scale(1.05) rotate(-5deg)",
            filter: "drop-shadow(0 0 15px rgba(255, 107, 107, 0.6))",
          },
          "50%": {
            transform: "translateY(-5px) scale(1.08) rotate(5deg)",
            filter: "drop-shadow(0 0 20px rgba(78, 205, 196, 0.7))",
          },
          "75%": {
            transform: "translateY(-10px) scale(1.05) rotate(-3deg)",
            filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))",
          },
        },
      },
    },
  },
  plugins: [],
};
