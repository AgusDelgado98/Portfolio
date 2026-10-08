import React from 'react'
import { dotsPath } from './geometry.js'
import usePartFocus from './usePartFocus.js'

/**
 * Soma's picture: four open glyphs — a calendar (Agenda), record lines (Ficha),
 * dots on a timeline (Timeline) and bars (Estadísticas) — joined by one line.
 * No frames: a glyph is its own marks. A conceptual illustration of the
 * product's four working surfaces, not a screenshot, and it says so in its
 * caption.
 *
 * `interactive` (Project Detail): each glyph is a keyboard-focusable button;
 * hovering, focusing or tapping one animates that glyph's own marks and dims
 * the others. Hovering the empty drawing, or a catalog card, plays one pass of
 * a signal along the line. There is no continuous loop.
 */

const MODULES = ['agenda', 'record', 'timeline', 'stats']
const CX = { agenda: 48, record: 126, timeline: 204, stats: 282 }
const HIT = { agenda: [10, 88], record: [88, 166], timeline: [166, 244], stats: [244, 312] }
const BASE_Y = 108

const CALENDAR_DOTS = dotsPath(
  [78, 90, 102].flatMap((y) => [-14, 0, 14].map((dx) => ({ x: CX.agenda + dx, y }))),
)
const TIMELINE_DOTS = [66, 84, 102]
const BARS = [
  [-15, 14],
  [-5, 28],
  [5, 20],
  [15, 36],
]
const LINKS_D = 'M76 84H98M94 81L98 84L94 87M154 84H176M172 81L176 84L172 87M232 84H254M250 81L254 84L250 87'
const SIGNAL_D = 'M24 84H296'

export default function SomaProductVisual({ labels, interactive = false }) {
  const { active, bind } = usePartFocus()
  const names = { agenda: labels.agenda, record: labels.record, timeline: labels.timeline, stats: labels.stats }
  const partProps = (id) => (interactive ? bind(id, names[id], `v-glyph v-glyph--${id}`) : { className: `v-glyph v-glyph--${id}` })
  const hit = (id) => (interactive ? <rect className="v-hit" x={HIT[id][0]} y="40" width={HIT[id][1] - HIT[id][0]} height="108" /> : null)
  const label = (id) => (
    <text className="v-label" x={CX[id]} y="140" textAnchor="middle">
      {names[id]}
    </text>
  )

  const picture = (
    <svg
      className={`v-soma${interactive ? ' v-live' : ''}${interactive && active ? ' has-active' : ''}`}
      viewBox="0 0 320 180"
      role={interactive ? 'group' : 'img'}
      aria-label={labels.caption}
    >
      <path className="v-link v-links" d={LINKS_D} />

      <g {...partProps('agenda')}>
        {hit('agenda')}
        <path className="v-stroke" d={`M${CX.agenda - 12} 56v8M${CX.agenda + 12} 56v8M${CX.agenda - 22} 68H${CX.agenda + 22}`} />
        <path className="v-dot" d={CALENDAR_DOTS} />
        <circle className="v-today" cx={CX.agenda} cy="90" r="6" />
        {label('agenda')}
      </g>

      <g {...partProps('record')}>
        {hit('record')}
        <circle className="v-stroke v-avatar" cx={CX.record - 14} cy="70" r="5" />
        <path className="v-stroke v-line v-line--1" d={`M${CX.record - 4} 68H${CX.record + 22}`} pathLength="100" />
        <path className="v-stroke v-line v-line--2" d={`M${CX.record - 22} 84H${CX.record + 22}`} pathLength="100" />
        <path className="v-stroke v-line v-line--3" d={`M${CX.record - 22} 94H${CX.record + 10}`} pathLength="100" />
        <path className="v-stroke v-line v-line--4" d={`M${CX.record - 22} 104H${CX.record + 18}`} pathLength="100" />
        {label('record')}
      </g>

      <g {...partProps('timeline')}>
        {hit('timeline')}
        <path className="v-stroke" d={`M${CX.timeline - 10} 58V110`} />
        {TIMELINE_DOTS.map((y, index) => (
          <React.Fragment key={y}>
            <circle className={`v-node v-node--${index + 1}`} cx={CX.timeline - 10} cy={y} r="3.2" />
            <path className={`v-stroke v-tick v-tick--${index + 1}`} d={`M${CX.timeline - 2} ${y}h${[22, 16, 24][index]}`} />
          </React.Fragment>
        ))}
        {label('timeline')}
      </g>

      <g {...partProps('stats')}>
        {hit('stats')}
        <path className="v-stroke" d={`M${CX.stats - 22} ${BASE_Y}H${CX.stats + 22}`} />
        {BARS.map(([dx, height], index) => (
          <path key={dx} className={`v-bar v-bar--${index + 1}`} d={`M${CX.stats + dx} ${BASE_Y - 2}v${-height}`} />
        ))}
        {label('stats')}
      </g>

      <path className="v-signal" d={SIGNAL_D} pathLength="100" aria-hidden="true" />
    </svg>
  )

  if (!interactive) return picture

  const readouts = labels.readout || {}
  return (
    <div className="ds-visual-live">
      {picture}
      <p className="ds-visual-readout" aria-live="polite">
        {active ? readouts[active] || names[active] : labels.hint}
      </p>
    </div>
  )
}
