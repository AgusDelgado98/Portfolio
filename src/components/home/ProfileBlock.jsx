import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { ABOUT_HASH } from '../../router/hashes.js'

/**
 * "Perfil": where the transition starts and where it is going. Three confirmed
 * facts (current work, training, direction); nothing here claims a certificate
 * or a role the profile does not have. The full story stays on #about.
 */
export default function ProfileBlock() {
  const { t } = useLanguage()
  const rows = t('home.profile.rows')

  return (
    <div className="home-profile">
      <p className="home-label">{t('home.profile.label')}</p>
      <h2 className="home-profile__title">{t('home.profile.title')}</h2>
      <div className="home-profile__rows">
        {rows.map((row) => (
          <div className="home-profile__row" key={row.label}>
            <span className="home-label home-label--ink">{row.label}</span>
            <span>{row.text}</span>
          </div>
        ))}
        <a className="home-link home-link--paper" href={ABOUT_HASH}>
          {t('home.profile.cta')} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  )
}
