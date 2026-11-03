import React from 'react'
import { FIGURE_META } from '../home/figureMeta.js'

/**
 * EvolutionRoute (F8): conceptual professional path. Geometry is the static
 * SVG; stage and published-project labels are HTML (EG13). No withheld project.
 */
export default function EvolutionRoute({ copy, lazy = true }) {
  const meta = FIGURE_META.route
  if (!copy?.note || !copy?.alt || !copy?.nodes || !copy?.markers) return null

  const nodeLabels = [
    {
      key: 'practice',
      lines: copy.nodes.practice,
      style: {
        left: `${meta.nodes.practice.x}%`,
        top: `${meta.nodes.practice.y}%`,
        transform: 'translate(0, 14px)',
        textAlign: 'left',
      },
    },
    {
      key: 'training',
      lines: copy.nodes.training,
      style: {
        left: `${meta.nodes.training.x}%`,
        top: `${meta.nodes.training.y}%`,
        transform: 'translate(8px, 14px)',
        textAlign: 'left',
      },
      className: 'about-route__lab--training',
    },
    {
      key: 'direction',
      lines: copy.nodes.direction,
      style: {
        right: `${100 - meta.nodes.direction.x}%`,
        bottom: `${100 - meta.nodes.direction.y}%`,
        transform: 'translate(0, -12px)',
        textAlign: 'right',
      },
    },
  ]

  const markers = [
    {
      key: 'paradigm',
      text: copy.markers.paradigm,
      style: {
        left: `${meta.markers.paradigm.x}%`,
        top: `${meta.markers.paradigm.y}%`,
        transform: 'translate(-110%, -120%)',
        textAlign: 'right',
      },
    },
    {
      key: 'providentia',
      text: copy.markers.providentia,
      style: {
        left: `${meta.markers.providentia.x}%`,
        top: `${meta.markers.providentia.y}%`,
        transform: 'translate(-110%, -120%)',
        textAlign: 'right',
      },
    },
  ]

  return (
    <figure className="home-pfig about-route">
      <div className="home-pfig__box" style={{ aspectRatio: `${meta.W} / ${meta.H}` }}>
        <img
          src="/figures/evolution-route.svg"
          width={meta.W}
          height={meta.H}
          alt={copy.alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
        {nodeLabels.map((label) => (
          <span
            key={label.key}
            className={`about-route__lab${label.className ? ` ${label.className}` : ''}`}
            aria-hidden="true"
            style={label.style}
          >
            <strong>{label.lines[0]}</strong>
            <span>{label.lines[1]}</span>
          </span>
        ))}
        {markers.map((marker) => (
          <span key={marker.key} className="about-route__mark" aria-hidden="true" style={marker.style}>
            {marker.text}
          </span>
        ))}
      </div>
      <figcaption className="home-pfig__note">{copy.note}</figcaption>
    </figure>
  )
}
