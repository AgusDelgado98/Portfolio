import React from 'react'
import { CAELUM_LAYERS } from './data/caelum.js'
import usePartFocus from './usePartFocus.js'

/**
 * Caelum's card visual (registry `visual: 'pipeline'`): the REAL layer counts of
 * its dbt/DuckDB model — 8 staging → 5 dimensions → 3 facts → 2 marts → Power BI
 * (visual/data/caelum.js). An architecture diagram, not a measurement: block
 * counts are the data, every other dimension is schematic, and the card's
 * caption says so. Blocks get progressively more filled — the layers are
 * progressively more curated.
 *
 * `interactive` (Project Detail): each layer is a keyboard-focusable button;
 * the active layer and the connection that feeds it light up and the rest dim.
 * Hovering the empty drawing, or a catalog card, plays one pass of a signal
 * staging → dimensions → facts → marts → Power BI (CSS, no loop).
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

// The connection that feeds each layer, in flow order (hub → staging … marts → BI).
const ARROW_INTO = {
  staging: [30, 48],
  dimensions: [80, 102],
  facts: [120, 148],
  marts: [172, 194],
  bi: [226, 246],
}
const arrowD = ([from, to]) => `M${from} 90H${to}M${to - 4} 87L${to} 90L${to - 4} 93`

// Hit areas partition the flow axis: each layer owns the stretch from its feeding arrow to the next one.
const HIT_X = { staging: [28, 78], dimensions: [78, 118], facts: [118, 170], marts: [170, 224], bi: [224, 290] }

const BI_BARS = [20, 34, 48]
const SIGNAL_D = 'M30 90H274'
const FALLBACK_NAMES = { staging: 'staging', dimensions: 'dimensions', facts: 'facts', marts: 'marts', bi: 'Power BI' }

export default function LayersVisual({ labels, interactive = false }) {
  const { active, bind } = usePartFocus()
  const names = { ...FALLBACK_NAMES, ...(labels.layers || {}) }
  const counts = Object.fromEntries(CAELUM_LAYERS.map((layer) => [layer.id, layer.count]))
  const partProps = (id) => (interactive ? bind(id, id === 'bi' ? names.bi : `${counts[id]} ${names[id]}`, `v-layer v-layer--${id}`) : { className: `v-layer v-layer--${id}` })
  const hit = (id) =>
    interactive ? <rect className="v-hit" x={HIT_X[id][0]} y={34} width={HIT_X[id][1] - HIT_X[id][0]} height={112} /> : null

  const picture = (
    <svg
      className={`ds-stage--data v-layers${interactive ? ' v-live' : ''}${interactive && active ? ' has-active' : ''}`}
      viewBox="0 0 320 180"
      role={interactive ? 'group' : 'img'}
      aria-label={labels.caption}
    >
      <rect className="v-hub" x="14" y="50" width="12" height="80" rx="2" />
      <path className="v-link" d="M14 70h12M14 90h12M14 110h12" />

      {CAELUM_LAYERS.map((layer, layerIndex) => (
        <g key={layer.id} {...partProps(layer.id)}>
          {hit(layer.id)}
          <path className="v-link v-link--strong v-feed" d={arrowD(ARROW_INTO[layer.id])} />
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

      <g {...partProps('bi')}>
        {hit('bi')}
        <path className="v-link v-link--strong v-feed" d={arrowD(ARROW_INTO.bi)} />
        {BI_BARS.map((height, index) => (
          <rect key={height} className="v-sq v-sq--bi" x={250 + index * 15} y={126 - height} width="10" height={height} rx="1.5" />
        ))}
      </g>

      <path className="v-signal" d={SIGNAL_D} pathLength="100" aria-hidden="true" />
    </svg>
  )

  if (!interactive) return picture

  const readout = active ? (active === 'bi' ? names.bi : `${counts[active]} ${names[active]}`) : labels.hint
  return (
    <div className="ds-visual-live">
      {picture}
      <p className="ds-visual-readout" aria-live="polite">
        {readout}
      </p>
    </div>
  )
}
