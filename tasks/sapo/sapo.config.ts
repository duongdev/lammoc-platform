import type { SapoTenant } from './sapo.type'

export const PUPPETEER_CONFIG = {
  headless:
    process.env.NODE_ENV !== 'development' && process.env.HEADLESS !== 'false'
      ? 'new'
      : false,
  defaultViewport: {
    height: 1200,
    width: 1200,
  },
  timeout: 3 * 60000,
  args: ['--no-sandbox', '--disable-setuid-sandbox'] as string[],
} as const

export const SAPO_USER = process.env.SAPO_USER
export const SAPO_PASS = process.env.SAPO_PASS
export const SAPO_WEB_API_BASE_URL_PREFIX: Record<
  SapoTenant,
  string | undefined
> = {
  'store-lam-moc': process.env.SAPO_WEB_BASE_URL_PREFIX_SLM,
  thichtulam: process.env.SAPO_WEB_BASE_URL_PREFIX_TTL,
}

export const SAPO_WEB_GPT_PROD_VENDOR_WHITELIST = [
  'Sumika',
  'Nikawa',
  'DIY',
  'Starken',
  'Makita',
  'Bosch',
  'Dewalt',
  'Stanley',
  'Worx',
  'Kress',
  'Kyocera',
  'Karcher',
  'Irwin',
  'Fujiya',
  'Tsunoda',
  'Anex',
  'Sunflag',
  'Picus',
  'Unika',
  'Star-M',
  'Gyokucho',
  'Ringstar',
  'Ingco',
  'Tolsen',
  'Kingblue',
  'Workpro',
  'DCA',
  'Makute',
  'Sasuke',
  'Cmart',
  'C-mart',
  'Buddy',
  'Senka',
]

export const SAPO_WEB_GPT_PROD_VENDOR_BLACKLIST = ['L.Co']
