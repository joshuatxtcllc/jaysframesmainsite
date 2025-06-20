import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#000000",
          light: "#1a1a1a",
          dark: "#000000",
        },
        secondary: {
          DEFAULT: "#06b6d4",
          light: "#0891b2",
          dark: "#0e7490",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          light: "#a78bfa",
          dark: "#7c3aed",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      boxShadow: {
        'elegant': '0 35px 70px -12px rgba(0, 0, 0, 0.9), 0 15px 30px -6px rgba(0, 0, 0, 0.6), 0 5px 15px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'card': '0 15px 35px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'luxury': '0 20px 40px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'neon-purple': '0 0 30px rgba(139, 92, 246, 0.7), 0 0 60px rgba(139, 92, 246, 0.4), 0 0 90px rgba(139, 92, 246, 0.2)',
        'neon-cyan': '0 0 30px rgba(6, 182, 212, 0.7), 0 0 60px rgba(6, 182, 212, 0.4), 0 0 90px rgba(6, 182, 212, 0.2)',
        '3d': '0 25px 50px rgba(0, 0, 0, 0.6), 0 15px 30px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #0a0a0a 50%, #1f1f1f 75%, #000000 100%)',
        'luxury-pattern': 'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.03) 0%, transparent 25%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.02) 0%, transparent 25%)',
        'button-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'text-gradient': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ffffff 100%)',
      },
      animation: {
        'luxury-pattern': 'luxuryPatternFlow 60s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        luxuryPatternFlow: {
          '0%, 100%': { 
            backgroundPosition: '0% 0%, 100% 100%, 50% 50%',
            opacity: '0.4'
          },
          '33%': { 
            backgroundPosition: '100% 0%, 0% 100%, 25% 75%',
            opacity: '0.6'
          },
          '66%': { 
            backgroundPosition: '50% 100%, 50% 0%, 75% 25%',
            opacity: '0.5'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)' }
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;