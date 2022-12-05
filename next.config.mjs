/** @type {import("next").NextConfig} */
import WindiCSSWebpackPlugin from "windicss-webpack-plugin"

const nextConfig = {
  experimental: {
    appDir: true
  },
  redirects: async () => {
    return [
      {
        source: "/repos/:repo/info/refs",
        destination: `http://localhost:8000/git/:repo/info/refs`,
        permanent: false,
        basePath: false
      }
    ]
  },
  webpack(config) {
    config.plugins.push(new WindiCSSWebpackPlugin())
    return config
  }
}

export default nextConfig
