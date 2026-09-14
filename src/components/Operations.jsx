import React, { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/**
 * Administrative & Operations — secondary professional track.
 *
 * This destination surfaces the prior Administrative Assistant role at
 * Consultorio Barcala (Mar 2021 – Feb 2024), documented bilingually in the
 * shared professional experience record. It remains distinct from the
 * current Data Analyst | Healthcare Analytics role that began in Mar 2024.
 *
 * The four axes (Administrative Support, Operations, Digital Work,
 * Analytical Advantage) describe capabilities grounded in that prior role.
 * Data/BI projects remain a separate professional track and are only
 * cross-linked as an analytical differential, not presented as evidence
 * of administrative responsibilities.
 *
 * Ordering is deliberately experience-first: the real administrative role
 * appears before the capability framing, while Data & BI remains
 * evidence/project-oriented in its own destination.
 */
export default function Operations() {
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const axisKeys = ['administrative', 'operations', 'digital', 'analytical']
  const experienceJobs = t('contact.experienceJobs')
  const experienceList = Array.isArray(experienceJobs) ? experienceJobs : []
  // The shared record contains the current Data role and prior operations
  // role. This destination selects the administrative role explicitly.
  const adminJob = experienceList.find((job) => job.org === 'Consultorio Barcala') || null

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
