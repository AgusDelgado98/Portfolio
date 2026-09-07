import React, { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import AboutProfile from './AboutProfile.jsx'
import Approach from './Approach.jsx'
import LearningRecord from './LearningRecord.jsx'

/**
 * About — Phase 1 (Destination Foundation), refined in Phase 3
 * (Professional Views Refinement, item 6).
 *
 * The `#about` destination: profile/trajectory/photo (AboutProfile —
 * profile, bio, both jobs chronologically, and quick facts), Formación
 * (LearningRecord, shared with Stack.jsx — this is where "#formacion" was
 * placed) and methodology (Approach, reused as-is — this is where
 * "#enfoque" was placed). As of Phase 2's Home Hub, AboutProfile is no
 * longer shared with any Home section — this is its only consumer now.
 *
 * Ordering (Phase 3): background first (profile+bio, then education),
 * "how I work now" (methodology) last, right before the cross-links —
 * reads as past -> present rather than an arbitrary list. Deliberately
 * does not re-list the Data & BI toolkit or the Operations capability axes
 * in full — those are cross-linked below instead, so this page carries its
 * own real content without duplicating either destination's territory.
 */
export default function About() {
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <article className="elog destination-view" aria-labelledby="about-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('about.hero.badge')}</span>
          <span>{t('about.hero.kicker')}</span>
        </div>
        <h1 id="about-title">{t('about.hero.title')}</h1>
        <p className="elog-lede">{t('about.hero.lede')}</p>

        <nav className="elog-actions" aria-label={t('nav.backToHome')}>
          <a className="atlas-access atlas-access--primary" href="#home">
            <span aria-hidden>←</span>
            <span>{t('nav.backToHome')}</span>
          </a>
        </nav>
      </header>

      <AboutProfile />

      <section className="destination-section" aria-labelledby="about-learning-title">
        <h2 id="about-learning-title" className="destination-section-title">
          {t('about.learningTitle')}
        </h2>
        <LearningRecord />
      </section>

      <section className="destination-section" aria-labelledby="about-methodology-title">
        <h2 id="about-methodology-title" className="destination-section-title">
          {t('about.methodologyTitle')}
        </h2>
        <Approach />
      </section>

      <section className="destination-section" aria-labelledby="about-cross-links-title">
        <h2 id="about-cross-links-title" className="destination-section-title">
          {t('about.crossLinksTitle')}
        </h2>
        <div className="destination-cross-links">
          <a className="atlas-access" href="#data-bi">
            <span>{t('about.crossLinkDataBi')}</span>
            <span aria-hidden>↗</span>
          </a>
          <a className="atlas-access" href="#operations">
            <span>{t('about.crossLinkOperations')}</span>
            <span aria-hidden>↗</span>
          </a>
          <a className="atlas-access" href="#contact">
            <span>{t('about.crossLinkContact')}</span>
            <span aria-hidden>↗</span>
          </a>
        </div>
      </section>
    </article>
  )
}
