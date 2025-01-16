import React from "react"
import type { AppProps } from "next/app"
import "../styles/globals.scss"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import Head from "../components/Head/Head"

export default function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <Head />
      <Component {...pageProps} />
      <SpeedInsights />
      <Analytics />
    </>
  )
}
