import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { FEATURED_PROJECT_IDS, APPLICATION_PROJECT_IDS, getTerritoryForProject } from '../projects/registry.js'
import { mergeProjectCopy } from '../projects/mergeProjectCopy.js'
import ProjectCard from './ProjectCard.jsx'

/**
 * Cards — the default Projects Index view (Phase 4, item 4). Shows the
 * full, real set of approved projects (no project previously retired is
 * reincorporated) split into the same two editorial groups Projects.jsx
 * always had: featured (PROVIDENTIA, Caelum, Paradigm, Soma —
 * `priority: 'primary'` in the registry) shown with more presence, and the
 * rest fully accessible underneath (item 5 — never Featured-only, never
 * hidden).
 */
export default function ProjectsCards() {
  const { t, language } = useLanguage()

  const featured = FEATURED_PROJECT_IDS.map((id) => mergeProjectCopy(id, language))
  const secondary = APPLICATION_PROJECT_IDS.map((id) => mergeProjectCopy(id, language))

  return (
    <div className="projects-cards">
      <section aria-labelledby="projects-cards-featured-title">
        <h2 id="projects-cards-featured-title" className="projects-cards-group-title">
          {t('projects.cardsFeaturedTitle')}
        </h2>
        <div className="projects-cards-grid projects-cards-grid--featured">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} territory={getTerritoryForProject(project.id)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="projects-cards-secondary-title">
        <h2 id="projects-cards-secondary-title" className="projects-cards-group-title">
          {t('projects.cardsSecondaryTitle')}
        </h2>
        <div className="projects-cards-grid">
          {secondary.map((project) => (
            <ProjectCard key={project.id} project={project} territory={getTerritoryForProject(project.id)} />
          ))}
        </div>
      </section>
    </div>
  )
}
