import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { getSpotlightProjectIds } from '../../projects/registry.js'

/**
 * Projects page hero (F5/F6): dark band with an adaptive «N casos, N preguntas»
 * title and one question per published spotlight project. When a withheld
 * spotlight project is published later, the count and the list grow without
 * changing the layout concept (spotlight order from the registry).
 */
export default function ProjectsHero() {
  const { t } = useLanguage()
  const copyOf = (id) => {
    const copy = t(`home.selected.projects.${id}`)
    return copy && typeof copy === 'object' ? copy : null
  }
  const published = getSpotlightProjectIds().filter(copyOf)
  const count = String(Math.min(Math.max(published.length, 2), 3))
  const title = t(`projects.hero.titleByCount.${count}`)
  const questions = published.map((id, index) => ({
    n: String(index + 1).padStart(2, '0'),
    text: copyOf(id).question,
  }))

  return (
    <header className="home-band proj-hero">
      <div className="proj-hero__grid">
        <div className="proj-hero__copy">
          <p className="home-eyebrow">{t('projects.hero.eyebrow')}</p>
          <h1 className="proj-hero__title">
            <span className="proj-hero__title-line">{title.titleLine}</span>
            <span className="proj-hero__title-line">
              {title.titleBeforeEm}
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
