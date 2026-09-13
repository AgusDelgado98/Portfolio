import { GUIDE_VERSION, isValidIntent } from './intents.js'

/**
 * Persistence rules (Guided Portfolio Experience v0.2, frozen contract):
 *   - recruiter / technical clicked        -> persist immediately
 *   - "Seguir explorando" clicked          -> persist `default`
 *   - bounce, zero interaction             -> never persist
 *   - card ignored but site keeps browsing -> persist `default`
 *   - no TTL — a stored choice never expires on its own
 *   - invalidated only by a `guide_version` mismatch (manual, deliberate)
 *   - no IP/fingerprinting, single source of truth
 *
 * Pure, DOM-free logic — same reasoning as router/resolveAppRoute.js: a
 * `storage`-shaped object (getItem/setItem/removeItem) is passed in rather
 * than importing `window.localStorage` directly, so this stays testable
 * with Node's plain test runner and GuideContext.jsx is the only place that
 * wires it to the real browser storage.
 */

export const GUIDE_STORAGE_KEY = 'portfolio-guide'

/**
 * Reads the persisted intent, or `null` if there is none, it's malformed,
 * or its `version` doesn't match `expectedVersion` — a version mismatch is
 * the deliberate `guide_version` invalidation path, not an error.
 */
export function readStoredIntent(storage, expectedVersion = GUIDE_VERSION) {
  if (!storage) return null
  let raw
  try {
    raw = storage.getItem(GUIDE_STORAGE_KEY)
  } catch {
    return null
  }
  if (!raw) return null

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') return null
  if (parsed.version !== expectedVersion) return null
  if (!isValidIntent(parsed.intent)) return null
  return parsed.intent
}

/** Persists `intent` tagged with `version`. No-ops silently on an invalid intent or a storage failure (private mode, quota, SSR). */
export function writeStoredIntent(storage, intent, version = GUIDE_VERSION) {
  if (!storage || !isValidIntent(intent)) return
  try {
    storage.setItem(GUIDE_STORAGE_KEY, JSON.stringify({ intent, version }))
  } catch {
    /* ignore */
  }
}

/** Clears the persisted choice — the "Cambiar" control's effect: back to unset, so the soft invitation can ask again. */
export function clearStoredIntent(storage) {
  if (!storage) return
  try {
    storage.removeItem(GUIDE_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * "Ignora la card pero sigue usando el sitio -> persistir default."
 *
 * Given the current in-memory intent, returns what it should become after a
 * real navigation event (a hashchange — the same signal App.jsx's router
 * already treats as a genuine visit, not an impression): unchanged if the
 * visitor already chose something, otherwise `default`. Never called for
 * the initial page load itself (no hashchange fires on load), so a bounce
 * with zero navigation never reaches this — matching "bounce sin
 * interacción -> no persistir" and "nunca persistir default por simple
 * impresión".
 */
export function resolveIntentAfterNavigation(currentIntent, defaultIntent) {
  return currentIntent === null ? defaultIntent : currentIntent
}
