import React from 'react'
import { CV_HREF } from '../i18n/config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { GITHUB_PROFILE_URL, LINKEDIN_URL } from '../constants/links.js'

const EMAIL = 'mailto:augusto.delgado00@hotmail.com'

/** `#contact`: where, when, and the four real channels. No form, no extra channels. */
export default function ContactView() {
  const { t } = useLanguage()

  return (
    <article className="ds-contact-page">
      <div className="ds-contact-layout">
        <header>
          <h1>{t('contact.pageTitle')}</h1>
          <p className="ds-contact-lede">{t('contact.pageLede')}</p>
          <p className="ds-contact-facts">{t('home.contact.location')}</p>
          <p className="ds-contact-availability">{t('home.contact.availability')}</p>
        </header>
        <nav className="ds-contact-channels" aria-label={t('contact.pointsTitle')}>
          <a href={EMAIL}>{t('footer.email')}</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            {t('footer.linkedin')}
          </a>
          <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
            {t('footer.github')}
          </a>
          <a href={CV_HREF} download>
            {t('contact.cv')}
          </a>
        </nav>
      </div>
    </article>
  )
}
