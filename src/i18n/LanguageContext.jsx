import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  detectInitialLocale,
  interpolate,
  resolvePath,
} from './config.js'
import { translations } from './translations.js'

const LanguageContext = createContext(null)

function applyDocumentMeta(locale, t) {
  document.documentElement.lang = locale
  // document.title is route-dependent since the Navigation Contract (Phase 0)
  // — see router/documentTitle.js, applied from App.jsx.
  const description = document.querySelector('meta[name="description"]')
  if (description) description.setAttribute('content', t('meta.description'))
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', t('meta.ogTitle'))
  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription) ogDescription.setAttribute('content', t('meta.ogDescription'))
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() =>
    typeof window !== 'undefined' ? detectInitialLocale() : DEFAULT_LOCALE,
  )

  const t = useCallback(
    (key, params) => {
      const primary = resolvePath(translations[language], key)
      const fallback = resolvePath(translations[DEFAULT_LOCALE], key)
      const value = primary ?? fallback ?? key
      return typeof value === 'string' ? interpolate(value, params) : value
    },
    [language],
  )

  const setLanguage = useCallback((next) => {
    if (next !== 'es' && next !== 'en') return
    setLanguageState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    applyDocumentMeta(language, t)
  }, [language, t])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isEs: language === 'es',
      isEn: language === 'en',
    }),
    [language, setLanguage, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function useT() {
  return useLanguage().t
}
