import {
  parseCaseworkHash,
  isEngineeringLogHash,
  CASEWORK_HASH,
  ALETHEIA_CASE_SLUG,
} from '../constants/links.js'
import { hasProject } from '../projects/registry.js'

/**
 * Navigation Contract — Phase 0, extended in Phase 1 (Destination
 * Foundation) and Phase 2 (Home Hub).
 *
 * `resolveAppRoute(hash)` is the single place that turns `location.hash`
 * into an app route. It wraps the existing Casework hash parsing
 * (`parseCaseworkHash`, in constants/links.js) unchanged — Casework's own
 * contract, including the historical `#engineering-log` alias, is preserved
 * 1:1, not reimplemented or duplicated here.
 *
 * This module only *classifies* hashes — App.jsx decides what to render for
 * each `view`. Every view below has a real, distinct destination component
 * (see App.jsx). Only `unknown` still falls back to Home — deliberately,
 * rather than a blank screen or an exception, exactly as in Phase 0.
 *
 * Route shape:
 *   {
 *     view: 'home' | 'data-bi' | 'operations' | 'projects' | 'project-detail'
 *         | 'casework-index' | 'casework-detail' | 'about' | 'contact' | 'unknown',
 *     params: { caseSlug?: string, projectId?: string },
 *     canonicalHash: string,   // the route's canonical hash
 *     legacyHash: string|null, // the legacy alias actually in the URL, if any
 *   }
 *
 * Canonical route table:
 *   #home                     -> view: home              (new Home Hub)
 *   #data-bi                  -> view: data-bi            (Data & BI destination)
 *   #operations               -> view: operations         (Administrative & Operations destination)
 *   #projects                 -> view: projects           (Projects Index — Cards default, Atlas secondary)
 *   #projects/<known-id>      -> view: project-detail     (Project Detail — a real, separate page, not a
 *                                                            dialog — see components/ProjectDetail.jsx)
 *   #casework                 -> view: casework-index
 *   #casework/<slug>          -> view: casework-detail
 *   #about                    -> view: about              (About destination)
 *   #contact                  -> view: contact            (Contact destination)
 *
 * Legacy hash -> canonical mapping (see router/legacyHashRoadmap.js for the
 * full migration table, rationale and activation phase per hash — ALL of
 * these are now activated: Phase 2's Home Hub retired the old scroll
 * sections these anchors used to target, so keeping them mapped to `home`
 * would have pointed at content that no longer exists there):
 *   #portada                  -> view: home     (canonical #home)
 *   #proyectos                -> view: projects  (canonical #projects — ACTIVATED: Projects is no
 *                                                   longer a Home section, so this now opens the real
 *                                                   Projects destination instead of a dead anchor)
 *   #enfoque                  -> view: about     (canonical #about — ACTIVATED, same reason)
 *   #stack                    -> view: data-bi   (canonical #data-bi — ACTIVATED, same reason)
 *   #formacion                -> view: about     (canonical #about — ACTIVATED, same reason)
 *   #contacto                 -> view: contact   (canonical #contact — activated back in Phase 1)
 *   #engineering-log(/...)    -> canonical #casework/no-show (permanent alias — never retired)
 *   #casework, #casework/*    -> unchanged, already canonical
 *
 * None of these are rewritten in the address bar (no pushState/replaceState
 * here or in App.jsx) — they resolve as aliases to their canonical view,
 * exactly like `#engineering-log` always has, so a bookmarked or shared
 * legacy URL keeps reading exactly as it did; it just now opens the right
 * real destination instead of a Home section that no longer exists there.
 * See legacyHashRoadmap.js for the full rationale.
 *
 * Invalid / unknown handling:
 *   - `#casework/<bad-slug>`  -> view: home   (mirrors the existing, preserved
 *                                              Casework behavior: an unknown
 *                                              slug never opens a case)
 *   - `#projects/` (empty id) -> view: home   (malformed detail route)
 *   - `#projects/<bad-id>`    -> view: home   (mirrors the Casework precedent above;
 *                                              validated against projects/registry.js,
 *                                              the single source of truth for project ids)
 *   - anything else unmatched -> view: unknown (still renders the Home Hub
 *                                               — this is a documented,
 *                                               deterministic decision, not an
 *                                               accidental fallthrough)
 *
 * Neither this function nor its callers ever call history.pushState /
 * replaceState — legacy hashes are recognized as-is and never rewritten, so
 * Back/Forward and shared deep links keep working unchanged.
 *
 * Dependency injection, not a static import of casework/registry.js:
 * this module takes a `hasCaseworkCase(slug)` predicate instead of
 * importing the real casework registry directly. The registry pulls in the
 * case JSX components (and their CSS), so importing it here would make this
 * file — otherwise plain, dependency-free routing logic — impossible to
 * unit-test with Node's built-in test runner. App.jsx (the only real
 * caller) passes the live registry's check, so the Casework contract is
 * still reused exactly, never duplicated; tests pass a lightweight fake.
 *
 * Projects are different: projects/registry.js is plain data (no JSX), so
 * it's imported directly here — no injection needed, and no more duplicated
 * id list (Phase 0's `KNOWN_PROJECT_IDS` debt, resolved in Phase 1).
 */

export const HOME_HASH = '#home'
export const DATA_BI_HASH = '#data-bi'
export const OPERATIONS_HASH = '#operations'
export const PROJECTS_HASH = '#projects'
export const ABOUT_HASH = '#about'
export const CONTACT_HASH = '#contact'

// Legacy anchors from the old scroll-first Home. Phase 2's Home Hub retired
// the sections these used to target, so each now resolves as an alias to
// its real canonical destination (see the doc comment above and
// legacyHashRoadmap.js) — never rewritten in the address bar.
// Exported (read-only) so legacyHashRoadmap.js's own test can assert every
// legacy hash it documents is one this resolver actually still recognizes.
export const LEGACY_HOME_ANCHORS = ['#portada', '#proyectos', '#enfoque', '#stack', '#formacion']
export const LEGACY_CONTACT_ANCHOR = '#contacto'

// Where each legacy anchor (other than #portada, handled with '' and '#'
// below) now actually resolves.
const LEGACY_ANCHOR_TARGETS = {
  '#proyectos': { view: 'projects', canonicalHash: PROJECTS_HASH },
  '#enfoque': { view: 'about', canonicalHash: ABOUT_HASH },
  '#stack': { view: 'data-bi', canonicalHash: DATA_BI_HASH },
  '#formacion': { view: 'about', canonicalHash: ABOUT_HASH },
}

function homeRoute(legacyHash = null) {
  return { view: 'home', params: {}, canonicalHash: HOME_HASH, legacyHash }
}

export function resolveAppRoute(rawHash, { hasCaseworkCase } = {}) {
  const hash = typeof rawHash === 'string' ? rawHash : ''
  const isRegisteredCase = typeof hasCaseworkCase === 'function' ? hasCaseworkCase : () => false

  // --- Casework: delegate entirely to the existing, preserved contract. ---
  const { inCasework, slug, section } = parseCaseworkHash(hash)
  if (inCasework) {
    if (slug === null) {
      return { view: 'casework-index', params: {}, canonicalHash: CASEWORK_HASH, legacyHash: null }
    }
    if (isRegisteredCase(slug)) {
      // ALETHEIA Full Research is an in-SPA section, not a raw document.
      if (slug === ALETHEIA_CASE_SLUG && section === 'research') {
        return {
          view: 'casework-detail',
          params: { caseSlug: slug, caseSection: 'research' },
          canonicalHash: `${CASEWORK_HASH}/${slug}/research`,
          legacyHash: null,
        }
      }
      if (section) {
        // Unknown subsection for a known case — safe Home fallback.
        return homeRoute()
      }
      return {
        view: 'casework-detail',
        params: { caseSlug: slug },
        canonicalHash: `${CASEWORK_HASH}/${slug}`,
        legacyHash: isEngineeringLogHash(hash) ? hash : null,
      }
    }
    // Unknown slug — matches the pre-existing resolveCaseworkRoute behavior
    // 1:1: it does not fall back to any case, it resolves to Home/Atlas.
    return homeRoute()
  }

  if (hash === '' || hash === '#' || hash === HOME_HASH || hash === '#portada') {
    return homeRoute(hash && hash !== HOME_HASH ? hash : null)
  }

  if (Object.hasOwn(LEGACY_ANCHOR_TARGETS, hash)) {
    const target = LEGACY_ANCHOR_TARGETS[hash]
    return { view: target.view, params: {}, canonicalHash: target.canonicalHash, legacyHash: hash }
  }

  if (hash === CONTACT_HASH || hash === LEGACY_CONTACT_ANCHOR) {
    return {
      view: 'contact',
      params: {},
      canonicalHash: CONTACT_HASH,
      legacyHash: hash === LEGACY_CONTACT_ANCHOR ? hash : null,
    }
  }

  if (hash === DATA_BI_HASH) {
    return { view: 'data-bi', params: {}, canonicalHash: DATA_BI_HASH, legacyHash: null }
  }

  if (hash === OPERATIONS_HASH) {
    return { view: 'operations', params: {}, canonicalHash: OPERATIONS_HASH, legacyHash: null }
  }

  if (hash === ABOUT_HASH) {
    return { view: 'about', params: {}, canonicalHash: ABOUT_HASH, legacyHash: null }
  }

  if (hash === PROJECTS_HASH) {
    return { view: 'projects', params: {}, canonicalHash: PROJECTS_HASH, legacyHash: null }
  }

  if (hash.startsWith(`${PROJECTS_HASH}/`)) {
    const projectId = hash.slice(PROJECTS_HASH.length + 1).split(/[/?#]/)[0]
    if (projectId && hasProject(projectId)) {
      return {
        view: 'project-detail',
        params: { projectId },
        canonicalHash: `${PROJECTS_HASH}/${projectId}`,
        legacyHash: null,
      }
    }
    // `#projects/` (empty id) or an unrecognized id — safe, deterministic
    // fallback, mirroring the Casework precedent above.
    return homeRoute()
  }

  // Truly unrecognized hash: typed distinctly so it's testable and never
  // confused with an intentional Home visit, but still renders the
  // Home/Atlas shell rather than a blank screen or an exception.
  return { view: 'unknown', params: {}, canonicalHash: HOME_HASH, legacyHash: null }
}

/**
 * Focus Management / Accessibility Contract — Phase 0, updated through
 * Phase 4.
 *
 * Collapses a route into the identity of what actually gets mounted, so
 * callers (App.jsx) can tell a *real* view change (worth moving focus to
 * `<main>`) apart from one that stays within the same rendered view (e.g.
 * an in-page anchor within the Home Hub, or switching the Projects Index
 * between Cards/Atlas — components/ProjectsIndex.jsx's own local state).
 *
 * A `casework-detail` key includes the slug, since navigating between two
 * cases (e.g. via a direct hash edit) mounts a genuinely different case
 * component. `project-detail` does the same with the project id (Phase 4:
 * ProjectDetail is now a real, separate page — no longer a dialog living
 * inside the Index — so `projects` and `project-detail` get DISTINCT keys;
 * before the bridge was retired they intentionally shared one). Every
 * legacy anchor resolves to its real destination's own view (see
 * resolveAppRoute's doc comment), so it naturally gets that destination's
 * render key too — nothing extra needed here.
 *
 * `home` and `unknown` share a key: both render the Home Hub — `unknown`
 * as a deliberate, documented fallback (never a blank screen).
 */
export function getRenderKey(route) {
  if (!route) return 'home'
  if (route.view === 'casework-detail') {
    const section = route.params?.caseSection ? `:${route.params.caseSection}` : ''
    return `casework-detail:${route.params?.caseSlug ?? ''}${section}`
  }
  if (route.view === 'casework-index') return 'casework-index'
  if (route.view === 'project-detail') return `project-detail:${route.params?.projectId ?? ''}`
  if (route.view === 'projects') return 'projects'
  if (route.view === 'data-bi' || route.view === 'operations' || route.view === 'about' || route.view === 'contact') {
    return route.view
  }
  return 'home'
}
