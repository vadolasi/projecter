import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import { trpc } from "../utils/trpc"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import "windi.css"

const App: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Component {...pageProps} />
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
