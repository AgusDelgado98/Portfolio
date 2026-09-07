import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { projectIconsById } from './projectIcons.jsx'

/**
 * A single Projects Index card (Phase 4, Projects Experience, item 4).
 * Real `<a href="#projects/<id>">` — a genuine link, not a clickable div —
 * to Project Detail; no dialog involved. Deliberately compact: name,
 * territory/category, one summary line, a few stack chips, status, CTA —
 * "la lectura debe ser mucho más rápida que interpretar el Atlas" (item 4).
 *
 * `priority` ('primary' | 'secondary', from projects/registry.js) drives
 * `.project-card--primary` for PROVIDENTIA/Paradigm/Soma's larger
 * treatment (item 5) — never hidden, never removed, just less visual
 * weight for the rest.
 */
export default function ProjectCard({ project, territory }) {
  const { t } = useLanguage()
  const category = (project.label ?? project.type ?? '').split(' · ')[0]
  const summary = project.nodeSummary ?? project.tagline ?? project.description
  const status = project.status || 'Active'
  const stackPreview = (project.stack || []).slice(0, 4)

  return (
    <a
      className={`project-card project-card--${project.priority || 'secondary'}`}
      href={`#projects/${project.id}`}
    >
      <div className="project-card-head">
        <span className={`project-card-icon accent-${project.accent || 'sky'}`} aria-hidden="true">
          {projectIconsById[project.id]}
        </span>
        <span className={`atlas-node-status atlas-node-status--${status.toLowerCase()}`}>
          {t(`projects.status.${status}`)}
        </span>
      </div>

      <h3 className="project-card-title safe-text-render">{project.title}</h3>
      {category ? <p className="project-card-category">{category}{territory ? ` · ${territory.code}` : ''}</p> : null}
      {summary ? <p className="project-card-summary">{summary}</p> : null}

      {stackPreview.length > 0 && (
        <ul className="project-card-stack" aria-label={t('projects.stack')}>
          {stackPreview.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      <span className="project-card-cta">
        {t('projects.consultSheet')}
      </span>
    </a>
  )
}
