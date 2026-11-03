import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { projectHash } from '../../router/hashes.js'
import { getComplementaryProjectIds, getProjectEntry, getSpotlightProjectIds } from '../../projects/registry.js'
import { hasSpotlightFigure, SpotlightFigure } from '../figures/spotlightFigures.jsx'
import { spotlightFacts } from '../figures/spotlightFacts.js'

/**
 * Spotlight on the Projects page (F5/F6). Published projects only: first takes
 * the principal plate, the rest are editorial rows, complementary work closes
 * as one line. ForecastFan / QualityMosaic are shared figure components with a
 * mandatory conceptual legend; verifiable facts sit beside them and come from
 * frozen evidence where numbers are shown (EG4 / EG5).
 */
function Meta({ copy, facts, t }) {
  return (
    <>
      {facts.length ? (
        <dl className="home-data proj-facts">
          {facts.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <ul className="home-tags">
        {copy.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <p className="home-data">
        <span>{t('home.selected.dataLabel')}</span> · {copy.data}
      </p>
    </>
  )
}

export default function ProjectsSpotlight() {
  const { t, language } = useLanguage()
  const copyOf = (id) => {
    const copy = t(`home.selected.projects.${id}`)
    return copy && typeof copy === 'object' ? copy : null
  }
  const main = getSpotlightProjectIds().filter(copyOf)
  const complementary = getComplementaryProjectIds().filter(copyOf)
  if (main.length === 0 && complementary.length === 0) return null

  return (
    <section className="proj-spotlight" aria-label={t('home.selected.aria')}>
      {main.map((id, index) => {
        const copy = copyOf(id)
        const title = getProjectEntry(id)?.title
        const number = String(index + 1).padStart(2, '0')
        const facts = spotlightFacts(id, copy, language)
        const cta = (
          <a className="home-open" href={projectHash(id)}>
            <span className="home-open__text">
              {t('home.selected.cta')} <span aria-hidden="true">→</span>
            </span>
            <span className="ds-visually-hidden">: {title}</span>
          </a>
        )
        return index === 0 ? (
          <article className="home-plate" key={id}>
            <SpotlightFigure id={id} copy={copy} />
            <div className="home-plate__body">
              <p className="home-eyebrow">
                {number} · {copy.question}
              </p>
              <h2 className="home-ptitle">{title}</h2>
              <p className="home-plate__line">{copy.line}</p>
              <Meta copy={copy} facts={facts} t={t} />
              {cta}
            </div>
          </article>
        ) : (
          <article className={`home-row${hasSpotlightFigure(id) ? '' : ' home-row--plain'}`} key={id}>
            <span className="home-row__n">{number}</span>
            <div className="home-row__body">
              <p className="home-eyebrow home-eyebrow--ink">{copy.question}</p>
              <h2 className="home-ptitle">{title}</h2>
              <p className="home-row__line">{copy.line}</p>
              <Meta copy={copy} facts={facts} t={t} />
            </div>
            <SpotlightFigure id={id} copy={copy} />
            {cta}
          </article>
        )
      })}

      {complementary.map((id) => {
        const copy = copyOf(id)
        const title = getProjectEntry(id)?.title
        return (
          <article className="home-aside" key={id}>
            <p className="home-eyebrow home-eyebrow--ink">{t('home.selected.complementary')}</p>
            <div className="home-aside__line">
              <h2 className="home-aside__title">{title}</h2>
              <p>
                {copy.line} · <span className="home-aside__use">{t('home.selected.professionalUse')}</span> · {copy.note}
              </p>
              <a className="home-link home-link--paper" href={projectHash(id)}>
                {t('home.selected.cta')} <span aria-hidden="true">→</span>
                <span className="ds-visually-hidden">: {title}</span>
              </a>
            </div>
          </article>
        )
      })}
    </section>
  )
}
