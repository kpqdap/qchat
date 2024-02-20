/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        siteTitle: 'var(--QLD-color-siteTitle)',
        designAccent: 'var(--QLD-color-designAccent)',
        heading: 'var(--QLD-color-heading)',
        text: 'var(--QLD-color-text)',
        textMuted: 'var(--QLD-color-text-muted)',
        link: 'var(--QLD-color-link)',
        linkVisited: 'var(--QLD-color-link-visited)',
        buttonText: 'var(--QLD-color-button-text)',
        button: 'var(--QLD-color-button)',
        buttonHover: 'var(--QLD-color-button-hover)',
        focus: 'var(--QLD-color-focus)',
        border: 'var(--QLD-color-border)',
        background: 'var(--QLD-color-background)',
        darkbackground: 'var(--QLD-color-dark-background)',
        backgroundShade: 'var(--QLD-color-background-shade)',
        underline: 'var(--QLD-color-underline)',
        hoverUnderline: 'var(--QLD-color-hover-underline)',
        visitedUnderline: 'var(--QLD-color-visited-underline)',
        hoverVisitedUnderline: 'var(--QLD-color-hover-visited-underline)',
        altButton: 'var(--QLD-color-alt-button)',
        darkAltButton: 'var(--QLD-color-dark-alt-button)',
        altButtonHover: 'var(--QLD-color-alt-button-hover)',
        altBorder: 'var(--QLD-color-alt-border)',
        altBackground: 'var(--QLD-color-alt-background)',
        altBackgroundShade: 'var(--QLD-color-alt-background-shade)',
        brand: "hsl(var(--brand))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        //background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Noto Sans", '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
      },
      fontSize: {
        'xs': '.6rem',
        'sm': '.8rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.3rem',
        '3xl': '1.5rem',
      },
      fontweight: {
        "light": "300",
        "normal": "400",
        "semibold": "600",
        "bold": "700",
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      }
    },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
