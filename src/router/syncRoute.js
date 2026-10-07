import { resolveAppRoute } from './resolveAppRoute.js'
import { normalizeLocationHash } from './normalizeHash.js'
import { MAIN_CONTENT_HASH } from './hashes.js'

/**
 * Reads the current `location.hash`, resolves it, and — when it is a legacy
 * alias — silently rewrites the address bar to the canonical hash
 * (`history.replaceState`, no new history entry; see router/normalizeHash.js).
 *
 * Returns the resolved route, or null when the hash is the skip-link target
 * (`#main-content`): that is a plain in-page anchor to <main>, not a
 * navigation, so it is left completely alone — no resolving, no rewriting, and
 * the caller keeps rendering the current route.
 *
 * Takes `{ location, history }` (a `window`, or a fake in tests) so the exact
 * logic App.jsx runs on first load and on every `hashchange` is testable
 * without a DOM.
 */
export function syncRouteFromLocation({ location, history }) {
  if (location.hash === MAIN_CONTENT_HASH) return null
  const route = resolveAppRoute(location.hash)
  normalizeLocationHash(route, { location, history })
  return route
}
