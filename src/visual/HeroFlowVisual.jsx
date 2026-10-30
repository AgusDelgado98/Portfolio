import React, { useRef, useState } from 'react'
import useInView from '../hooks/useInView.js'
import { BAND_RATIOS } from './data/providentia.js'
import { bandPaths, dotGrid, dotsPath, polylinePath, r } from './geometry.js'

/**
 * The hero's picture: DATA → EVIDENCE → PREDICTION → DECISION as one SVG
 * (viewBox 0 20 640 360 (16:9)). Every element has a job:
 *
 *   DATA        30 observations; 6 are dimmed — not every record is admitted.
 *   EVIDENCE    the admitted ones are grouped into 5 validated sources (hubs);
 *               the dimmed ones connect to nothing.
 *   PREDICTION  a series, its forecast and three nested bands PI80 / PI90 /
 *               PI95. The band WIDTHS keep PROVIDENTIA's real ratios
 *               (visual/data/providentia.js); the series shape is illustrative,
 *               and the caption under the figure says so.
 *   DECISION    the bands' upper edges become three capacity thresholds; PI90 —
 *               the policy PROVIDENTIA froze before opening its lockbox — is the
 *               one that leaves the diagram as an output.
 *
 * One ambient loop: a single signal (CSS, on the spine) travels DATA → EVIDENCE →
 * PREDICTION → DECISION, rests briefly, and travels back. It is paused off
 * screen, while a stage is hovered, focused or pinned, and removed under
 * prefers-reduced-motion. A stage chosen by hover, keyboard focus or click
 * (the click pins it, which is also the touch path) dims the rest of the
 * drawing and fades the signal out; releasing it lets the signal continue.
 * `renderDetail(stage)` (optional) draws what the chosen stage means under the
 * chips; with no stage chosen a one-line hint takes its place, so the drawing
 * and its explanation are one piece and nothing repeats it elsewhere.
 * No text inside the SVG on small screens: the stage chips below are the
 * visible text equivalent, and the SVG itself is aria-hidden.
 */

const STAGES = ['data', 'evidence', 'prediction', 'decision']

// ── geometry (computed once) ────────────────────────────────────────────────
const OUT_INDEXES = new Set([3, 8, 14, 19, 22, 27])
const DOTS = dotGrid({ cols: 5, rows: 6, x0: 36, y0: 74, dx: 24, dy: 50, spread: 3 })
const ADMITTED = DOTS.filter((dot) => !OUT_INDEXES.has(dot.i))
const REJECTED = DOTS.filter((dot) => OUT_INDEXES.has(dot.i))

const HUB_X = 244
const HUB_Y = [90, 150, 200, 250, 310]
const ROW_TO_HUB = [0, 1, 2, 2, 3, 4]

const LINKS_D = ADMITTED.map((dot) => `M${dot.x} ${dot.y}L${HUB_X} ${HUB_Y[ROW_TO_HUB[dot.row]]}`).join('')
const CONVERGE_D = HUB_Y.map((y) => `M${HUB_X + 6} ${y}C292 ${y} 300 226 336 226`).join('')
const HUB_CORES_D = dotsPath(HUB_Y.map((y) => ({ x: HUB_X, y })))

const HISTORY = [
  [336, 226],
  [348, 214],
  [360, 222],
  [372, 204],
  [384, 212],
  [396, 196],
  [408, 200],
]
const FORECAST_END = [472, 196]
const BANDS = bandPaths({
  x0: 408,
  y0: 200,
  x1: FORECAST_END[0],
  y1: FORECAST_END[1],
  halfWidth: 44,
  ratios: BAND_RATIOS,
})
// Upper edge of each band at the forecast's end = the capacity threshold.
const THRESHOLD_Y = BANDS.endHalfWidths.map((half) => r(FORECAST_END[1] - half)) // PI80, PI90, PI95
const REF_INDEX = 1 // PI90
const THRESHOLD_X = [FORECAST_END[0], 600]

const SERIES_D = polylinePath(HISTORY)
const FORECAST_D = `M408 200L${FORECAST_END[0]} ${FORECAST_END[1]}`
const SPINE_D = `M24 200H${HUB_X}C292 200 300 226 336 226${polylinePath(HISTORY.slice(1))}L${FORECAST_END[0]} ${FORECAST_END[1]}L${THRESHOLD_X[1]} ${THRESHOLD_Y[REF_INDEX]}`

// The signal takes the colour of the stage it is crossing (spine x: 24 → 600).
const PULSE_STOPS = [
  [0, 'data'],
  [0.28, 'data'],
  [0.3, 'evidence'],
  [0.53, 'evidence'],
  [0.55, 'prediction'],
  [0.77, 'prediction'],
  [0.79, 'decision'],
  [1, 'decision'],
]

const GRID_D =
  'M160 28V372M320 28V372M480 28V372' +
  Array.from({ length: 39 }, (_, i) => `M${16 + i * 16} 378v-6`).join('')

const OTHER_THRESHOLDS_D = [0, 2].map((i) => `M${THRESHOLD_X[0]} ${THRESHOLD_Y[i]}H${THRESHOLD_X[1]}`).join('')
const REF_THRESHOLD_D = `M${THRESHOLD_X[0]} ${THRESHOLD_Y[REF_INDEX]}H${THRESHOLD_X[1]}`
const OTHER_NODES_D = dotsPath([0, 2].map((i) => ({ x: THRESHOLD_X[1], y: THRESHOLD_Y[i] })))
const REF_Y = THRESHOLD_Y[REF_INDEX]
const OUTPUT_D = `M${THRESHOLD_X[1] + 11} ${REF_Y}H630M624 ${r(REF_Y - 5)}L630 ${REF_Y}L624 ${r(REF_Y + 5)}`

/**
 * The picture itself. Also used as the pipeline panel's diagram: the same
 * drawing with the selected stage highlighted.
 */
export const FlowSvg = React.forwardRef(function FlowSvg({ className, focus, playing = false, pulse = false }, ref) {
  return (
    <svg
      ref={ref}
      className={`v-flow ${className}`}
      viewBox="0 20 640 360"
      aria-hidden="true"
      focusable="false"
      data-focus={focus ?? undefined}
      data-playing={playing ? 'true' : 'false'}
    >
      {pulse ? (
        <defs>
          <linearGradient id="ds-pulse-gradient" gradientUnits="userSpaceOnUse" x1="24" y1="0" x2="600" y2="0">
            {PULSE_STOPS.map(([offset, stage]) => (
              <stop key={offset + stage} offset={offset} style={{ stopColor: `var(--ds-${stage})` }} />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      <path className="v-grid" d={GRID_D} />
      <path className="v-spine" d={SPINE_D} />

      <g className="v-zone v-zone--data ds-stage--data">
        <path className="v-dot" d={dotsPath(ADMITTED)} />
        <path className="v-dot v-dot--out" d={dotsPath(REJECTED)} />
      </g>

      <g className="v-zone v-zone--evidence ds-stage--evidence">
        <path className="v-link" d={LINKS_D} />
        {HUB_Y.map((y) => (
          <circle key={y} className="v-hub" cx={HUB_X} cy={y} r="8" />
        ))}
        <path className="v-hub-core" d={HUB_CORES_D} />
        <path className="v-link" d={CONVERGE_D} />
      </g>

      <g className="v-zone v-zone--prediction ds-stage--prediction">
        {BANDS.paths.map((d, index) => (
          <path key={index} className={`v-band v-band--${[95, 90, 80][index]}`} d={d} />
        ))}
        <path className="v-series" d={SERIES_D} />
        <path className="v-forecast" d={FORECAST_D} />
      </g>

      <g className="v-zone v-zone--decision ds-stage--decision">
        <path className="v-thr" d={OTHER_THRESHOLDS_D} />
        <path className="v-thr v-thr--ref" d={REF_THRESHOLD_D} />
        <path className="v-dot" d={OTHER_NODES_D} />
        <circle className="v-node" cx={THRESHOLD_X[1]} cy={REF_Y} r="6" />
        <circle className="v-node-ring" cx={THRESHOLD_X[1]} cy={REF_Y} r="11" />
        <path className="v-arrow" d={OUTPUT_D} />
        <text className="v-label" x="484" y={r(THRESHOLD_Y[0] - 4)}>
          PI80
        </text>
        <text className="v-label v-label--strong" x="484" y={r(REF_Y - 4)}>
          PI90
        </text>
        <text className="v-label" x="484" y={r(THRESHOLD_Y[2] - 4)}>
          PI95
        </text>
      </g>
      {pulse ? (
        <>
          <path className="v-pulse-glow" d={SPINE_D} pathLength="100" />
          <path className="v-pulse" d={SPINE_D} pathLength="100" />
        </>
      ) : null}
    </svg>
  )
})

export default function HeroFlowVisual({ labels, stageNames, renderDetail }) {
  const svgRef = useRef(null)
  const inView = useInView(svgRef)
  const [hovered, setHovered] = useState(null)
  const [focused, setFocused] = useState(null)
  const [pinned, setPinned] = useState(null)
  const focus = hovered ?? focused ?? pinned

  return (
    <figure className="ds-hero-figure" aria-label={labels.aria}>
      <FlowSvg ref={svgRef} className="ds-flow" focus={focus} playing={inView && !focus} pulse />

      <figcaption className="ds-flow-caption">{labels.captionLead}</figcaption>

      <div className="ds-flow-interactive" onPointerLeave={() => setHovered(null)}>
        <ol className="ds-flow-stages" aria-label={labels.stagesAria}>
          {STAGES.map((stage) => (
            <li key={stage}>
              <button
                type="button"
                className={`ds-flow-stage ds-stage--${stage}`}
                aria-pressed={pinned === stage}
                onClick={() => setPinned((current) => (current === stage ? null : stage))}
                onFocus={(event) => {
                  // Keyboard focus previews the stage; a mouse click pins it instead.
                  if (event.currentTarget.matches(':focus-visible')) setFocused(stage)
                }}
                onBlur={() => setFocused(null)}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setHovered(stage)
                }}
              >
                <span className="ds-flow-stage-dot" aria-hidden="true" />
                {stageNames[stage]}
              </button>
            </li>
          ))}
        </ol>

        {renderDetail ? (
          <div className="ds-flow-detail" aria-live="polite">
            {focus ? renderDetail(focus) : <p className="ds-flow-hint">{labels.hint}</p>}
          </div>
        ) : null}
      </div>
    </figure>
  )
}
