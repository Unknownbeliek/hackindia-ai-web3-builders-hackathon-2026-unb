/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dpi: {
          dark: "#090d16",
          panel: "#111827",
          border: "#1f2937",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#ef4444",
          blue: "#3b82f6"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        hindi: ['Rozha One', 'serif'],
      },
    },
  },
  plugins: [],
}
