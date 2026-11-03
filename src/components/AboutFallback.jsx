import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/**
 * Suspense placeholder for About. Reserves first-viewport geometry so the
 * footer does not jump when the deferred About chunk resolves (F12 CLS).
 * Styles live in shell.css (always loaded); About's own CSS stays deferred.
 */
export default function AboutFallback() {
  const { t } = useLanguage()
  return (
    <div className="ds-about-fallback" role="status" aria-live="polite" aria-busy="true">
      <span className="ds-visually-hidden">{t('caseShell.loading')}</span>
    </div>
  )
}
