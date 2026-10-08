import { CASE_STUDIES } from '../projects/caseStudies.js'
import { HOME_HASH, PROJECTS_HASH, CONTACT_HASH, aboutSectionHash } from './hashes.js'

/**
 * Legacy hash aliases — PLAN-FROZEN v1.1, section 5 (F2).
 *
 * The single place that records where every legacy hash now points. Every one
 * of them keeps working forever AND is normalized in the address bar: when the
 * app is opened (or navigated) with a legacy hash, the resolver returns the
 * canonical route and App.jsx replaces the URL with `canonicalHash` using
 * `history.replaceState` — no extra history entry (see router/normalizeHash.js).
 * This replaces the pre-F2 contract, under which aliases were never rewritten.
 * The public site therefore stops propagating the old architecture while old
 * bookmarks, LinkedIn posts and READMEs keep opening the right page.
 *
 * Two families:
 *
 *  - STATIC aliases (the old Home anchors and the retired destinations). Each
 *    maps to ONE canonical hash. Data & BI and Operations folded into About, so
 *    they land on its sections.
 *
 *  - CASE aliases (`#casework/<slug>[/<section>]` and `#engineering-log[/…]`).
 *    Derived from projects/caseStudies.js — the canonical project -> case
 *    relationship — never hand-listed here, so they cannot drift from it.
 *
 * Plain data (no JSX), so the resolver and the tests can both import it.
 */

export const STATIC_LEGACY_ALIASES = Object.freeze([
  { legacy: '#portada', canonicalHash: HOME_HASH, rationale: 'Old Home cover anchor.' },
  { legacy: '#proyectos', canonicalHash: PROJECTS_HASH, rationale: 'Old Projects anchor.' },
  { legacy: '#contacto', canonicalHash: CONTACT_HASH, rationale: 'Old Contact anchor.' },
  {
    legacy: '#enfoque',
    canonicalHash: aboutSectionHash('method'),
    rationale: 'Working-methodology narrative — lives in About.',
  },
  {
    legacy: '#stack',
    canonicalHash: aboutSectionHash('skills'),
    rationale: 'Tools / capabilities inventory — lives in About (Data & BI content).',
  },
  {
    legacy: '#data-bi',
    canonicalHash: aboutSectionHash('skills'),
    rationale: 'The Data & BI destination folded into About (skills).',
  },
  {
    legacy: '#formacion',
    canonicalHash: aboutSectionHash('education'),
    rationale: 'Education / learning record — lives in About.',
  },
  {
    legacy: '#operations',
    canonicalHash: aboutSectionHash('experience'),
    rationale: 'The Administrative & Operations destination folded into About (experience).',
  },
  {
    legacy: '#casework',
    canonicalHash: PROJECTS_HASH,
    rationale: 'The Casework index disappeared; cases live under their projects.',
  },
  {
    legacy: '#casework/archive',
    canonicalHash: PROJECTS_HASH,
    rationale: 'The secondary Casework archive (main, Sep 2026) disappeared with the Casework index; its five cases live under their projects.',
  },
])

/** Every exact legacy hash for the case studies, derived from caseStudies.js. */
function buildCaseAliases() {
  const entries = []
  for (const study of CASE_STUDIES) {
    entries.push({ legacy: study.legacyHash, canonicalHash: study.canonicalHash, kind: 'exact' })
    for (const section of study.sections) {
      entries.push({
        legacy: study.legacySectionHashes[section],
        canonicalHash: study.canonicalSectionHashes[section],
        kind: 'exact',
      })
    }
    for (const prefix of study.legacyPrefixes) {
      // Prefix aliases: `#engineering-log` and `#engineering-log/<anything>`.
      entries.push({ legacy: prefix, canonicalHash: study.canonicalHash, kind: 'prefix' })
    }
  }
  return entries
}

export const CASE_LEGACY_ALIASES = Object.freeze(buildCaseAliases())

/** Exact-match lookup: legacy hash -> canonical hash. */
export const LEGACY_EXACT_ALIASES = Object.freeze(
  new Map([
    ...STATIC_LEGACY_ALIASES.map((entry) => [entry.legacy, entry.canonicalHash]),
    ...CASE_LEGACY_ALIASES.filter((entry) => entry.kind === 'exact').map((entry) => [
      entry.legacy,
      entry.canonicalHash,
    ]),
  ]),
)

/** Prefix aliases: [prefix, canonicalHash] — matches `prefix` and `prefix/<anything>`. */
export const LEGACY_PREFIX_ALIASES = Object.freeze(
  CASE_LEGACY_ALIASES.filter((entry) => entry.kind === 'prefix').map((entry) => [
    entry.legacy,
    entry.canonicalHash,
  ]),
)

/**
 * Families of legacy URLs whose members are recognised by shape: a hash that
 * starts with one of these but matches no alias above is a malformed legacy
 * URL and falls back to Home (same safe behavior the old contract had for an
 * unknown `#casework/<slug>`).
 */
export const LEGACY_FAMILY_BASES = Object.freeze(['#casework'])

/** Every legacy hash this module documents, for tests and docs. */
export const ALL_LEGACY_HASHES = Object.freeze([
  ...STATIC_LEGACY_ALIASES.map((entry) => entry.legacy),
  ...CASE_LEGACY_ALIASES.map((entry) => entry.legacy),
])
