import { defineConfig } from "windicss/helpers"
import typography from "windicss/plugin/typography"

export default defineConfig({
  extract: {
    include: ["**/*.{jsx,tsx,css}"],
    exclude: ["node_modules", ".git", ".next"]
  },
  darkMode: "class",
  plugins: [typography()]
})
