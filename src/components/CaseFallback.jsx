import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/** Shared Suspense status for case chrome / case body. Styles: shell.css. */
export default function CaseFallback() {
  const { t } = useLanguage()
  return (
    <div className="ds-case-fallback" role="status" aria-live="polite">
      {t('caseShell.loading')}
    </div>
  )
}
