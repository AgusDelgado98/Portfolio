import { getProjectEntry, hasProject } from '../projects/registry.js'
import { getCaseStudy } from '../projects/caseStudies.js'
import {
  HOME_HASH,
  PROJECTS_HASH,
  ABOUT_HASH,
  CONTACT_HASH,
  isAboutSection,
  aboutSectionHash,
  projectHash,
} from './hashes.js'
import { LEGACY_EXACT_ALIASES, LEGACY_PREFIX_ALIASES, LEGACY_FAMILY_BASES } from './legacyHashRoadmap.js'

export { HOME_HASH, PROJECTS_HASH, ABOUT_HASH, CONTACT_HASH }

/**
 * Navigation contract — PLAN-FROZEN v1.1, sections 3–5 (F2).
 *
 * `resolveAppRoute(hash)` is the single place that turns `location.hash` into
 * an app route. It only *classifies* hashes; App.jsx decides what to render for
 * each `view`, and router/normalizeHash.js decides whether the address bar must
 * be rewritten.
 *
 * Route shape:
 *   {
 *     view: 'home' | 'projects' | 'project-detail' | 'project-case'
 *         | 'about' | 'contact' | 'unknown',
 *     params: { projectId?, caseSlug?, caseSection?, section? },
 *     canonicalHash: string,   // the route's canonical hash
 *     legacyHash: string|null, // the legacy alias actually in the URL, if any
 *   }
 *
 * Canonical routes:
 *   #home
 *   #projects
 *   #projects/<project-id>                       project-detail
 *   #projects/<project-id>/<case-slug>           project-case
 *   #projects/<project-id>/<case-slug>/<section> project-case (a case's own section)
 *   #about, #about/<skills|experience|education|method>
 *   #contact
 *
 * Case studies come from projects/caseStudies.js (plain data) and project
 * visibility from projects/registry.js, so this module needs no JSX. It names
 * no project and no case: everything below is derived from that data.
 *
 * Legacy aliases (router/legacyHashRoadmap.js) resolve to the same views and
 * carry `legacyHash` = the incoming hash. App.jsx then normalizes the URL with
 * `history.replaceState` (no new history entry). Only real aliases are marked:
 * the empty hash, `#`, canonical hashes, unknown hashes and `#main-content`
 * never carry `legacyHash`, so they are never rewritten. An alias whose target
 * does not resolve (e.g. a case that is not public) is not marked either — it
 * falls back to Home like any other bad hash.
 *
 * Two separate visibility concepts:
 *   - a project's `hidden` flag (registry) removes the project from Projects,
 *     Project Detail and every public listing: it is treated as non-existent
 *     for all of them;
 *   - a case study's `isPublic` flag (caseStudies) alone decides whether that
 *     case can be opened. A case with `isPublic: true` resolves even when its
 *     project is hidden; a case without it never resolves.
 *
 * Safe fallbacks (all deterministic, never a blank screen or an exception):
 *   - unknown / hidden project, or a malformed id          -> Home
 *   - valid, public project + unknown or non-public case   -> that project's detail
 *   - case that exists but with an unknown section         -> Home
 *   - unknown `#about/<section>`                           -> About (no scroll target)
 *   - anything else unmatched                              -> view 'unknown' (renders Home)
 */

const unknownRoute = () => ({ view: 'unknown', params: {}, canonicalHash: HOME_HASH, legacyHash: null })

function homeRoute() {
  return { view: 'home', params: {}, canonicalHash: HOME_HASH, legacyHash: null }
}

function stripQuery(hash) {
  const queryAt = hash.indexOf('?')
  return queryAt === -1 ? hash : hash.slice(0, queryAt)
}

/**
 * Builds a resolver over the given data sources. `resolveAppRoute` below is the
 * one the app uses, wired to the real registry and case studies; the factory
 * exists so tests can exercise visibility rules with fake data instead of
 * relying on whichever projects happen to be hidden today.
 *
 *   getProject(id)                  -> a registered project (hidden or not), or null
 *   isProjectPublic(id)             -> true when the project has a public page (not hidden)
 *   getCase(projectId, slug)        -> a case study ({ canonicalHash, sections, canonicalSectionHashes, isPublic }) or null
 *   legacy.{exact,prefixes,bases}   -> the legacy alias tables
 */
export function createRouteResolver({
  getProject,
  isProjectPublic,
  getCase,
  legacy: { exact, prefixes, bases },
}) {
  /**
   * Legacy lookup. Returns:
   *   - a canonical hash string  -> the hash is a legacy alias for it
   *   - null                     -> a malformed member of a legacy family (-> Home)
   *   - undefined                -> not a legacy hash at all
   */
  function resolveLegacyAlias(hash) {
    const clean = stripQuery(hash).replace(/\/+$/, '')

    if (exact.has(clean)) return exact.get(clean)

    for (const [prefix, canonicalHash] of prefixes) {
      if (clean === prefix || clean.startsWith(`${prefix}/`)) return canonicalHash
    }

    if (bases.some((base) => clean.startsWith(`${base}/`))) return null

    return undefined
  }

  function projectDetailRoute(projectId) {
    // A hidden project has no detail page: treated as non-existent.
    if (!isProjectPublic(projectId)) return homeRoute()
    return { view: 'project-detail', params: { projectId }, canonicalHash: projectHash(projectId), legacyHash: null }
  }

  function resolveProjects(hash) {
    const segments = stripQuery(hash)
      .slice(PROJECTS_HASH.length + 1)
      .split('/')
    const [projectId = '', caseSlug, section, ...extra] = segments

    if (!projectId || !getProject(projectId)) return homeRoute()

    // `#projects/<id>` (a trailing slash behaves the same).
    if (caseSlug === undefined || caseSlug === '') return projectDetailRoute(projectId)

    // Only a case that is explicitly public can be opened — whatever its project's visibility.
    const study = getCase(projectId, caseSlug)
    if (!study || study.isPublic !== true) return projectDetailRoute(projectId)

    if (extra.length > 0) return homeRoute()

    if (section !== undefined && section !== '') {
      if (!study.sections.includes(section)) return homeRoute()
      return {
        view: 'project-case',
        params: { projectId, caseSlug, caseSection: section },
        canonicalHash: study.canonicalSectionHashes[section],
        legacyHash: null,
      }
    }

    return {
      view: 'project-case',
      params: { projectId, caseSlug, caseSection: null },
      canonicalHash: study.canonicalHash,
      legacyHash: null,
    }
  }

  function resolveCanonical(hash) {
    const clean = stripQuery(hash)

    if (clean === '' || clean === '#' || clean === HOME_HASH) {
      return { view: 'home', params: {}, canonicalHash: HOME_HASH, legacyHash: null }
    }

    if (clean === CONTACT_HASH) {
      return { view: 'contact', params: {}, canonicalHash: CONTACT_HASH, legacyHash: null }
    }

    if (clean === ABOUT_HASH || clean.startsWith(`${ABOUT_HASH}/`)) {
      const section = clean.slice(ABOUT_HASH.length + 1)
      if (isAboutSection(section)) {
        return { view: 'about', params: { section }, canonicalHash: aboutSectionHash(section), legacyHash: null }
      }
      // `#about`, `#about/` and an unknown section all land on About, no scroll target.
      return { view: 'about', params: { section: null }, canonicalHash: ABOUT_HASH, legacyHash: null }
    }

    if (clean === PROJECTS_HASH) {
      return { view: 'projects', params: {}, canonicalHash: PROJECTS_HASH, legacyHash: null }
    }

    if (clean.startsWith(`${PROJECTS_HASH}/`)) return resolveProjects(clean)

    return null
  }

  return function resolve(rawHash) {
    const hash = typeof rawHash === 'string' ? rawHash : ''

    const legacyTarget = resolveLegacyAlias(hash)
    if (legacyTarget === null) return homeRoute()
    if (legacyTarget !== undefined) {
      const route = resolveCanonical(legacyTarget)
      // An alias is only an alias if its target actually opens: otherwise it is
      // just a bad hash (e.g. the alias of a case that is not public).
      if (!route || route.canonicalHash !== legacyTarget) return homeRoute()
      return { ...route, legacyHash: hash }
    }

    return resolveCanonical(hash) ?? unknownRoute()
  }
}

export const resolveAppRoute = createRouteResolver({
  getProject: getProjectEntry,
  isProjectPublic: hasProject,
  getCase: getCaseStudy,
  legacy: { exact: LEGACY_EXACT_ALIASES, prefixes: LEGACY_PREFIX_ALIASES, bases: LEGACY_FAMILY_BASES },
})

/**
 * Focus Management / Accessibility Contract.
 *
 * Collapses a route into the identity of what actually gets mounted, so
 * callers (App.jsx) can tell a *real* view change (worth moving focus to
 * `<main>` and scrolling to the top) apart from one that stays within the same
 * rendered view.
 *
 * A `project-case` key includes project, case and section (a case's own section
 * view is a different page from the case). `project-detail` includes the id.
 *
 * Every About route shares 'about': a section change scrolls inside the page
 * and is not a view change.
 *
 * `home` and `unknown` share a key: both render Home.
 */
export function getRenderKey(route) {
  if (!route) return 'home'
  if (route.view === 'project-case') {
    const { projectId = '', caseSlug = '', caseSection } = route.params ?? {}
    return `project-case:${projectId}/${caseSlug}${caseSection ? `:${caseSection}` : ''}`
  }
  if (route.view === 'project-detail') return `project-detail:${route.params?.projectId ?? ''}`
  if (route.view === 'projects') return 'projects'
  if (route.view === 'about') return 'about'
  if (route.view === 'contact') return 'contact'
  return 'home'
}
