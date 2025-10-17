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
        "quorentis-primary": "#DC2626",
        "quorentis-secondary": "#EF4444",
        "quorentis-accent": "#F87171",
      },
    },
  },
  plugins: [],
}

export default config
