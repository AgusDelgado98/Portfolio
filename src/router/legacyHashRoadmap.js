import {
  HOME_HASH,
  DATA_BI_HASH,
  OPERATIONS_HASH,
  PROJECTS_HASH,
  ABOUT_HASH,
  CONTACT_HASH,
  LEGACY_HOME_ANCHORS,
  LEGACY_CONTACT_ANCHOR,
} from './resolveAppRoute.js'

/**
 * Legacy Hash Migration Roadmap — created in Phase 0, updated in Phase 1
 * (Destination Foundation) and Phase 2 (Home Hub, where every remaining
 * gate is activated).
 *
 * This file is the single place that records where each legacy hash points,
 * whether that destination is actually built, and whether the hash has
 * been switched over to it — a decision made in writing so it isn't
 * re-litigated or forgotten between phases.
 *
 * Two independent facts per entry:
 *
 * - `destinationBuilt`: does `futureCanonicalHash`'s view render real
 *   content? Built for every one of these since Phase 1.
 * - `gateStatus`: has the legacy hash actually been switched over to that
 *   destination? `'activated'` means `currentCanonicalHash` now equals
 *   `futureCanonicalHash` (resolveAppRoute() really returns the new
 *   destination for it). As of Phase 2, every entry is activated — the
 *   Home Hub retired the old scroll sections these anchors used to
 *   target, so there is no longer a "current Home behavior" left to
 *   preserve by not activating them; leaving them mapped to `home` would
 *   have pointed at content that no longer exists there.
 *
 * `currentCanonicalHash` mirrors what resolveAppRoute() returns TODAY for
 * that legacy hash — resolveAppRoute.test.js cross-checks this against the
 * live resolver, so this file can't silently drift out of sync with it.
 *
 * None of these hashes are rewritten in the address bar (no
 * pushState/replaceState) — "activated" means the *view* changed, not the
 * URL. A bookmarked `#proyectos` link keeps reading `#proyectos`; it just
 * opens the real Projects destination now instead of a dead Home anchor.
 */
export const LEGACY_HASH_ROADMAP = [
  {
    legacy: '#portada',
    currentCanonicalHash: HOME_HASH,
    futureCanonicalHash: HOME_HASH,
    destinationBuilt: true,
    gateStatus: 'activated', // trivially — #home IS the destination
    rationale: 'Hero/identity section — already the Home hub, no content move needed.',
  },
  {
    legacy: '#proyectos',
    currentCanonicalHash: PROJECTS_HASH,
    futureCanonicalHash: PROJECTS_HASH,
    destinationBuilt: true,
    gateStatus: 'activated', // ACTIVATED in Phase 2
    rationale:
      'Phase 1 built the #projects destination (components/ProjectsView.jsx) but kept the gate closed because Header\'s "Proyectos" link still scrolled within Home. Phase 2\'s Home Hub retires Projects as a Home section and rewires Header to point at #projects directly — there is no more "Home behavior" for this anchor to preserve, so it now resolves to the real Projects destination.',
  },
  {
    legacy: '#enfoque',
    currentCanonicalHash: ABOUT_HASH,
    futureCanonicalHash: ABOUT_HASH,
    destinationBuilt: true,
    gateStatus: 'activated', // ACTIVATED in Phase 2
    rationale:
      'Content audit (components/Approach.jsx, Phase 0/1): "Criterio de trabajo" is a working-methodology narrative, not a tools inventory — it belongs with About, which now renders it (components/About.jsx). Phase 2 retires Approach as a Home section, so the gate opens.',
  },
  {
    legacy: '#stack',
    currentCanonicalHash: DATA_BI_HASH,
    futureCanonicalHash: DATA_BI_HASH,
    destinationBuilt: true,
    gateStatus: 'activated', // ACTIVATED in Phase 2
    rationale:
      'Tools/capabilities inventory — the "qué sé hacer" pillar, now rendered in full by the Data & BI destination (components/DataBI.jsx). Phase 2 retires the full Stack section from Home (Home\'s toolkit strip shows only 5 items and links here), so the gate opens.',
  },
  {
    legacy: '#formacion',
    currentCanonicalHash: ABOUT_HASH,
    futureCanonicalHash: ABOUT_HASH,
    destinationBuilt: true,
    gateStatus: 'activated', // ACTIVATED in Phase 2
    rationale:
      'Education / learning-in-progress record — biographical, now rendered by the About destination (components/LearningRecord.jsx, shared with Stack.jsx). Phase 2 retires it from Home entirely, so the gate opens.',
  },
  {
    legacy: '#contacto',
    currentCanonicalHash: CONTACT_HASH,
    futureCanonicalHash: CONTACT_HASH,
    destinationBuilt: true,
    gateStatus: 'activated', // activated back in Phase 1
    rationale:
      'Activated in Phase 1: #contacto and #contact both open the standalone Contact destination. Phase 2 also retires the old full Contact section from Home (replaced by the compact availability strip), so this stays activated for the same reason as the others.',
  },
  {
    legacy: '#engineering-log',
    currentCanonicalHash: '#casework/no-show',
    futureCanonicalHash: '#casework/no-show',
    destinationBuilt: true,
    gateStatus: 'activated', // already was, since before Phase 0
    rationale: 'Historical alias explicitly required to survive indefinitely — not a migration, permanent.',
  },
]

/** Every legacy hash this roadmap documents. */
export const ROADMAP_LEGACY_HASHES = LEGACY_HASH_ROADMAP.map((entry) => entry.legacy)

/** Every legacy hash resolveAppRoute.js currently recognizes as an alias (not counting #casework/* itself, which isn't a legacy hash). */
export const RESOLVER_LEGACY_HASHES = [...LEGACY_HOME_ANCHORS, LEGACY_CONTACT_ANCHOR, '#engineering-log']
