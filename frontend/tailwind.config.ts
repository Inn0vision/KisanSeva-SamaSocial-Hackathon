import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#fafaf7",
          dark: "#0d1117",
        },
        surface: {
          DEFAULT: "#ffffff",
          dark: "#161b22",
          "2": "#f5f5f0",
          "2-dark": "#1c2128",
        },
        border: {
          DEFAULT: "#e5e7eb",
          subtle: "#f3f4f6",
          strong: "#d1d5db",
          dark: "#30363d",
          "subtle-dark": "#21262d",
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
          "dark-50": "#0d2818",
          "dark-100": "#1a3a24",
          "dark-primary": "#3fb950",
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        sm: "0.5rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        "card-dark": "0 1px 3px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hover-dark": "0 4px 16px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.06)",
        "green-glow": "0 0 20px rgba(22,163,74,0.18)",
        "green-glow-dark": "0 0 20px rgba(63,185,80,0.20)",
        dropdown: "0 8px 24px rgba(0,0,0,0.10)",
        "dropdown-dark": "0 8px 24px rgba(0,0,0,0.50)",
        modal: "0 20px 60px rgba(0,0,0,0.15)",
        "modal-dark": "0 20px 60px rgba(0,0,0,0.60)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.25s ease-out",
        "pulse-green": "pulseGreen 2s infinite",
        shimmer: "shimmer 1.4s ease-in-out infinite",
        "scan-line": "scanLine 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(22,163,74,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(22,163,74,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scanLine: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
