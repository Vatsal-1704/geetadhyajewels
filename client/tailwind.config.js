/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0a",
          gold: "#d4af37",
          cream: "#f5f0e8",
          "gold-light": "#e8c96a",
          "gold-dark": "#d4af37",
          "gray-soft": "#f5f0e8",
        },
        luxury: {
          bg: "#FAF7F2",        // Warm ivory background
          "bg-secondary": "#F7F4EF", // Secondary neutral
          charcoal: "#1C1B19",  // Deep text
          bronze: "#2E2A25",    // Secondary text
          gold: "#D4AF37",      // Champagne gold
          "gold-light": "#E8D9B8", // Lighter gold
          "gold-dark": "#AA8C2C", // Darker gold
        },
        trust: {
          green: "#2D7A3E",     // Anti-tarnish, waterproof
          amber: "#D97706",     // Low stock warning
          emerald: "#10B981",   // Added to cart success
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 250ms ease-in-out",
        "slide-up": "slideUp 250ms ease-out",
        "slide-in-right": "slideInRight 250ms ease-out",
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
