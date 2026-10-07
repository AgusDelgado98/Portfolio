import React from 'react'
import { projectHash } from '../../router/hashes.js'

/**
 * In-page section links. The href is the canonical project route, so copying
 * the link or opening it in a new tab still lands on Project Detail. A plain
 * click scrolls to the section and leaves the address bar where it is.
 */
function plainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export default function SectionNav({ projectId, sections, t }) {
  if (sections.length < 2) return null
  const fallback = projectHash(projectId)

  const openSection = (event, id) => {
    if (!plainClick(event)) return
    const target = document.getElementById(`detail-${id}`)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ block: 'start' })
    target.focus({ preventScroll: true })
  }

  return (
    <nav className="ds-section-nav" aria-label={t('projectDetail.sectionsAria')}>
      {sections.map((section) => (
        <a key={section.id} href={fallback} onClick={(event) => openSection(event, section.id)}>
          {t(`projectDetail.sections.${section.id}`)}
        </a>
      ))}
    </nav>
  )
}
