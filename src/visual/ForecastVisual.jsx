import React from 'react'
import { POLICY_TRADEOFF, REFERENCE_POLICY_ID } from './data/providentia.js'
import { formatNumber, formatPercent } from './format.js'
import { polylinePath, r } from './geometry.js'

/**
 * PROVIDENTIA's card visual (registry `visual: 'forecast'`): the REAL capacity-
 * policy trade-off — mean buffer against exceedance rate for PI80 / PI90 / PI95
 * on the final lockbox — taken from policy_tradeoff.csv (visual/data/providentia.js,
 * cross-checked against the file by a test). PI90, the policy frozen before the
 * lockbox was opened, is the highlighted one.
 *
 * No time series is drawn: the repo holds none to draw.
 */

const PLOT = { x0: 46, x1: 304, y0: 22, y1: 142 }
const BUFFER_RANGE = [90, 180]
const EXCEEDANCE_MAX = 0.12

const xOf = (buffer) =>
  r(PLOT.x0 + ((buffer - BUFFER_RANGE[0]) / (BUFFER_RANGE[1] - BUFFER_RANGE[0])) * (PLOT.x1 - PLOT.x0))
const yOf = (exceedance) => r(PLOT.y1 - (exceedance / EXCEEDANCE_MAX) * (PLOT.y1 - PLOT.y0))

const Y_TICKS = [0.04, 0.08, 0.12]
const X_TICKS = [100, 150]
const GRID_D = Y_TICKS.map((tick) => `M${PLOT.x0} ${yOf(tick)}H${PLOT.x1}`).join('')
const AXES_D = `M${PLOT.x0} ${PLOT.y0}V${PLOT.y1}H${PLOT.x1}`

export default function ForecastVisual({ language, labels }) {
  const points = POLICY_TRADEOFF.map((policy) => ({
    ...policy,
    x: xOf(policy.meanBuffer),
    y: yOf(policy.exceedanceRate),
    text: `${policy.id} · ${formatPercent(policy.exceedanceRate, language)}`,
    isReference: policy.id === REFERENCE_POLICY_ID,
  }))
  const reference = points.find((point) => point.isReference)
  const others = points.filter((point) => !point.isReference)
  const [first, , last] = points

  const description = points
    .map(
      (point) =>
        `${point.id}: ${formatNumber(point.meanBuffer, language)} / ${formatPercent(point.exceedanceRate, language)}`,
    )
    .join('; ')

  return (
    <svg
      className="ds-stage--prediction"
      viewBox="0 0 320 180"
      role="img"
      aria-label={labels.ariaLabel.replace('{points}', description)}
    >
      <path className="v-grid" d={GRID_D} />
      <path className="v-spine" d={AXES_D} />

      {Y_TICKS.map((tick) => (
        <text key={tick} className="v-label" x={PLOT.x0 - 6} y={yOf(tick) + 3} textAnchor="end">
          {formatPercent(tick, language, 0)}
        </text>
      ))}
      {X_TICKS.map((tick) => (
        <text key={tick} className="v-label" x={xOf(tick)} y="156" textAnchor="middle">
          {tick}
        </text>
      ))}
      <text className="v-label" x={PLOT.x0} y="12">
        {labels.axisY} ↑
      </text>
      <text className="v-label" x={PLOT.x1} y="174" textAnchor="end">
        {labels.axisX} →
      </text>

      <path className="v-link v-link--strong" d={polylinePath(points.map((point) => [point.x, point.y]))} />

      {others.map((point) => (
        <path key={point.id} className="v-dot v-dot--lg" d={`M${point.x} ${point.y}h.01`} />
      ))}
      <text className="v-label" x={r(first.x + 10)} y={r(first.y - 4)}>
        {first.text}
      </text>
      <text className="v-label" x={r(last.x)} y={r(last.y + 18)} textAnchor="end">
        {last.text}
      </text>

      <g className="ds-stage--decision">
        <circle className="v-node" cx={reference.x} cy={reference.y} r="6" />
        <circle className="v-node-ring" cx={reference.x} cy={reference.y} r="11" />
        <text className="v-label v-label--strong" x={r(reference.x + 14)} y={r(reference.y - 6)}>
          {reference.text}
        </text>
        <text className="v-label v-label--strong" x={r(reference.x + 14)} y={r(reference.y + 6)}>
          {labels.reference}
        </text>
      </g>
    </svg>
  )
}
