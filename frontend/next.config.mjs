/** @type {import("next").NextConfig} */
import WindiCSSWebpackPlugin from "windicss-webpack-plugin"

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config, { dev, isServer }) {
    config.plugins.push(new WindiCSSWebpackPlugin())

    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat"
      })
    }

    return config
  }
}

export default nextConfig
