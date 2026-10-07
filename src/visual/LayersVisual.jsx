import React from 'react'
import { CAELUM_LAYERS } from './data/caelum.js'

/**
 * Caelum's card visual (registry `visual: 'pipeline'`): the REAL layer counts of
 * its dbt/DuckDB model — 8 staging → 5 dimensions → 3 facts → 2 marts → Power BI
 * (visual/data/caelum.js). An architecture diagram, not a measurement: block
 * counts are the data, every other dimension is schematic, and the card's
 * caption says so. Blocks get progressively more filled — the layers are
 * progressively more curated.
 */

const SQUARE = { staging: 10, dimensions: 10, facts: 16, marts: 24 }
const COLUMN_X = { staging: 52, dimensions: 106, facts: 152, marts: 198 }
const COUNT_X = { staging: 66, dimensions: 111, facts: 160, marts: 210 }
const GAP = { staging: 4, dimensions: 4, facts: 8, marts: 10 }

function blocks(id, count) {
  const size = SQUARE[id]
  const gap = GAP[id]
  const columns = id === 'staging' ? 2 : 1
  const rows = Math.ceil(count / columns)
  const height = rows * size + (rows - 1) * gap
  const top = 90 - height / 2
  return Array.from({ length: count }, (_, index) => ({
    x: COLUMN_X[id] + (index % columns) * (size + gap),
    y: top + Math.floor(index / columns) * (size + gap),
    size,
  }))
}

const ARROWS_D = [
  [30, 48],
  [80, 102],
  [120, 148],
  [172, 194],
  [226, 246],
]
  .map(([from, to]) => `M${from} 90H${to}M${to - 4} 87L${to} 90L${to - 4} 93`)
  .join('')

const BI_BARS = [20, 34, 48]

export default function LayersVisual({ labels }) {
  return (
    <svg className="ds-stage--data" viewBox="0 0 320 180" role="img" aria-label={labels.caption}>
      <rect className="v-hub" x="14" y="50" width="12" height="80" rx="2" />
      <path className="v-link" d="M14 70h12M14 90h12M14 110h12" />
      <path className="v-link v-link--strong" d={ARROWS_D} />

      {CAELUM_LAYERS.map((layer, layerIndex) => (
        <g key={layer.id}>
          {blocks(layer.id, layer.count).map((block, index) => (
            <rect
              key={index}
              className={`v-sq v-sq--${layerIndex + 1}`}
              x={block.x}
              y={block.y}
              width={block.size}
              height={block.size}
              rx="1.5"
            />
          ))}
          <text className="v-count" x={COUNT_X[layer.id]} y="42" textAnchor="middle">
            {layer.count}
          </text>
        </g>
      ))}

      {BI_BARS.map((height, index) => (
        <rect key={height} className="v-sq v-sq--bi" x={250 + index * 15} y={126 - height} width="10" height={height} rx="1.5" />
      ))}
    </svg>
  )
}
