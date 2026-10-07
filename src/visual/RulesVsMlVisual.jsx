import React from 'react'
import { TEKMERION_MACRO_F1 } from './data/tekmerion.js'
import { formatNumber } from './format.js'

/**
 * Tekmérion's card visual (registry `visual: 'rules-vs-ml'`).
 * Bar heights are the published Macro F1 figures, on a 0–1 scale.
 */

const BASELINE = 148
const SCALE = 120

function barHeight(value) {
  return Math.round(value * SCALE)
}

export default function RulesVsMlVisual({ language, labels }) {
  const rulesH = barHeight(TEKMERION_MACRO_F1.rules)
  const svmH = barHeight(TEKMERION_MACRO_F1.linearSvm)
  return (
    <svg className="ds-stage--evidence" viewBox="0 0 320 180" role="img" aria-label={labels.caption}>
      <path className="v-grid" d={`M40 ${BASELINE}H290`} />
      <rect className="v-sq v-sq--2" x="78" y={BASELINE - rulesH} width="48" height={rulesH} rx="2" />
      <rect className="v-sq v-sq--4" x="194" y={BASELINE - svmH} width="48" height={svmH} rx="2" />
      <text className="v-count" x="102" y={BASELINE - rulesH - 8} textAnchor="middle">
        {formatNumber(TEKMERION_MACRO_F1.rules, language, 3)}
      </text>
      <text className="v-count" x="218" y={BASELINE - svmH - 8} textAnchor="middle">
        {formatNumber(TEKMERION_MACRO_F1.linearSvm, language, 3)}
      </text>
      <text className="v-label" x="102" y="168" textAnchor="middle">
        {labels.rules}
      </text>
      <text className="v-label" x="218" y="168" textAnchor="middle">
        {labels.svm}
      </text>
    </svg>
  )
}
