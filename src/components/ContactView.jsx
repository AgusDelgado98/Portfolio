import React, { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import ContactChannels from './ContactChannels.jsx'

/**
 * Contact — Phase 1 (Destination Foundation), refined in Phase 3
 * (Professional Views Refinement, item 8): "la página más simple de las
 * cuatro" — must answer in seconds: cómo contactar, dónde, modalidad,
 * disponibilidad, CV, LinkedIn/email. Not another editorial view.
 *
 * Renders <ContactChannels compact/> — channels, CV, tags, no personal
 * business-card images/lightbox, no editorial "closeout" aside (see
 * ContactChannels.jsx's own doc comment on `compact`). Adds one explicit
 * facts line (location/modality, estimated availability) that no other
 * component surfaced on this page before — the same real facts already
 * used on Home's availability strip (`contact.aboutFacts.*`,
 * `contact.tags.*`), not new copy.
 *
 * "Estimated availability: ~2 weeks" is preserved verbatim (item 8) — never
 * "immediate availability".
 *
 * The heading below repeats `contact.label/heading/headingAccent/lead` —
 * the same i18n keys Contact.jsx uses for Home's contact-section-head —
 * rather than extracting that heading into a shared component. Home's
 * heading sits *outside* `.contact-grid` as a sibling of the two-card grid
 * (contact-main + about-card); extracting it into a component reusable
 * here would have forced restructuring that grid, risking a visual change
 * to Home. This is a small, deliberate, documented duplication of markup —
 * not of data or logic.
 */
export default function ContactView() {
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <article className="elog destination-view contact-view" aria-labelledby="contact-view-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('contact.label')}</span>
        </div>
        <h1 id="contact-view-title">
          {t('contact.heading')} {t('contact.headingAccent')}
        </h1>
        <p className="elog-lede">{t('contact.lead')}</p>

        <div className="home-availability-facts contact-view-facts">
          <span>{t('contact.aboutFacts.locationValue')} · {t('contact.tags.remote')}</span>
          <span>{t('contact.aboutFacts.availabilityLabel')}: {t('contact.aboutFacts.availabilityValue')}</span>
        </div>

        <nav className="elog-actions" aria-label={t('nav.backToHome')}>
          <a className="atlas-access atlas-access--primary" href="#home">
            <span aria-hidden>←</span>
            <span>{t('nav.backToHome')}</span>
          </a>
        </nav>
      </header>

      <div className="contact-view-body">
        <ContactChannels compact />
      </div>
    </article>
  )
}
