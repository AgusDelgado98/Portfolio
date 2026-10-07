import { MAIN_CONTENT_HASH } from './hashes.js'

/**
 * Silent legacy-URL normalization — PLAN-FROZEN v1.1, section 5.2 (F2).
 *
 * When the app is opened with — or navigated to — a legacy alias, the address
 * bar is rewritten to the route's canonical hash with `history.replaceState`:
 *
 *   #casework/no-show  ->  #projects/paradigm/no-show
 *   #data-bi           ->  #about/skills
 *
 * `replaceState` REPLACES the current history entry, so no extra entry is
 * added (Back still goes to whatever the visitor had before the legacy link)
 * and it does not fire `hashchange`, so the caller sets the already-resolved
 * route directly — nothing loops.
 *
 * What is NOT normalized (the resolver never marks these as legacy):
 *   - the empty hash and a bare `#` (the clean root URL stays clean)
 *   - hashes that are already canonical
 *   - unknown hashes (they fall back to Home but are not aliases)
 *   - `#main-content` (the skip-link anchor, not a route — also guarded here)
 *
 * Pure and DOM-free on purpose: `normalizeLocationHash` takes the `location`
 * and `history` objects, so tests drive it with fakes.
 */

/** The hash the address bar should be rewritten to, or null when it must be left alone. */
export function getNormalizedHash(route, currentHash) {
  if (!route || !route.legacyHash) return null
  if (currentHash === MAIN_CONTENT_HASH) return null
  if (!route.canonicalHash || route.canonicalHash === currentHash) return null
  return route.canonicalHash
}

/**
 * Applies the normalization to `{ location, history }`. Returns the canonical
 * hash it wrote, or null when nothing was changed.
 */
export function normalizeLocationHash(route, { location, history }) {
  const target = getNormalizedHash(route, location.hash)
  if (!target) return null
  history.replaceState(history.state, '', `${location.pathname}${location.search}${target}`)
  return target
}
