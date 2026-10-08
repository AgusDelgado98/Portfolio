import React from 'react'
import usePartFocus from './usePartFocus.js'

/**
 * Paradigm's card visual (registry `visual: 'risk-threshold'`).
 *
 * A schematic of the three ideas the project is about — a score, a threshold,
 * a decision — with no new number on it. The published metrics stay in the
 * case studies; this picture does not restate or replace them.
 *
 * `interactive` (Project Detail): probability → threshold → decision, each a
 * keyboard-focusable button with a one-line, number-free readout. On catalog
 * cards CSS draws the three in that order while the card is hovered.
 */
const PARTS = ['score', 'threshold', 'decision']

export default function RiskThresholdVisual({ labels, interactive = false }) {
  const { active, bind } = usePartFocus()
  const partProps = (id) => (interactive ? bind(id, labels[id], `v-risk-part v-risk-part--${id}`) : { className: `v-risk-part v-risk-part--${id}` })
  const hit = (x, width) => (interactive ? <rect className="v-hit" x={x} y="20" width={width} height="152" /> : null)

  const picture = (
    <svg
      className={`ds-stage--prediction v-risk${interactive ? ' v-live' : ''}${interactive && active ? ' has-active' : ''}`}
      viewBox="0 0 320 180"
      role={interactive ? 'group' : 'img'}
      aria-label={labels.caption}
    >
      <path className="v-grid" d="M36 28V150H292" />

      <g {...partProps('score')}>
        {hit(36, 120)}
        <path className="v-link v-link--strong v-curve" d="M44 132C78 128 96 96 128 78C160 60 168 86 196 64C224 42 248 36 286 28" pathLength="100" />
        <text className="v-label" x="44" y="168">
          {labels.score}
        </text>
      </g>

      <g {...partProps('threshold')}>
        {hit(156, 64)}
        <path className="v-spine v-cut" d="M188 32V150" />
        <text className="v-label" x="188" y="168" textAnchor="middle">
          {labels.threshold}
        </text>
      </g>

      <g {...partProps('decision')}>
        {hit(220, 76)}
        <path className="v-dot v-dot--lg v-mark" d="M228 48h.01" />
        <text className="v-label" x="286" y="168" textAnchor="end">
          {labels.decision}
        </text>
      </g>
    </svg>
  )

  if (!interactive) return picture

  const readouts = labels.readout || {}
  return (
    <div className="ds-visual-live">
      {picture}
      <p className="ds-visual-readout" aria-live="polite">
        {active ? readouts[active] || labels[active] : labels.hint}
      </p>
    </div>
  )
}

export { PARTS }
