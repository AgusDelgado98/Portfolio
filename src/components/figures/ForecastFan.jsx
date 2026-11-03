import React from 'react'
import { FIGURE_META } from '../home/figureMeta.js'

/**
 * ForecastFan (F6): conceptual forecast fan. Geometry is the static SVG;
 * labels and the conceptual note are HTML and mandatory — the figure never
 * ships without its legend (EG4 / EG13).
 */
export default function ForecastFan({ copy, lazy = true }) {
  const meta = FIGURE_META.fan
  if (!copy?.note || !copy?.alt || !copy?.observed || !copy?.forecast) return null
  const labels = [
    {
      key: 'observed',
      text: copy.observed,
      style: {
        right: `${(1 - meta.split) * 100 + 1.5}%`,
        top: `${meta.top * 100}%`,
        transform: 'translateY(-50%)',
        textAlign: 'right',
      },
    },
    {
      key: 'forecast',
      text: copy.forecast,
      style: {
        left: `${meta.split * 100 + 1.5}%`,
        top: `${meta.top * 100}%`,
        transform: 'translateY(-50%)',
      },
    },
  ]

  return (
    <figure className="home-pfig">
      <div className="home-pfig__box" style={{ aspectRatio: `${meta.W} / ${meta.H}` }}>
        <img
          src="/figures/forecast-fan.svg"
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
