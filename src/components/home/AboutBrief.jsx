import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { ABOUT_HASH } from '../../router/hashes.js'

/** Home's short About (F3A §6). The full story stays on #about. */
export default function AboutBrief() {
  const { t } = useLanguage()
  return (
    <section className="ds-about" aria-labelledby="home-about-title">
      <h2 id="home-about-title" className="ds-h2">
        {t('home.about.title')}
      </h2>
      <div className="ds-about-body">
        <p>{t('home.about.p1')}</p>
        <p>{t('home.about.p2')}</p>
        <a className="ds-link" href={ABOUT_HASH}>
          {t('home.about.cta')} →
        </a>
      </div>
    </section>
  )
}
