export const LOCALES = ['es', 'en']
export const DEFAULT_LOCALE = 'es'
export const STORAGE_KEY = 'portfolio-lang'

/** Single official CV (English, August 2026). */
export const CV_HREF = '/cv/Agustin_Delgado_CV_EN.pdf'

/** Stable alias for callers that previously resolved by locale. */
export function getCvHref() {
  return CV_HREF
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
