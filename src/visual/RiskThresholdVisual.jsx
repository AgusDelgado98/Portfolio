import React from 'react'

/**
 * Paradigm's card visual (registry `visual: 'risk-threshold'`).
 *
 * A schematic of the three ideas the project is about — a score, a threshold,
 * a decision — with no new number on it. The published metrics stay in the
 * case studies; this picture does not restate or replace them.
 */
export default function RiskThresholdVisual({ labels }) {
  return (
    <svg className="ds-stage--prediction" viewBox="0 0 320 180" role="img" aria-label={labels.caption}>
      <path className="v-grid" d="M36 28V150H292" />
      <path className="v-link v-link--strong" d="M44 132C78 128 96 96 128 78C160 60 168 86 196 64C224 42 248 36 286 28" />
      <path className="v-spine" d="M188 32V150" />
      <path className="v-dot v-dot--lg" d="M228 48h.01" />
      <text className="v-label" x="44" y="168">
        {labels.score}
      </text>
      <text className="v-label" x="188" y="168" textAnchor="middle">
        {labels.threshold}
      </text>
      <text className="v-label" x="286" y="168" textAnchor="end">
        {labels.decision}
      </text>
    </svg>
  )
}
