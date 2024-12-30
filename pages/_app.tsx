import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ELSA → MyClub Excel muunnin</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
