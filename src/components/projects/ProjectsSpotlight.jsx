import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { projectHash } from '../../router/hashes.js'
import { getComplementaryProjectIds, getProjectEntry, getSpotlightProjectIds } from '../../projects/registry.js'
import { FIGURE_META } from '../home/figureMeta.js'

/**
 * Spotlight on the Projects page (F5). Same presentation order as Home: the
 * first published spotlight project takes the principal plate, the rest are
 * editorial rows, complementary work closes as one line. Figures are static
 * SVG assets; ContourMap (`contour-map.svg`) is generated and labelled in
 * figureMeta for the principal plate when that project is published — today
 * no published project uses it, so it does not appear in the UI.
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

export default function ProjectsSpotlight() {
  const { t } = useLanguage()
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
              <h2 className="home-ptitle">{title}</h2>
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
              <h2 className="home-ptitle">{title}</h2>
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
