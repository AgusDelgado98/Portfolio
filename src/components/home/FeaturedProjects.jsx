import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { PROJECTS_HASH, projectHash } from '../../router/hashes.js'
import { getComplementaryProjectIds, getProjectEntry, getSpotlightProjectIds } from '../../projects/registry.js'
import { hasSpotlightFigure, SpotlightFigure } from '../figures/spotlightFigures.jsx'

/**
 * Selected projects (F4/F6). Applications in use come first (CONSTANTIA, SOMA,
 * HOGARES), under a single heading; the published spotlight projects follow,
 * the first as the principal plate and the rest as editorial rows. A withheld
 * project leaves no gap. Existing classes only.
 *
 * A project shows up here only if it has copy in `home.selected.projects`.
 * Figures are the shared ForecastFan / QualityMosaic components (F6).
 */

function Meta({ copy, t }) {
  return (
    <>
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

export default function FeaturedProjects() {
  const { t } = useLanguage()
  const copyOf = (id) => {
    const copy = t(`home.selected.projects.${id}`)
    return copy && typeof copy === 'object' ? copy : null
  }
  const main = getSpotlightProjectIds().filter(copyOf)
  const complementary = getComplementaryProjectIds().filter(copyOf)
  if (main.length === 0 && complementary.length === 0) return null
  const count = String(complementary.length + main.length).padStart(2, '0')

  return (
    <section className="home-selected" aria-labelledby="home-selected-title">
      <div className="home-selected__head">
        <h2 id="home-selected-title" className="home-label">
          {t('home.selected.label')}
        </h2>
        <span className="home-selected__rule" aria-hidden="true" />
        <span className="home-label" aria-hidden="true">
          01 — {count}
        </span>
      </div>

      {complementary.length > 0 ? (
        <div className="proj-other__head">
          <h3 className="home-label home-label--ink">{t('home.selected.complementary')}</h3>
          <span className="proj-other__rule" aria-hidden="true" />
        </div>
      ) : null}

      {complementary.map((id) => {
        const copy = copyOf(id)
        const title = getProjectEntry(id)?.title
        return (
          <article className="home-aside" key={id}>
            <div className="home-aside__line">
              <h3 className="home-aside__title">{title}</h3>
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

      {main.map((id, index) => {
        const copy = copyOf(id)
        const title = getProjectEntry(id)?.title
        const number = String(index + 1).padStart(2, '0')
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
              <h3 className="home-ptitle">{title}</h3>
              <p className="home-plate__line">{copy.line}</p>
              <Meta copy={copy} t={t} />
              {cta}
            </div>
          </article>
        ) : (
          <article className={`home-row${hasSpotlightFigure(id) ? '' : ' home-row--plain'}`} key={id}>
            <span className="home-row__n">{number}</span>
            <div className="home-row__body">
              <p className="home-eyebrow home-eyebrow--ink">{copy.question}</p>
              <h3 className="home-ptitle">{title}</h3>
              <p className="home-row__line">{copy.line}</p>
              <Meta copy={copy} t={t} />
            </div>
            <SpotlightFigure id={id} copy={copy} />
            {cta}
          </article>
        )
      })}

      <a className="home-link home-link--paper home-selected__all" href={PROJECTS_HASH}>
        {t('home.selected.viewAll')} <span aria-hidden="true">→</span>
      </a>
    </section>
  )
}
