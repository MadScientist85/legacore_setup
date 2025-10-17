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
        "hbu-primary": "#1E40AF",
        "hbu-secondary": "#3B82F6",
        "hbu-accent": "#60A5FA",
      },
    },
  },
  plugins: [],
}

export default config
