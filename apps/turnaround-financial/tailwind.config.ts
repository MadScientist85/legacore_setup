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
        "turnaround-primary": "#7C3AED",
        "turnaround-secondary": "#8B5CF6",
        "turnaround-accent": "#A78BFA",
      },
    },
  },
  plugins: [],
}

export default config
