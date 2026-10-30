import React, { useRef } from 'react'
import useCssVarHeight from '../../hooks/useCssVarHeight.js'
import { projectHash } from '../../router/hashes.js'

/**
 * In-page section links. The href is the canonical project route, so copying
 * the link or opening it in a new tab still lands on Project Detail. A plain
 * click scrolls to the section and leaves the address bar where it is.
 *
 * After the scroll the section's heading takes focus (it is `tabIndex={-1}`
 * and draws no outline): assistive technology announces where the reader
 * landed, and no box is drawn around a whole section.
 *
 * The bar is sticky below the header. Its own height is published as
 * `--section-nav-h` so every scroll-margin clears header + bar from one source.
 */
function plainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export default function SectionNav({ projectId, sections, titles = {}, t }) {
  const navRef = useRef(null)
  useCssVarHeight(navRef, '--section-nav-h', '0px')
  if (sections.length < 2) return null
  const fallback = projectHash(projectId)

  const openSection = (event, id) => {
    if (!plainClick(event)) return
    const target = document.getElementById(`detail-${id}`)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ block: 'start' })
    target.querySelector('h2')?.focus({ preventScroll: true })
  }

  return (
    <nav ref={navRef} className="ds-section-nav" aria-label={t('projectDetail.sectionsAria')}>
      {sections.map((id) => (
        <a key={id} href={fallback} onClick={(event) => openSection(event, id)}>
          {titles[id] ?? t(`projectDetail.sections.${id}`)}
        </a>
      ))}
    </nav>
  )
}
