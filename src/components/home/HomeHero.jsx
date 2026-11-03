import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { PROJECTS_HASH, ABOUT_HASH } from '../../router/hashes.js'
import { JOURNEY_STEPS } from '../../projects/registry.js'
import HeroFigure from './HeroFigure.jsx'

/**
 * Home hero — "Superficie de decisión" (F4): eyebrow, headline, subtitle, two
 * actions and the response surface, then the four-step journey. On a wide
 * screen the copy sits left and the figure right; on a phone the figure comes
 * between the headline and the subtitle (the DOM order is headline, text,
 * figure, so reading order stays natural).
 *
 * The journey steps are the registry's `journey` ids (explore, model, evaluate,
 * decide); they are not the legacy stage ids.
 */
export default function HomeHero() {
  const { t } = useLanguage()

  return (
    <section className="home-band home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__main">
        <header className="home-hero__head">
          <p className="home-eyebrow">
            <span className="home-eyebrow__long">{t('home.hero.eyebrow')}</span>
            <span className="home-eyebrow__short">{t('home.hero.eyebrowShort')}</span>
          </p>
          <h1 id="home-hero-title" className="home-hero__title">
            <span>{t('home.hero.titleLead')}</span>{' '}
            <span>
              {t('home.hero.titleAnd')} <em>{t('home.hero.titleEm')}</em>.
            </span>
          </h1>
        </header>

        <div className="home-hero__body">
          <p className="home-hero__sub">{t('home.hero.subtitle')}</p>
          <div className="home-hero__actions">
            <a className="home-btn" href={PROJECTS_HASH}>
              {t('home.hero.ctaPrimary')} <span aria-hidden="true">→</span>
            </a>
            <a className="home-link" href={ABOUT_HASH}>
              {t('home.hero.ctaSecondary')}
            </a>
          </div>
        </div>

        <HeroFigure />
      </div>

      <ol className="home-journey" aria-label={t('home.journey.aria')}>
        {JOURNEY_STEPS.map((step, index) => (
          <li key={step}>
            <svg className="home-journey__glyph" width="48" height="48" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
              <use href={`/figures/journey-glyphs.svg#${step}`} />
            </svg>
            <div>
              <span className="home-journey__n">{String(index + 1).padStart(2, '0')}</span>
              <strong className="home-journey__title">{t(`home.journey.steps.${step}.title`)}</strong>
              <p className="home-journey__line">{t(`home.journey.steps.${step}.line`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
