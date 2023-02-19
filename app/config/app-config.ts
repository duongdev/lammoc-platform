export const APP_NAME = 'Thích Làm Mộc'
export const PUPPETEER_CONFIG = {
  headless:
    process.env.NODE_ENV !== 'development' || process.env.HEADLESS === 'true',
  defaultViewport: {
    height: 1200,
    width: 1200,
  },
  timeout: 3 * 60000,
}
export const SAPO_USER = process.env.SAPO_USER
export const SAPO_PASS = process.env.SAPO_PASS
