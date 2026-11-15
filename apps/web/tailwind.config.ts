import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      tablet: "1024px",
      lg: "1024px",
      desktop: "1440px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        bg: {
          primary: "var(--color-bg-primary, #171717)",
          secondary: "var(--color-bg-secondary, #202020)",
        },
        surface: {
          card: "var(--color-surface-card, #252525)",
          elevated: "var(--color-surface-elevated, #2C2C2C)",
          input: "var(--color-surface-input, #1D1D1D)",
        },
        border: {
          DEFAULT: "var(--color-border-default, #383838)",
          subtle: "var(--color-border-subtle, #303030)",
        },
        text: {
          primary: "var(--color-text-primary, #F5F5F5)",
          secondary: "var(--color-text-secondary, #A3A3A3)",
          muted: "var(--color-text-muted, #737373)",
        },
        accent: {
          DEFAULT: "var(--color-accent-primary, #FF6B35)",
          hover: "var(--color-accent-hover, #FF8255)",
          soft: "var(--color-accent-soft, #42271F)",
        },
        status: {
          success: "var(--color-status-success, #4ADE80)",
          warning: "var(--color-status-warning, #FBBF24)",
          critical: "var(--color-status-critical, #F87171)",
          info: "var(--color-status-info, #60A5FA)",
          neutral: "var(--color-status-neutral, #A3A3A3)",
        },
        sidebar: {
          DEFAULT: "#171717",
          foreground: "#F5F5F5",
          primary: "#FF6B35",
          "primary-foreground": "#FFFFFF",
          accent: "#252525",
          "accent-foreground": "#FFFFFF",
          border: "#303030",
          ring: "#FF6B35",
        },
        destructive: {
          DEFAULT: "#F87171",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#4ADE80",
          foreground: "#171717",
        },
        muted: {
          DEFAULT: "#252525",
          foreground: "#737373",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
