import React from 'react'
import { proceduralSeries } from './procedural.js'

/**
 * One reusable picture for projects that have no data-linked diagram.
 * Products draw an operational flow; analytics draws a dot field; DS/ML draws
 * bars. The shape is fixed by category, the proportions by `id`.
 */
export default function ProceduralVisual({ id, category, labels }) {
  const series = proceduralSeries(id, category === 'products' ? 4 : 7)
  const stageClass =
    category === 'ds-ml' ? 'ds-stage--prediction' : category === 'analytics-bi' ? 'ds-stage--data' : 'ds-stage--product'

  let body = null
  if (category === 'products') {
    body = series.map((height, index) => {
      const x = 36 + index * 72
      const y = 108 - Math.round(height * 0.55)
      return (
        <g key={x}>
          {index < series.length - 1 ? <path className="v-link" d={`M${x + 36} 78H${x + 64}`} /> : null}
          <rect className="v-sq" x={x} y={y} width="36" height={28 + Math.round(height * 0.35)} rx="3" />
        </g>
      )
    })
  } else if (category === 'analytics-bi') {
    body = series.map((height, index) => {
      const x = 40 + (index % 4) * 68 + (height % 9)
      const y = 36 + Math.floor(index / 4) * 52 + (height % 11)
      return <path key={index} className="v-dot v-dot--lg" d={`M${x} ${y}h.01`} />
    })
  } else {
    body = series.map((height, index) => {
      const h = 28 + Math.round(height * 0.9)
      const x = 36 + index * 40
      return <rect key={x} className="v-sq" x={x} y={148 - h} width="22" height={h} rx="2" />
    })
  }

  return (
    <svg className={stageClass} viewBox="0 0 320 180" role="img" aria-label={labels.caption}>
      <path className="v-grid" d="M28 148H292" />
      {body}
    </svg>
  )
}
