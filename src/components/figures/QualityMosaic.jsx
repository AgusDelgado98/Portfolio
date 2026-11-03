import React from 'react'
import { FIGURE_META } from '../home/figureMeta.js'

/**
 * QualityMosaic (F6): conceptual data-quality mosaic. Geometry is the static
 * SVG; stage labels and the conceptual note are HTML and mandatory (EG5 / EG13).
 */
export default function QualityMosaic({ copy, lazy = true }) {
  const meta = FIGURE_META.mosaic
  if (!copy?.note || !copy?.alt || !copy?.raw || !copy?.clean || !copy?.reliable) return null
  const labels = ['raw', 'clean', 'reliable'].map((key, i) => ({
    key,
    text: copy[key],
    style: {
      left: `${meta.cols[i] * 100}%`,
      top: `${meta.bottom * 100}%`,
      transform: 'translateY(-100%)',
    },
  }))

  return (
    <figure className="home-pfig">
      <div className="home-pfig__box" style={{ aspectRatio: `${meta.W} / ${meta.H}` }}>
        <img
          src="/figures/quality-mosaic.svg"
          width={meta.W}
          height={meta.H}
          alt={copy.alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
        {labels.map((label) => (
          <span key={label.key} className="home-pfig__label" aria-hidden="true" style={label.style}>
            {label.text}
          </span>
        ))}
      </div>
      <figcaption className="home-pfig__note">{copy.note}</figcaption>
    </figure>
  )
}
