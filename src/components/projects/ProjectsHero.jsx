import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'

/**
 * Projects page hero (F5): dark band with «Tres casos, tres preguntas» and the
 * three framing questions. The questions are editorial (they do not name a
 * project); the plates below only list published ones.
 */
export default function ProjectsHero() {
  const { t } = useLanguage()
  const questions = t('projects.hero.questions')

  return (
    <header className="home-band proj-hero">
      <div className="proj-hero__grid">
        <div className="proj-hero__copy">
          <p className="home-eyebrow">{t('projects.hero.eyebrow')}</p>
          <h1 className="proj-hero__title">
            <span className="proj-hero__title-line">{t('projects.hero.titleLine')}</span>
            <span className="proj-hero__title-line">
              {t('projects.hero.titleBeforeEm')}
              <em>{t('projects.hero.titleEm')}</em>
              {t('projects.hero.titleAfterEm')}
            </span>
          </h1>
        </div>
        <ol className="proj-hero__questions">
          {questions.map((item) => (
            <li key={item.n}>
              <span className="proj-hero__qn">{item.n}</span>
              <span className="proj-hero__q">{item.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </header>
  )
}
