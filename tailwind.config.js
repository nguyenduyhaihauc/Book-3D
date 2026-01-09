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
        "envelope-glow-large": "envelope-glow-large 3s ease-in-out infinite",
        "envelope-glow-small": "envelope-glow-small 3s ease-in-out infinite 0.5s",
        "envelope-sparkle": "envelope-sparkle 4s ease-in-out infinite",
        "envelope-float": "envelope-float 4s ease-in-out infinite",
        "light-ray": "light-ray 4s linear infinite",
        "text-glow": "text-glow 2s ease-in-out infinite",
        "text-glow-subtle": "text-glow-subtle 3s ease-in-out infinite",
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
        "envelope-glow-large": {
          "0%, 100%": {
            opacity: "0.2",
            transform: "scale(1)",
            boxShadow: "0 0 40px rgba(255, 215, 0, 0.4), 0 0 80px rgba(255, 107, 107, 0.3), 0 0 120px rgba(78, 205, 196, 0.2)",
          },
          "50%": {
            opacity: "0.4",
            transform: "scale(1.15)",
            boxShadow: "0 0 60px rgba(255, 215, 0, 0.6), 0 0 100px rgba(255, 107, 107, 0.5), 0 0 140px rgba(78, 205, 196, 0.4)",
          },
        },
        "envelope-glow-small": {
          "0%, 100%": {
            opacity: "0.3",
            transform: "scale(1)",
            boxShadow: "0 0 30px rgba(255, 165, 0, 0.5), 0 0 60px rgba(255, 20, 147, 0.4), 0 0 90px rgba(0, 206, 209, 0.3)",
          },
          "50%": {
            opacity: "0.5",
            transform: "scale(1.1)",
            boxShadow: "0 0 50px rgba(255, 165, 0, 0.7), 0 0 80px rgba(255, 20, 147, 0.6), 0 0 110px rgba(0, 206, 209, 0.5)",
          },
        },
        "envelope-sparkle": {
          "0%": {
            opacity: "0",
            transform: "translate(0, 0) scale(0) rotate(0deg)",
          },
          "25%": {
            opacity: "0.5",
            transform: "translate(calc(var(--sparkle-x) * 0.5), calc(var(--sparkle-y) * 0.5)) scale(0.8) rotate(90deg)",
          },
          "50%": {
            opacity: "1",
            transform: "translate(var(--sparkle-x), var(--sparkle-y)) scale(1) rotate(180deg)",
          },
          "75%": {
            opacity: "0.5",
            transform: "translate(calc(var(--sparkle-x) * 1.2), calc(var(--sparkle-y) * 1.2)) scale(0.8) rotate(270deg)",
          },
          "100%": {
            opacity: "0",
            transform: "translate(calc(var(--sparkle-x) * 1.4), calc(var(--sparkle-y) * 1.4)) scale(0) rotate(360deg)",
          },
        },
        "envelope-float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg) scale(1)",
          },
          "25%": {
            transform: "translateY(-15px) rotate(2deg) scale(1.02)",
          },
          "50%": {
            transform: "translateY(-20px) rotate(0deg) scale(1.05)",
          },
          "75%": {
            transform: "translateY(-15px) rotate(-2deg) scale(1.02)",
          },
        },
        "light-ray": {
          "0%": {
            opacity: "0",
            transform: "scaleY(0.5)",
          },
          "50%": {
            opacity: "0.6",
            transform: "scaleY(1)",
          },
          "100%": {
            opacity: "0",
            transform: "scaleY(0.5)",
          },
        },
        "text-glow": {
          "0%, 100%": {
            textShadow: "0 0 10px rgba(220, 20, 60, 0.8), 0 0 20px rgba(220, 20, 60, 0.6), 0 0 30px rgba(220, 20, 60, 0.4), 0 0 40px rgba(255, 215, 0, 0.3)",
          },
          "50%": {
            textShadow: "0 0 15px rgba(220, 20, 60, 1), 0 0 30px rgba(220, 20, 60, 0.8), 0 0 45px rgba(220, 20, 60, 0.6), 0 0 60px rgba(255, 215, 0, 0.5)",
          },
        },
        "text-glow-subtle": {
          "0%, 100%": {
            textShadow: "0 0 8px rgba(255, 228, 181, 0.8), 0 0 15px rgba(255, 228, 181, 0.5), 0 0 25px rgba(255, 215, 0, 0.3)",
          },
          "50%": {
            textShadow: "0 0 12px rgba(255, 228, 181, 1), 0 0 20px rgba(255, 228, 181, 0.7), 0 0 35px rgba(255, 215, 0, 0.5)",
          },
        },
      },
    },
  },
  plugins: [],
};
