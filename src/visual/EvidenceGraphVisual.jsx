import React from 'react'
import { ALETHEIA_COUNTS, ALETHEIA_COMPATIBILITY } from './data/aletheia.js'
import { dotGrid, dotsPath } from './geometry.js'
import usePartFocus from './usePartFocus.js'

/**
 * ALETHEIA's card visual (registry `visual: 'evidence-network'`): the registry
 * counts of the research — 22 sources → 16 statistical objects → 8 documented
 * methodological breaks (visual/data/aletheia.js). It draws quantities and
 * their order only; it does not claim which source maps to which object, nor
 * which break touches which object: the data does not say, so no such links
 * are drawn. The card's caption says it is a conceptual diagram.
 *
 * `interactive` (Project Detail): each stage is a keyboard-focusable button;
 * the active one stays lit and the readout states its real count. The 8
 * explicit compatibility relationships between objects are reported with their
 * recorded statuses (visual/data/aletheia.js), as numbers, not as drawn pairs.
 */

const SOURCES = dotGrid({ cols: 2, rows: 11, x0: 30, y0: 34, dx: 14, dy: 12, spread: 0 })
const SOURCES_D = dotsPath(SOURCES.slice(0, ALETHEIA_COUNTS.sources))

const objectsD = Array.from({ length: ALETHEIA_COUNTS.statisticalObjects }, (_, index) => {
  const x = 134 + (index % 2) * 14
  const y = 34 + Math.floor(index / 2) * 17
  return `M${x} ${y}h6v6h-6z`
}).join('')

const breaksD = Array.from({ length: ALETHEIA_COUNTS.breaks }, (_, index) => {
  const y = 38 + index * 17
  return `M258 ${y - 5}l5 5l-5 5l-5-5z`
}).join('')

const TO_OBJECTS_D = 'M62 94H118M114 90L118 94L114 98'
const TO_BREAKS_D = 'M162 94H236M232 90L236 94L232 98'

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''))

export default function EvidenceGraphVisual({ labels, interactive = false }) {
  const { active, bind } = usePartFocus()
  const readouts = labels.readout || {}
  const text = (id) => {
    if (id === 'sources') return fill(readouts.sources || '{n}', { n: ALETHEIA_COUNTS.sources })
    if (id === 'objects') {
      const objects = fill(readouts.objects || '{n}', { n: ALETHEIA_COUNTS.statisticalObjects })
      const compat = fill(readouts.compat || '', {
        n: ALETHEIA_COMPATIBILITY.relationships,
        forbidden: ALETHEIA_COMPATIBILITY.forbidden,
        conditional: ALETHEIA_COMPATIBILITY.conditional,
        descriptive: ALETHEIA_COMPATIBILITY.descriptive,
      })
      return compat ? `${objects} · ${compat}` : objects
    }
    return fill(readouts.breaks || '{n}', { n: ALETHEIA_COUNTS.breaks })
  }
  const partProps = (id) => (interactive ? bind(id, text(id), `v-stage v-stage--${id}`) : { className: `v-stage v-stage--${id}` })
  const hit = (x, width) => (interactive ? <rect className="v-hit" x={x} y="4" width={width} height="172" /> : null)

  const picture = (
    <svg
      className={`ds-stage--evidence v-evidence${interactive ? ' v-live' : ''}${interactive && active ? ' has-active' : ''}`}
      viewBox="0 0 320 180"
      role={interactive ? 'group' : 'img'}
      aria-label={labels.caption}
    >
      <g {...partProps('sources')}>
        {hit(14, 76)}
        <path className="v-dot" d={SOURCES_D} />
        <text className="v-count" x="44" y="20" textAnchor="middle">
          {ALETHEIA_COUNTS.sources}
        </text>
        <text className="v-label" x="44" y="172" textAnchor="middle">
          {labels.sources}
        </text>
      </g>

      <g {...partProps('objects')}>
        {hit(100, 96)}
        <path className="v-link v-link--strong" d={TO_OBJECTS_D} />
        <path className="v-sq v-sq--2" d={objectsD} />
        <text className="v-count" x="148" y="20" textAnchor="middle">
          {ALETHEIA_COUNTS.statisticalObjects}
        </text>
        <text className="v-label" x="148" y="172" textAnchor="middle">
          {labels.objects}
        </text>
      </g>

      <g {...partProps('breaks')}>
        {hit(206, 88)}
        <path className="v-link v-link--strong" d={TO_BREAKS_D} />
        <path className="v-sq v-sq--4" d={breaksD} />
        <text className="v-count" x="258" y="20" textAnchor="middle">
          {ALETHEIA_COUNTS.breaks}
        </text>
        <text className="v-label" x="258" y="172" textAnchor="middle">
          {labels.breaks}
        </text>
      </g>
    </svg>
  )

  if (!interactive) return picture

  return (
    <div className="ds-visual-live">
      {picture}
      <p className="ds-visual-readout" aria-live="polite">
        {active ? text(active) : labels.hint}
      </p>
    </div>
  )
}
