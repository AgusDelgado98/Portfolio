import React, { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/**
 * Administrative & Operations — Phase 1 (Destination Foundation), refined
 * in Phase 3 (Professional Views Refinement, item 4).
 *
 * The secondary professional track: a real, self-sufficient page built
 * exclusively on real, existing experience — the Administrative Assistant
 * role at Consultorio Barcala (~2.5 years), already documented bilingually
 * in AboutProfile's experience record (`contact.experienceJobs[0]`), reused
 * here rather than re-invented. The four axes (Administrative Support,
 * Operations, Digital Work, Analytical Advantage) are the approved framing
 * from the brief, not fabricated categories.
 *
 * Deliberately does NOT reframe this as Data Science, and does NOT cite
 * OPS-adjacent data projects (Tekmérion, the operational-risk case, etc.)
 * as if they were administrative-job evidence — those are a separate,
 * distinct track (see components/DataBI.jsx), only cross-linked here by
 * name, styled as an explicit "differential", not folded in as evidence.
 *
 * Ordering is deliberately EXPERIENCE-FIRST (real job before the capability
 * framing), the opposite of Data & BI's ABSTRACTION-FIRST order
 * (positioning -> capabilities -> toolkit -> evidence). That's the main
 * lever Phase 3 uses to keep these two pages from reading as the same
 * template with different words (item 5): Data & BI feels evidence-heavy
 * and project-oriented; Operations feels practical and experience-first.
 *
 * Content-integrity fix (Phase 3, item 4/12): the Digital Work axis
 * dropped "Remote collaboration" — the real Administrative Assistant job
 * was in-person (front-desk support), so that item wasn't actually backed
 * by this track's own experience (it only applies to the separate,
 * unrelated Data & AI independent work). Google Workspace is still not
 * named — only generic "Office tools", since no specific suite is backed.
 */
export default function Operations() {
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const axisKeys = ['administrative', 'operations', 'digital', 'analytical']
  const experienceJobs = t('contact.experienceJobs')
  const experienceList = Array.isArray(experienceJobs) ? experienceJobs : []
  // The administrative/operations job is always first in the shared record
  // (see components/AboutProfile.jsx) — About keeps the full chronological
  // list, this page surfaces only the one relevant to this track.
  const adminJob = experienceList.find((job) => job.org === 'Consultorio Barcala') || experienceList[0] || null

  return (
    <article className="elog destination-view" aria-labelledby="operations-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('operations.hero.badge')}</span>
          <span>{t('operations.hero.kicker')}</span>
        </div>
        <h1 id="operations-title">{t('operations.hero.title')}</h1>
        <p className="elog-lede">{t('operations.hero.lede')}</p>
        <p className="elog-lede">{t('operations.hero.ledeSecondary')}</p>

        <nav className="elog-actions" aria-label={t('nav.backToHome')}>
          <a className="atlas-access atlas-access--primary" href="#home">
            <span aria-hidden>←</span>
            <span>{t('nav.backToHome')}</span>
          </a>
        </nav>
      </header>

      {/* Experience-first (see doc comment above) */}
      {adminJob && (
        <section className="destination-section" aria-labelledby="operations-experience-title">
          <h2 id="operations-experience-title" className="destination-section-title">
            {t('operations.experienceTitle')}
          </h2>
          <div className="destination-experience">
            <div className="destination-experience-head">
              <strong className="destination-experience-role">{adminJob.role}</strong>
              <span className="destination-experience-org">{adminJob.org}</span>
              <span className="destination-experience-meta">{adminJob.meta}</span>
            </div>
            {Array.isArray(adminJob.bullets) && adminJob.bullets.length > 0 && (
              <ul>
                {adminJob.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <section className="destination-section" aria-labelledby="operations-axes-title">
        <h2 id="operations-axes-title" className="destination-section-title">
          {t('operations.capabilitiesTitle')}
        </h2>
        <div className="destination-grid">
          {axisKeys.map((key) => {
            const axisItems = t(`operations.axes.${key}.items`)
            return (
              <div key={key} className="destination-card">
                <h3>{t(`operations.axes.${key}.title`)}</h3>
                {Array.isArray(axisItems) && axisItems.length > 0 && (
                  <ul>
                    {axisItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <div className="destination-cross-links">
        <a className="atlas-access atlas-access--primary" href="#about">
          <span>{t('operations.crossLinkAbout')}</span>
          <span aria-hidden>↗</span>
        </a>
        <a className="atlas-access" href="#contact">
          <span>{t('operations.crossLinkContact')}</span>
          <span aria-hidden>↗</span>
        </a>
        <a className="atlas-access" href="#data-bi">
          <span>{t('operations.crossLinkDataBi')}</span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    </article>
  )
}
