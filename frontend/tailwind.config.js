/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        /* ---- Design Tokens (Original System) ---- */

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        destructive: "hsl(var(--destructive))",

        card: "hsl(var(--card))",
        popover: "hsl(var(--popover))",

        /* ---- Medical Theme ---- */
        medical: {
          blue: "hsl(var(--medical-blue))",
          red: "hsl(var(--medical-red))",
          teal: "hsl(var(--medical-teal))",
          light: "hsl(var(--medical-light))",
          gray: "hsl(var(--medical-gray))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },

  plugins: [],
};