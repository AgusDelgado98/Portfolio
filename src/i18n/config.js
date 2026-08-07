export const LOCALES = ['es', 'en']
export const DEFAULT_LOCALE = 'es'
export const STORAGE_KEY = 'portfolio-lang'

export const CV_PATHS = {
  es: '/cv/Agustin_Delgado_CV_ES.pdf',
  en: '/cv/Agustin_Delgado_CV_EN.pdf',
}

/** Explicit inventory — flip to false if a PDF is removed from /public/cv. */
export const CV_AVAILABLE = {
  es: true,
  en: true,
}

/** Prefer locale CV; fall back to the other file only when it exists. Never invent paths. */
export function getCvHref(locale) {
  if (CV_AVAILABLE[locale] && CV_PATHS[locale]) return CV_PATHS[locale]
  if (locale !== 'es' && CV_AVAILABLE.es && CV_PATHS.es) return CV_PATHS.es
  if (locale !== 'en' && CV_AVAILABLE.en && CV_PATHS.en) return CV_PATHS.en
  return null
}

export function detectInitialLocale() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
  } catch {
    /* ignore */
  }
  try {
    const nav = String(window.navigator.language || DEFAULT_LOCALE).toLowerCase()
    return nav.startsWith('en') ? 'en' : 'es'
  } catch {
    return DEFAULT_LOCALE
  }
}

export function resolvePath(dictionary, path) {
  if (!dictionary || !path) return undefined
  return path.split('.').reduce((acc, key) => {
    if (acc == null) return undefined
    return acc[key]
  }, dictionary)
}

export function interpolate(template, params = {}) {
  if (typeof template !== 'string') return template
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] == null ? `{${key}}` : String(params[key]),
  )
}
