import packageJson from './package.json'

export const SITE_CONFIG = {
  name: 'ELSA → MyClub Excel Converter',
  version: `v${packageJson.version}`
} as const
