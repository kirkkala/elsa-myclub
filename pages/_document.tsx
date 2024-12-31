import { Html, Head, Main, NextScript } from 'next/document'
import { SITE_CONFIG } from '../config'

export default function Document() {
  return (
    <Html lang="fi">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Namikan kehittämä nettiappi ELSA:n excel tiedostojen muuntamiseen MyClub-yhteensopiviksi" />
        <meta name="version" content={SITE_CONFIG.version} />
        <meta name="author" content="Timo Kirkkala" />
        <meta name="keywords" content="ELSA, MyClub, basketball, koripallo, excel, converter, muunnin" />

        {/* Open Graph / Social Media */}
        <meta property="og:title" content={SITE_CONFIG.name} />
        <meta property="og:description" content="Namikan kehittämä nettiappi ELSA:n excel tiedostojen muuntamiseen MyClub-yhteensopiviksi" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_CONFIG.name} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
