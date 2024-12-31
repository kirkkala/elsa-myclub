import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.scss'
import { SITE_CONFIG } from '../config'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{SITE_CONFIG.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
