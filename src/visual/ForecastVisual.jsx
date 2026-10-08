import React from 'react'
import { POLICY_TRADEOFF, REFERENCE_POLICY_ID } from './data/providentia.js'
import { formatNumber, formatPercent } from './format.js'
import { polylinePath, r } from './geometry.js'
import usePartFocus from './usePartFocus.js'

/**
 * PROVIDENTIA's card visual (registry `visual: 'forecast'`): the REAL capacity-
 * policy trade-off — mean buffer against exceedance rate for PI80 / PI90 / PI95
 * on the final lockbox — taken from policy_tradeoff.csv (visual/data/providentia.js,
 * cross-checked against the file by a test). PI90, the policy frozen before the
 * lockbox was opened, is the highlighted one.
 *
 * No time series is drawn: the repo holds none to draw.
 *
 * `interactive` (Project Detail): the pointer scrubs along the plot and picks
 * the nearest policy; each point is also a keyboard-focusable button. The
 * chosen point shows its guides to both axes and the readout below states its
 * published numbers. The reference ring and label never dim: PI90 stays the
 * reference whatever is selected. Without `interactive` the drawing is static;
 * on the catalog cards CSS sweeps PI80 → PI90 → PI95 while the card is hovered.
 */

const PLOT = { x0: 46, x1: 304, y0: 22, y1: 142 }
const BUFFER_RANGE = [90, 180]
const EXCEEDANCE_MAX = 0.12
const VIEW_WIDTH = 320

const xOf = (buffer) =>
  r(PLOT.x0 + ((buffer - BUFFER_RANGE[0]) / (BUFFER_RANGE[1] - BUFFER_RANGE[0])) * (PLOT.x1 - PLOT.x0))
const yOf = (exceedance) => r(PLOT.y1 - (exceedance / EXCEEDANCE_MAX) * (PLOT.y1 - PLOT.y0))

const Y_TICKS = [0.04, 0.08, 0.12]
const X_TICKS = [100, 150]
const GRID_D = Y_TICKS.map((tick) => `M${PLOT.x0} ${yOf(tick)}H${PLOT.x1}`).join('')
const AXES_D = `M${PLOT.x0} ${PLOT.y0}V${PLOT.y1}H${PLOT.x1}`

export default function ForecastVisual({ language, labels, interactive = false }) {
  const { active, bind, setHovered } = usePartFocus()
  const points = POLICY_TRADEOFF.map((policy) => ({
    ...policy,
    x: xOf(policy.meanBuffer),
    y: yOf(policy.exceedanceRate),
    text: `${policy.id} · ${formatPercent(policy.exceedanceRate, language)}`,
    isReference: policy.id === REFERENCE_POLICY_ID,
  }))
  const reference = points.find((point) => point.isReference)
  const [first, , last] = points

  const description = points
    .map(
      (point) =>
        `${point.id}: ${formatNumber(point.meanBuffer, language)} / ${formatPercent(point.exceedanceRate, language)}`,
    )
    .join('; ')
  const ariaLabel = labels.ariaLabel.replace('{points}', description)

  const scrub = (event) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH
    if (x < PLOT.x0 - 14 || x > PLOT.x1 + 14) {
      setHovered(null)
      return
    }
    const nearest = points.reduce((best, point) => (Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best))
    setHovered(nearest.id)
  }

  const partProps = (point) =>
    interactive ? bind(point.id, `${point.text}${point.isReference ? ` · ${labels.reference}` : ''}`, `v-point v-point--${point.id}`) : { className: `v-point v-point--${point.id}` }
  const hit = (point) => (interactive ? <circle className="v-hit" cx={point.x} cy={point.y} r="15" /> : null)
  const guides = (point) =>
    interactive ? <path className="v-guide" d={`M${point.x} ${point.y}V${PLOT.y1}M${point.x} ${point.y}H${PLOT.x0}`} /> : null

  const picture = (
    <svg
      className={`ds-stage--prediction v-forecast-plot${interactive ? ' v-live' : ''}${interactive && active ? ' has-active' : ''}`}
      viewBox={`0 0 ${VIEW_WIDTH} 180`}
      role={interactive ? 'group' : 'img'}
      aria-label={ariaLabel}
      onPointerMove={interactive ? scrub : undefined}
      onPointerLeave={interactive ? () => setHovered(null) : undefined}
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

      <path className="v-link v-link--strong v-line" d={polylinePath(points.map((point) => [point.x, point.y]))} />

      <g {...partProps(first)}>
        {guides(first)}
        {hit(first)}
        <path className="v-dot v-dot--lg" d={`M${first.x} ${first.y}h.01`} />
        <text className="v-label" x={r(first.x + 10)} y={r(first.y - 4)}>
          {first.text}
        </text>
      </g>

      <g className="ds-stage--decision">
        {/* The reference ring and its label never dim. */}
        <circle className="v-node-ring" cx={reference.x} cy={reference.y} r="11" />
        <text className="v-label v-label--strong" x={r(reference.x + 14)} y={r(reference.y + 6)}>
          {labels.reference}
        </text>
        <g {...partProps(reference)}>
          {guides(reference)}
          {hit(reference)}
          <circle className="v-node" cx={reference.x} cy={reference.y} r="6" />
          <text className="v-label v-label--strong" x={r(reference.x + 14)} y={r(reference.y - 6)}>
            {reference.text}
          </text>
        </g>
      </g>

      <g {...partProps(last)}>
        {guides(last)}
        {hit(last)}
        <path className="v-dot v-dot--lg" d={`M${last.x} ${last.y}h.01`} />
        <text className="v-label" x={r(last.x)} y={r(last.y + 18)} textAnchor="end">
          {last.text}
        </text>
      </g>
    </svg>
  )

  if (!interactive) return picture

  const shown = points.find((point) => point.id === (active ?? REFERENCE_POLICY_ID))
  return (
    <div className="ds-visual-live">
      {picture}
      <p className="ds-visual-readout" aria-live="polite">
        <strong>{shown.id}</strong>
        {shown.isReference ? ` · ${labels.reference}` : ''}
        {' · '}
        {formatNumber(shown.meanBuffer, language, 0)} {labels.axisX}
        {' · '}
        {formatPercent(shown.exceedanceRate, language)} {labels.axisY}
      </p>
    </div>
  )
}
