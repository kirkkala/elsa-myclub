import packageJson from "../package.json"

// Site Configuration
const SITE_CONFIG = {
  name: "ELSA → MyClub Excel Muuntaja",
  version: `v${packageJson.version}`,
  author: {
    name: packageJson.author.name,
    email: packageJson.author.email,
    url: packageJson.author.url,
  },
  links: {
    githubAuthorUrl: packageJson.author.url,
    githubAppRepoUrl: packageJson.repository.url,
    elsa: "https://elsa.basket.fi/",
    myclub: "https://hnmky.myclub.fi/",
  },
} as const

// SEO Configuration
const SEO_CONFIG = {
  pages: {
    home: {
      title: SITE_CONFIG.name,
      description: "Nettiappi eLSA excel tiedostojen muuntamiseen MyClub-yhteensopiviksi",
      openGraph: {
        title: `${SITE_CONFIG.name} - Helpota jojotöitä`,
        description: "Muunna ELSA:n excel tiedostot MyClub-yhteensopiviksi parilla klikkauksella",
      },
    },
    changelog: {
      title: `Versiohistoria - ${SITE_CONFIG.name}`,
      description: "ELSA-MyClub muuntimen versiohistoria ja muutosloki",
      openGraph: {
        title: `${SITE_CONFIG.name} - Versiohistoria`,
        description: "Katso sovelluksen versiohistoria ja viimeisimmät päivitykset",
      },
    },
  },
  defaults: {
    openGraph: {
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    additionalMetaTags: [
      {
        name: "keywords",
        content: "HNMKY, ELSA, MyClub, basketball, koripallo, excel, converter, muunnin",
      },
      {
        name: "author",
        content: SITE_CONFIG.author.name,
      },
      {
        name: "version",
        content: SITE_CONFIG.version,
      },
    ],
  },
} as const

// Export everything after definitions
export { SITE_CONFIG, SEO_CONFIG }
