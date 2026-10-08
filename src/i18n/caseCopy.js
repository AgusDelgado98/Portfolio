import { resolvePath } from './config.js'

/**
 * Case-study copy that must not live in the initial bundle. Each case module
 * registers its namespace when that chunk loads, before the component renders.
 */
const extra = { es: {}, en: {} }

export function registerCaseCopy(namespace, esValue, enValue) {
  extra.es[namespace] = esValue
  extra.en[namespace] = enValue
}

export function resolveCaseCopy(locale, key) {
  return resolvePath(extra[locale], key)
}
