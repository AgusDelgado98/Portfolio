import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { FIGURE_META } from '../home/figureMeta.js'

/**
 * ContourMap (F5): estimated effect over two contexts. Geometry is the static
 * SVG; labels are HTML so they follow the page fonts and language. Ready for
 * the principal plate when that project is published — ProjectsSpotlight does
 * not import this while no published project uses the figure.
 */
export default function ContourFigure({ lazy = true }) {
  const { t } = useLanguage()
  const meta = FIGURE_META.contour
  const copy = t('projects.contour')
  const items = [
    { key: 'action', pos: meta.labels.action, text: copy.action, kind: 'action' },
    { key: 'hold', pos: meta.labels.hold, text: copy.hold, kind: 'hold' },
    { key: 'contextA', pos: meta.labels.contextA, text: copy.contextA, kind: 'axis' },
    { key: 'contextB', pos: meta.labels.contextB, text: copy.contextB, kind: 'axis-y' },
  ]
  if (meta.labels.threshold) {
    items.push({ key: 'threshold', pos: meta.labels.threshold, text: copy.threshold, kind: 'threshold' })
  }

  return (
    <figure className="home-pfig proj-contour">
      <div className="home-pfig__box" style={{ aspectRatio: `${meta.W} / ${meta.H}` }}>
        <img
          src="/figures/contour-map.svg"
          width={meta.W}
          height={meta.H}
          alt={copy.alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
        {items.map((item) => (
          <span
            key={item.key}
            className={`proj-contour__label proj-contour__label--${item.kind}`}
            aria-hidden="true"
            style={{
              left: item.pos.side === 'end' ? 'auto' : `${item.pos.x}%`,
              right: item.pos.side === 'end' ? `${100 - item.pos.x}%` : 'auto',
              top: `${item.pos.y}%`,
              textAlign: item.pos.side === 'end' ? 'right' : 'left',
            }}
          >
            {item.text}
          </span>
        ))}
      </div>
      <figcaption className="home-pfig__note">{copy.note}</figcaption>
    </figure>
  )
}
