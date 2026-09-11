import { getProjectMeta } from '../projects/registry.js'

/**
 * Navigation Contract — Phase 0, extended in Phase 1 (Destination
 * Foundation).
 *
 * Contextual `document.title` per route, built on top of the existing
 * localized base title (`meta.title` in i18n). This is intentionally plain
 * infrastructure, not final, fully-bespoke copy.
 *
 * `document.title` ownership: this module is now the only thing that sets
 * it. LanguageContext still owns `<html lang>`, the description meta tag,
 * and the OG tags (those aren't route-dependent).
 *
 * Like resolveAppRoute.js, this takes an optional `getCaseworkSystem(slug)`
 * dependency instead of statically importing casework/registry.js, so it
 * stays free of JSX/CSS and unit-testable with Node's built-in test runner.
 * App.jsx passes the real registry lookup; omitting it just yields the
 * generic base title for a case (soft fallback, nothing breaks).
 *
 * projects/registry.js is different: it's plain data (no JSX), so it's
 * imported directly here, same as in resolveAppRoute.js — no injection
 * needed, and a project-detail title now uses the project's real title
 * (Phase 0 could only fall back to the raw id).
 */

const BASE_NAME = 'Agustín Delgado'

const SECTION_LABELS = {
  'data-bi': 'Data & BI',
  operations: 'Operations',
  projects: 'Projects',
  'casework-index': 'Casework',
  about: 'About',
  contact: 'Contact',
}

export function getRouteTitle(route, t, { getCaseworkSystem } = {}) {
  const base = t('meta.title') || `${BASE_NAME} | Data Analyst`
  if (!route) return base

  if (route.view === 'casework-detail' && route.params?.caseSlug) {
    const system = typeof getCaseworkSystem === 'function' ? getCaseworkSystem(route.params.caseSlug) : null
    if (system && route.params?.caseSection === 'research') {
      return `${BASE_NAME} — ${system} · Research`
    }
    if (system) return `${BASE_NAME} — ${system}`
  }

  if (route.view === 'project-detail' && route.params?.projectId) {
    const project = getProjectMeta(route.params.projectId)
    return `${BASE_NAME} — ${project?.title || route.params.projectId}`
  }

  const label = SECTION_LABELS[route.view]
  return label ? `${BASE_NAME} — ${label}` : base
}
