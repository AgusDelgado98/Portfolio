import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'

/**
 * ES / EN switch — the existing language system (i18n/LanguageContext.jsx),
 * unchanged. Shared by the desktop header and the mobile menu.
 */
export default function LanguageSwitch({ onSelect }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="lang-switch" role="group" aria-label={t('lang.switchAria')}>
      <button
        type="button"
        className={language === 'es' ? 'is-active' : undefined}
        aria-pressed={language === 'es'}
        onClick={() => {
          setLanguage('es')
          onSelect?.()
        }}
      >
        {t('lang.es')}
      </button>
      <span aria-hidden>|</span>
      <button
        type="button"
        className={language === 'en' ? 'is-active' : undefined}
        aria-pressed={language === 'en'}
        onClick={() => {
          setLanguage('en')
          onSelect?.()
        }}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}
