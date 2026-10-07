import { getProjectEntry } from '../projects/registry.js'
import { getCaseStudy } from '../projects/caseStudies.js'

/**
 * Contextual `document.title` per route, built on top of the localized base
 * title (`meta.title` in i18n). This module is the only thing that sets
 * `document.title`; LanguageContext owns `<html lang>`, the description meta
 * tag and the OG tags (those are not route-dependent).
 *
 * Plain data in, string out: projects/registry.js and projects/caseStudies.js
 * are plain modules, so no injection is needed and it runs under Node's test
 * runner.
 *
 *   home / unknown     base title
 *   projects           Agustín Delgado — Projects
 *   project-detail     Agustín Delgado — <project title>
 *   project-case       Agustín Delgado — <project title> · <case title>
 *                      (+ " · Research" for a case's research section)
 *   about              Agustín Delgado — About
 *   contact            Agustín Delgado — Contact
 *
 * "Casework" and "Engineering Log" are not part of the site's identity any
 * more, so they never appear in a title. A case title that merely repeats its
 * project's (ALETHEIA) is not repeated.
 */

const BASE_NAME = 'Agustín Delgado'

const SECTION_LABELS = {
  projects: 'Projects',
  about: 'About',
  contact: 'Contact',
}

function caseTitle(study, t) {
  const copy = t(`casework.cases.${study.i18nKey}`)
  return typeof copy === 'object' && copy && copy.title ? copy.title : study.system
}

export function getRouteTitle(route, t) {
  const base = t('meta.title') || `${BASE_NAME} | Data Analyst`
  if (!route) return base

  if (route.view === 'project-case' && route.params?.projectId) {
    const { projectId, caseSlug, caseSection } = route.params
    const project = getProjectEntry(projectId)
    const study = getCaseStudy(projectId, caseSlug)
    if (project && study) {
      const parts = [project.title]
      const title = caseTitle(study, t)
      if (title && title !== project.title) parts.push(title)
      if (caseSection === 'research') parts.push('Research')
      return `${BASE_NAME} — ${parts.join(' · ')}`
    }
  }

  if (route.view === 'project-detail' && route.params?.projectId) {
    const project = getProjectEntry(route.params.projectId)
    return `${BASE_NAME} — ${project?.title || route.params.projectId}`
  }

  const label = SECTION_LABELS[route.view]
  return label ? `${BASE_NAME} — ${label}` : base
}
