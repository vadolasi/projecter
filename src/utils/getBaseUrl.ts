let cache = ""

export function getBaseUrl() {
  if (cache) {
    return cache
  }

  if (typeof window !== "undefined")
    return (cache = "")
  if (process.env.VERCEL_URL)
    return (cache = `https://${process.env.VERCEL_URL}`)
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return (cache = `https://${process.env.RENDER_INTERNAL_HOSTNAME}`)
  return (cache = `http://localhost:${process.env.PORT ?? 3000}`)
}
