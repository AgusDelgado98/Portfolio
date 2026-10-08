import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { CV_HREF } from '../../i18n/config.js'
import { PROJECTS_HASH, CONTACT_HASH } from '../../router/hashes.js'
import { GITHUB_PROFILE_URL, LINKEDIN_URL } from '../../constants/links.js'
import HeroFlowVisual from '../../visual/HeroFlowVisual.jsx'
import { STAGE_LABELS } from '../../visual/stages.js'

/**
 * Home hero (F3A §1–3). Identity first: "Data Analyst" is the h1; the value
 * statement is the subtitle. The picture is conceptual and says so.
 */
export default function HomeHero() {
  const { t } = useLanguage()
  return (
    <section className="ds-hero" aria-labelledby="home-hero-title">
      <div className="ds-hero-copy">
        <p className="ds-hero-kicker">{t('home.hero.kicker')}</p>
        <h1 id="home-hero-title" className="ds-hero-title">
          {t('home.hero.title')}
        </h1>
        <p className="ds-hero-sub">{t('home.hero.subtitle')}</p>
        <p className="ds-hero-desc">{t('home.hero.description')}</p>

        <div className="ds-hero-ctas">
          <a className="ds-btn ds-btn--primary" href={PROJECTS_HASH}>
            {t('home.hero.ctaPrimary')}
          </a>
          <a className="ds-btn ds-btn--secondary" href={CONTACT_HASH}>
            {t('home.hero.ctaSecondary')}
          </a>
        </div>

        <nav className="ds-hero-minor" aria-label={t('home.hero.minorAria')}>
          <a className="ds-link" href={CV_HREF} download>
            {t('home.hero.cv')}
          </a>
          <a className="ds-link" href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="ds-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </nav>
      </div>

      <HeroFlowVisual
        stageNames={STAGE_LABELS}
        labels={{
          aria: t('home.hero.flow.aria'),
          stagesAria: t('home.hero.flow.stagesAria'),
          captionLead: t('home.hero.flow.captionLead'),
        }}
      />
    </section>
  )
}
