import React from 'react'
import { renderProjectVisual, visualLabels } from '../../visual/cardVisuals.jsx'

export default function ProjectVisual({ project, language, t, decorative = false, interactive = false }) {
  const labels = visualLabels(project, t)
  const picture = renderProjectVisual(project, language, labels, interactive && !decorative)
  return (
    <figure className="ds-proj-visual">
      {decorative ? <div aria-hidden="true">{picture}</div> : picture}
      {labels.caption ? <figcaption>{labels.caption}</figcaption> : null}
    </figure>
  )
}
