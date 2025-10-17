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
        "lumora-primary": "#F59E0B",
        "lumora-secondary": "#FBBF24",
        "lumora-accent": "#FCD34D",
      },
    },
  },
  plugins: [],
}

export default config
