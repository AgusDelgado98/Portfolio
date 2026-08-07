import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HALO_BRIEF_URL, isHaloBriefLive } from '../constants/links.js'
import { CV_AVAILABLE, CV_PATHS } from '../i18n/config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const channelMeta = [
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/agustin-delgado-data98615190/',
    accent: 'sky',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    id: 'github',
    href: 'https://github.com/Agus-Delgado',
    accent: 'violet',
    handle: 'Agus-Delgado',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: 'email',
    href: 'mailto:augusto.delgado00@hotmail.com',
    accent: 'emerald',
    handle: 'augusto.delgado00@hotmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
]

const cardMeta = [
  {
    id: 'linkedin',
    src: '/brand/agustin-delgado-card-linkedin-front.webp',
    altKey: 'contact.cardAltLinkedin',
  },
  {
    id: 'portfolio',
    src: '/brand/agustin-delgado-card-portfolio-back.webp',
    altKey: 'contact.cardAltPortfolio',
  },
]

export default function Contact() {
  const { t } = useLanguage()
  const [selectedCard, setSelectedCard] = useState(null)
  const lightboxRef = useRef(null)
  const lightboxCloseRef = useRef(null)
  const lightboxOpenerRef = useRef(null)
  const haloLive = isHaloBriefLive()

  const cvDownloads = [
    ...(CV_AVAILABLE.es ? [{ label: t('contact.cvEs'), href: CV_PATHS.es, lang: 'es' }] : []),
    ...(CV_AVAILABLE.en ? [{ label: t('contact.cvEn'), href: CV_PATHS.en, lang: 'en' }] : []),
  ]

  const channels = channelMeta.map((ch) => ({
    ...ch,
    label:
      ch.id === 'linkedin'
        ? 'LinkedIn'
        : ch.id === 'github'
          ? t('contact.githubLabel')
          : t('contact.emailLabel'),
    handle:
      ch.id === 'linkedin' ? t('contact.linkedinHandle') : ch.handle,
  }))

  const personalCards = cardMeta.map((card) => ({
    ...card,
    alt: t(card.altKey),
    label: card.id === 'linkedin' ? t('contact.cardLinkedin') : t('contact.cardPortfolio'),
  }))

  const tags = [
    t('contact.tags.open'),
    t('contact.tags.mode'),
    t('contact.tags.remote'),
    t('contact.tags.city'),
  ]

  const aboutFacts = [
    { icon: '📍', label: t('contact.aboutFacts.locationLabel'), value: t('contact.aboutFacts.locationValue') },
    { icon: '🎯', label: t('contact.aboutFacts.roleLabel'), value: t('contact.aboutFacts.roleValue') },
    { icon: '🏥', label: t('contact.aboutFacts.contextLabel'), value: t('contact.aboutFacts.contextValue') },
    { icon: '⚡', label: t('contact.aboutFacts.availabilityLabel'), value: t('contact.aboutFacts.availabilityValue') },
  ]

  const closeCard = useCallback(() => {
    setSelectedCard(null)
    window.requestAnimationFrame(() => lightboxOpenerRef.current?.focus())
  }, [])

  const openCard = (card, event) => {
    lightboxOpenerRef.current = event.currentTarget
    setSelectedCard({ src: card.src, alt: card.alt })
  }

  useEffect(() => {
    if (!selectedCard) return undefined

    const focusableElements = lightboxRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const firstFocusable = focusableElements?.[0]
    const lastFocusable = focusableElements?.[focusableElements.length - 1]

    window.requestAnimationFrame(() => lightboxCloseRef.current?.focus())

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeCard()
        return
      }

      if (event.key !== 'Tab' || !firstFocusable || !lastFocusable) return

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    document.body.classList.add('card-lightbox-open')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('card-lightbox-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeCard, selectedCard])

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
        <div className="contact-main card card--spotlight fade-in fade-in-delay-1">
          <h3 className="contact-main-title">{t('contact.pointsTitle')}</h3>
          <p className="contact-main-text">{t('contact.pointsText')}</p>

          <aside className="halo-cta-card" aria-labelledby="halo-cta-title">
            <h3 id="halo-cta-title" className="halo-cta-title">
              {t('contact.haloTitle')}
            </h3>
            <p className="halo-cta-text">{t('contact.haloText')}</p>
            <div className="halo-cta-actions">
              {haloLive ? (
                <a
                  href={HALO_BRIEF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  {t('contact.haloCta')}
                </a>
              ) : (
                <>
                  <span className="btn btn-ghost halo-cta-btn--pending" aria-disabled="true">
                    {t('contact.haloCta')}
                  </span>
                  <span className="halo-cta-note">{t('contact.haloSoon')}</span>
                </>
              )}
            </div>
          </aside>

          <div className="channels-list">
            {channels.map((ch) => (
              <a
                key={ch.id}
                className="channel-link"
                href={ch.href}
                {...(ch.href.startsWith('mailto:')
                  ? {}
                  : { target: '_blank', rel: 'noreferrer noopener' })}
              >
                <div className={`channel-icon ${ch.accent}`}>{ch.icon}</div>
                <div className="channel-info">
                  <div className="channel-label">{ch.label}</div>
                  <div className="channel-handle">{ch.handle}</div>
                </div>
                <svg className="channel-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>

          <div className="cv-downloads">
            {cvDownloads.map((cv) => (
              <a
                key={cv.lang}
                className="btn btn-ghost cv-download-btn"
                href={cv.href}
                download
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                {cv.label}
              </a>
            ))}
          </div>

          <div className="contact-tags">
            {tags.map((tag) => (
              <span key={tag} className="pill accent">
                {tag}
              </span>
            ))}
          </div>

          <div className="personal-cards-block">
            <p className="personal-cards-note">{t('contact.cardsNote')}</p>
            <div className="personal-cards-preview">
              {personalCards.map((card) => (
                <button
                  key={card.src}
                  type="button"
                  className="personal-card-button"
                  aria-label={t('contact.expandCard', { label: card.label })}
                  onClick={(event) => openCard(card, event)}
                >
                  <img
                    src={card.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="2048"
                    height="1137"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="about-card card card--spotlight fade-in fade-in-delay-2">
          <div className="profile-strip">
            <img
              src="/img/foto.jpg"
              alt={t('contact.profileAlt')}
              loading="lazy"
              decoding="async"
              width="160"
              height="160"
              style={{
                width: 'clamp(112px, 30vw, 160px)',
                height: 'clamp(112px, 30vw, 160px)',
                borderRadius: '999px',
                objectFit: 'cover',
                border: '2px solid rgba(34, 211, 238, 0.5)',
                boxShadow: '0 0 24px rgba(34, 211, 238, 0.15)',
              }}
            />
            <div>
              <h3 className="about-title">{t('contact.aboutTitle')}</h3>
              <p className="profile-note">{t('contact.aboutRole')}</p>
            </div>
          </div>

          <p className="about-text">{t('contact.aboutP1')}</p>
          <p className="about-text about-text--secondary">{t('contact.aboutP2')}</p>

          <div className="about-divider" />

          <div className="about-facts">
            {aboutFacts.map((f) => (
              <div key={f.label} className="about-fact">
                <div className="about-fact-icon">{f.icon}</div>
                <span className="about-fact-label">{f.label}</span>
                <span className="about-fact-value">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCard && (
        <div
          ref={lightboxRef}
          className="card-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t('contact.lightboxAria')}
          onClick={closeCard}
        >
          <div className="card-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              ref={lightboxCloseRef}
              className="card-lightbox-close"
              onClick={closeCard}
              aria-label={t('contact.closeLightbox')}
            >
              ×
            </button>
            <img
              src={selectedCard.src}
              alt={selectedCard.alt}
              decoding="async"
              width="2048"
              height="1137"
            />
          </div>
        </div>
      )}
    </section>
  )
}
