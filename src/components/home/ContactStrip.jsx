import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { CV_HREF } from '../../i18n/config.js'
import { CONTACT_HASH } from '../../router/hashes.js'
import { GITHUB_PROFILE_URL, LINKEDIN_URL } from '../../constants/links.js'

/**
 * Home's contact strip (F3A §7): where, when, and four ways to reach out.
 * Deliberately nothing else — no job-search paragraph, no seniority line.
 */
export default function ContactStrip() {
  const { t } = useLanguage()
  return (
    <section className="ds-contact" aria-label={t('home.contact.aria')}>
      <p className="ds-contact-facts">
        <strong>{t('home.contact.location')}</strong>
        <span>{t('home.contact.availability')}</span>
      </p>
      <nav className="ds-contact-actions" aria-label={t('home.contact.actionsAria')}>
        <a className="ds-btn ds-btn--primary" href={CONTACT_HASH}>
          {t('home.contact.contact')}
        </a>
        <a className="ds-btn ds-btn--secondary" href={CV_HREF} download>
          {t('home.contact.cv')}
        </a>
        <a className="ds-link" href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="ds-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </nav>
    </section>
  )
}
