import packageJson from './package.json'

export const SITE_CONFIG = {
  name: 'ELSA → MyClub Excel Converter',
  version: `v${packageJson.version}`,
  author: {
    name: `${packageJson.author.name}`
  },
  email: {
    address: `${packageJson.author.email}`,
    subject: 'ELSA-MyClub Converter'
  },
  links: {
    githubAuthorUrl: `${packageJson.author.url}`,
    githubAppRepoUrl: `${packageJson.repository.url}`,
    elsa: 'https://elsa.basket.fi/',
    myclub: 'https://hnmky.myclub.fi/'
  }
} as const

export function getMailtoLink() {
  const email = encodeURIComponent(SITE_CONFIG.email.address)
  const subject = encodeURIComponent(SITE_CONFIG.email.subject)
  return `mailto:${email}?subject=${subject}`
}
