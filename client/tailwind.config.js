/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#1a1a1a",
          gold: "#C9A84C",
          cream: "#FAF7F2",
          "gold-light": "#E8C96B",
          "gold-dark": "#A8872E",
          "gray-soft": "#F5F0EA",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: 0 }, "100%": { transform: "translateY(0)", opacity: 1 } },
        slideInRight: { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
