import { buildProjectCaseHash } from '../constants/links.js'

/**
 * Case studies — PLAN-FROZEN v1.1, sections 4–5 and 9 (F1).
 *
 * The canonical project -> case relationship. Plain data, no JSX and no
 * component imports, so the router can later resolve
 * `#projects/<project-id>/<case-slug>` (and the legacy `#casework/<slug>`
 * aliases) without pulling in any case component. Which React component
 * renders a case is a separate concern (casework/registry.js today,
 * casework/components.js with React.lazy in F6).
 *
 * Fields:
 *   projectId        owning project (projects/registry.js)
 *   slug             canonical case slug, unique within its project
 *   number           case number for the numbered Casework series ('01'–'05'),
 *                    null for an Evidence Case
 *   legacySlug       the slug the case has today under `#casework/<legacySlug>`
 *   legacyPrefixes   extra legacy hash prefixes that alias this case
 *                    ('#engineering-log' and '#engineering-log/*')
 *   i18nKey          key under `casework.cases.<i18nKey>` (i18n/messages/casework.js)
 *   system           system name used in titles / grouping (same as casework/registry.js meta.system)
 *   classification   'casework' | 'evidenceCase'
 *   sections         optional in-case sections reachable as `/<section>`
 *
 * Derived on load (never hand-written, so they cannot drift):
 *   canonicalHash          '#projects/<projectId>/<slug>'
 *   legacyHash             '#casework/<legacySlug>'
 *   canonicalSectionHashes { <section>: '#projects/<projectId>/<slug>/<section>' }
 *   legacySectionHashes    { <section>: '#casework/<legacySlug>/<section>' }
 *
 * A case study can exist for a hidden project (ALETHEIA during F1); whether
 * its project is publicly resolvable is the registry's call, not this file's.
 */

const RAW_CASE_STUDIES = [
  {
    projectId: 'paradigm',
    slug: 'no-show',
    number: '01',
    legacySlug: 'no-show',
    legacyPrefixes: ['#engineering-log'],
    i18nKey: 'noShow',
    system: 'Paradigm',
    classification: 'casework',
    sections: [],
  },
  {
    projectId: 'paradigm',
    slug: 'operational-risk',
    number: '02',
    legacySlug: 'operational-risk',
    legacyPrefixes: [],
    i18nKey: 'operationalRisk',
    system: 'Paradigm',
    classification: 'casework',
    sections: [],
  },
  {
    projectId: 'providentia',
    slug: 'demand-forecasting',
    number: '03',
    legacySlug: 'demand-forecasting',
    legacyPrefixes: [],
    i18nKey: 'demandForecasting',
    system: 'PROVIDENTIA',
    classification: 'casework',
    sections: [],
  },
  {
    projectId: 'providentia',
    slug: 'capacity-decision',
    number: '04',
    legacySlug: 'capacity-decision',
    legacyPrefixes: [],
    i18nKey: 'capacityDecision',
    system: 'PROVIDENTIA',
    classification: 'casework',
    sections: [],
  },
  {
    projectId: 'providentia',
    slug: 'policy-decision',
    number: '05',
    legacySlug: 'policy-decision',
    legacyPrefixes: [],
    i18nKey: 'policyDecision',
    system: 'PROVIDENTIA',
    classification: 'casework',
    sections: [],
  },
  {
    // Evidence Case, not Casework 01–05. Its legacy slug (`aletheia`) differs
    // from its canonical one (`evidence-case`) — the project id already says
    // ALETHEIA.
    projectId: 'aletheia',
    slug: 'evidence-case',
    number: null,
    legacySlug: 'aletheia',
    legacyPrefixes: [],
    i18nKey: 'aletheia',
    system: 'ALETHEIA',
    classification: 'evidenceCase',
    sections: ['research'],
  },
]

function toCaseStudy(raw) {
  const sectionPairs = raw.sections.map((section) => [
    section,
    buildProjectCaseHash(raw.projectId, raw.slug, section),
  ])
  const legacySectionPairs = raw.sections.map((section) => [section, `#casework/${raw.legacySlug}/${section}`])
  return Object.freeze({
    ...raw,
    sections: Object.freeze([...raw.sections]),
    legacyPrefixes: Object.freeze([...raw.legacyPrefixes]),
    canonicalHash: buildProjectCaseHash(raw.projectId, raw.slug),
    legacyHash: `#casework/${raw.legacySlug}`,
    canonicalSectionHashes: Object.freeze(Object.fromEntries(sectionPairs)),
    legacySectionHashes: Object.freeze(Object.fromEntries(legacySectionPairs)),
  })
}

export const CASE_STUDIES = Object.freeze(RAW_CASE_STUDIES.map(toCaseStudy))

export function listCaseStudies() {
  return CASE_STUDIES
}

export function getCaseStudiesForProject(projectId) {
  return CASE_STUDIES.filter((study) => study.projectId === projectId)
}

export function getCaseStudy(projectId, slug) {
  return CASE_STUDIES.find((study) => study.projectId === projectId && study.slug === slug) ?? null
}

/** Resolves today's `#casework/<legacySlug>` slug to its case study. */
export function getCaseStudyByLegacySlug(legacySlug) {
  return CASE_STUDIES.find((study) => study.legacySlug === legacySlug) ?? null
}

export function hasCaseSection(projectId, slug, section) {
  return getCaseStudy(projectId, slug)?.sections.includes(section) ?? false
}

/** Canonical hash for a case (and optionally one of its sections); null when it does not exist. */
export function getCaseStudyHash(projectId, slug, section = null) {
  const study = getCaseStudy(projectId, slug)
  if (!study) return null
  if (section == null) return study.canonicalHash
  return study.canonicalSectionHashes[section] ?? null
}
