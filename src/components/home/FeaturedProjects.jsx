import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { PROJECTS_HASH, projectHash } from '../../router/hashes.js'
import { getComplementaryProjectIds, getProjectEntry, getSpotlightProjectIds } from '../../projects/registry.js'
import { FIGURE_META } from './figureMeta.js'

/**
 * Selected projects (F4). The list is the registry's published spotlight
 * projects, in order; the first takes the principal slot (a dark plate), the
 * rest are editorial rows, and the complementary project closes as one line.
 * Which slot a project gets depends on its position, not on its name, so a
 * project that becomes public later takes its place without touching the layout,
 * and a withheld one leaves no gap.
 *
 * A project shows up here only if it has copy in `home.selected.projects`.
 * Figures are static SVG assets keyed by project id; a project without one
 * simply has no figure column.
 */
const FIGURES = {
  providentia: {
    src: '/figures/forecast-fan.svg',
    meta: FIGURE_META.fan,
    labels: (meta, f) => [
      { key: 'observed', text: f.observed, style: { right: `${(1 - meta.split) * 100 + 1.5}%`, top: `${meta.top * 100}%`, transform: 'translateY(-50%)', textAlign: 'right' } },
      { key: 'forecast', text: f.forecast, style: { left: `${meta.split * 100 + 1.5}%`, top: `${meta.top * 100}%`, transform: 'translateY(-50%)' } },
    ],
  },
  paradigm: {
    src: '/figures/quality-mosaic.svg',
    meta: FIGURE_META.mosaic,
    labels: (meta, f) =>
      ['raw', 'clean', 'reliable'].map((key, i) => ({
        key,
        text: f[key],
        style: { left: `${meta.cols[i] * 100}%`, top: `${meta.bottom * 100}%`, transform: 'translateY(-100%)' },
      })),
  },
}

function Figure({ id, copy }) {
  const figure = FIGURES[id]
  if (!figure) return null
  const labels = figure.labels(figure.meta, copy.figure)
  return (
    <figure className="home-pfig">
      <div className="home-pfig__box" style={{ aspectRatio: `${figure.meta.W} / ${figure.meta.H}` }}>
        <img src={figure.src} width={figure.meta.W} height={figure.meta.H} alt={copy.figure.alt} loading="lazy" decoding="async" />
        {labels.map((label) => (
          <span key={label.key} className="home-pfig__label" aria-hidden="true" style={label.style}>
            {label.text}
          </span>
        ))}
      </div>
      <figcaption className="home-pfig__note">{copy.figure.note}</figcaption>
    </figure>
  )
}

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
  const count = String(main.length).padStart(2, '0')

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
            <Figure id={id} copy={copy} />
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
          <article className={`home-row${FIGURES[id] ? '' : ' home-row--plain'}`} key={id}>
            <span className="home-row__n">{number}</span>
            <div className="home-row__body">
              <p className="home-eyebrow home-eyebrow--ink">{copy.question}</p>
              <h3 className="home-ptitle">{title}</h3>
              <p className="home-row__line">{copy.line}</p>
              <Meta copy={copy} t={t} />
            </div>
            <Figure id={id} copy={copy} />
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

      <a className="home-link home-link--paper home-selected__all" href={PROJECTS_HASH}>
        {t('home.selected.viewAll')} <span aria-hidden="true">→</span>
      </a>
    </section>
  )
}
