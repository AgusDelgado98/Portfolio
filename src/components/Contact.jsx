import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import ContactChannels from './ContactChannels.jsx'
import AboutProfile from './AboutProfile.jsx'

/**
 * Home's Contact section. Unchanged output (Phase 1 — Destination
 * Foundation must not alter Home): same wrapping section/heading/grid as
 * before, just composed from ContactChannels + AboutProfile now that those
 * are shared with the standalone `#contact` and `#about` destinations
 * (components/ContactView.jsx, components/About.jsx) — see item 13.
 */
export default function Contact() {
  const { t } = useLanguage()

  return (
    <section className="contact-section" id="contacto">
      <div className="fade-in section-head contact-section-head">
        <span className="section-label">{t('contact.label')}</span>
        <h2 className="display-lg contact-heading safe-text-render">
          {t('contact.heading')}{' '}
          <span className="grad-text-emerald safe-text-render">{t('contact.headingAccent')}</span>
        </h2>
        <p className="prose-muted lead-tight">{t('contact.lead')}</p>
      </div>

      <div className="contact-grid">
        <ContactChannels />
        <AboutProfile />
      </div>
    </section>
  )
}
