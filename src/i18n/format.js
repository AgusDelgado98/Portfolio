import { getCvHref } from './config.js'

/** Locale-aware number formatting for Engineering Log metrics. */
export function formatLocaleInt(value, language = 'es') {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return Number(value).toLocaleString(language === 'en' ? 'en-US' : 'es-AR')
}

export function formatLocalePct(value, language = 'es', digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return `${(Number(value) * 100).toFixed(digits)}%`
}

export function formatLocaleNum(value, digits = 3) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return Number(value).toFixed(digits)
}

export { getCvHref }
