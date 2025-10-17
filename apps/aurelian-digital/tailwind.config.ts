import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "aurelian-primary": "#4B0082",
        "aurelian-secondary": "#6A0DAD",
        "aurelian-accent": "#FFD700",
      },
    },
  },
  plugins: [],
}

export default config
