import React from 'react'
import { ALETHEIA_COUNTS } from './data/aletheia.js'
import { dotGrid, dotsPath } from './geometry.js'

/**
 * ALETHEIA's card visual (registry `visual: 'evidence-network'`): the registry
 * counts of the research — 22 sources → 16 statistical objects → 8 documented
 * methodological breaks (visual/data/aletheia.js). It draws quantities and
 * their order only; it does not claim which source maps to which object. The
 * card's caption says it is a conceptual diagram.
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

const FUNNEL_D = 'M62 94H118M114 90L118 94L114 98M162 94H236M232 90L236 94L232 98'

export default function EvidenceGraphVisual({ labels }) {
  return (
    <svg className="ds-stage--evidence" viewBox="0 0 320 180" role="img" aria-label={labels.caption}>
      <path className="v-dot" d={SOURCES_D} />
      <path className="v-sq v-sq--2" d={objectsD} />
      <path className="v-sq v-sq--4" d={breaksD} />
      <path className="v-link v-link--strong" d={FUNNEL_D} />

      <text className="v-count" x="44" y="20" textAnchor="middle">
        {ALETHEIA_COUNTS.sources}
      </text>
      <text className="v-count" x="148" y="20" textAnchor="middle">
        {ALETHEIA_COUNTS.statisticalObjects}
      </text>
      <text className="v-count" x="258" y="20" textAnchor="middle">
        {ALETHEIA_COUNTS.breaks}
      </text>

      <text className="v-label" x="44" y="172" textAnchor="middle">
        {labels.sources}
      </text>
      <text className="v-label" x="148" y="172" textAnchor="middle">
        {labels.objects}
      </text>
      <text className="v-label" x="258" y="172" textAnchor="middle">
        {labels.breaks}
      </text>
    </svg>
  )
}
