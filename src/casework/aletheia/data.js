/**
 * ALETHEIA — frozen public claims for the portfolio publication layer.
 *
 * Only SELECT / SIMPLIFY / VISUALIZE / EXPLAIN / PRESENT of already-frozen
 * material. No new sources, metrics, bridges, breaks, rulings, or economic claims.
 *
 * Unfrozen closeout fields stay null — never invent; UI must not render nulls.
 *
 * Chart payloads live in publication-charts.js (curated extract from the
 * ALETHEIA research foundation). Each chart carries sourceArtifact /
 * evidenceBasis / frozenClaim for provenance.
 */

import publicationCharts from './publication-charts.js'
import {
  CASEWORK_ALETHEIA_HASH,
  CASEWORK_ALETHEIA_RESEARCH_HASH,
} from '../../constants/links.js'

export { CASEWORK_ALETHEIA_RESEARCH_HASH }

export const ALETHEIA_EVIDENCE = {
  meta: {
    system: 'ALETHEIA',
    classification: 'Evidence Case',
    primaryArea: 'Data & BI',
    researchFoundationStatus: 'CLOSED / RESEARCH FOUNDATION FROZEN',
    /** Filled after ALETHEIA final closeout — null until then. */
    freezeDate: null,
    commitSha: null,
    testCount: null,
    provenanceHashes: null,
  },
  pipeline: [
    { id: 'raw', technical: 'RAW' },
    { id: 'provenance', technical: 'Provenance' },
    { id: 'objects', technical: 'Statistical Objects' },
    { id: 'breaks', technical: 'Breaks' },
    { id: 'compatibility', technical: 'Compatibility' },
    { id: 'evidence', technical: 'Evidence' },
    { id: 'rulings', technical: 'Rulings' },
  ],
  gov002: {
    id: 'GOV-002',
    ruling: 'ENERGIA × SEPA = DESCRIPTIVE_ONLY',
    rulingPublic: 'DESCRIPTIVE ONLY',
    quoteVsIndex: 'PRICE_QUOTE != PRICE_INDEX',
    sharedObject: 'PRICE_QUOTE',
    establishmentObject: 'ESTABLISHMENT + PRICE_QUOTE',
    sources: ['ENERGIA', 'SEPA'],
    compareRows: [
      { id: 'products' },
      { id: 'establishment' },
      { id: 'capture' },
      { id: 'universe' },
    ],
    restrictions: [
      'NO DIRECT POOLING',
      'NO COMMON PRICE LEVEL',
      'NO ALTERNATIVE CPI',
      'NO TRANSACTION-PRICE CLAIM',
      'NO NATIONAL/REPRESENTATIVE COVERAGE CLAIM',
    ],
  },
  ipc: {
    id: 'IPC',
    refusal: 'NO AUTOMATIC SPLICE',
  },
  eph: {
    id: 'EPH',
    changeDimensions: ['questionnaire', 'coverage', 'classification', 'measurement', 'population'],
  },
  selectedCases: [
    { id: 'gov002', code: 'GOV-002' },
    { id: 'ipc', code: 'IPC' },
    { id: 'eph', code: 'EPH' },
  ],
  refusals: [
    { id: 'directPooling', technical: 'NO DIRECT POOLING' },
    { id: 'automaticSplice', technical: 'NO AUTOMATIC SPLICE' },
    { id: 'alternativeCpi', technical: 'NO ALTERNATIVE CPI' },
    { id: 'claimWithoutEvidence', technical: 'NO CLAIM WITHOUT EVIDENCE' },
    { id: 'representativeClaim', technical: 'NO REPRESENTATIVE CLAIM WITHOUT SUPPORT' },
  ],
  supportTaxonomy: [
    { id: 'SUPPORTED', examples: [] },
    { id: 'PARTIALLY_SUPPORTED', examples: [] },
    { id: 'ACCEPTED_LIMITATION', examples: [] },
    { id: 'OUT_OF_SCOPE', examples: [] },
  ],
  findings: [],
  /** Modal content — publication paraphrase of frozen GOV-002, not new analysis. */
  rulings: {
    gov002: {
      code: 'GOV-002',
      status: 'DESCRIPTIVE ONLY',
      restrictions: [
        'NO DIRECT POOLING',
        'NO COMMON PRICE LEVEL',
        'NO ALTERNATIVE CPI',
        'NO TRANSACTION-PRICE CLAIM',
        'NO NATIONAL/REPRESENTATIVE COVERAGE CLAIM',
      ],
      provenance: 'GOV-002 / ENERGIA × SEPA = DESCRIPTIVE_ONLY · PRICE_QUOTE != PRICE_INDEX',
    },
  },
  charts: {
    sourceCoverage: publicationCharts.sourceCoverage,
    breakTimeline: publicationCharts.breakTimeline,
    compatibilityMatrix: publicationCharts.compatibilityMatrix,
    /** null until closeout freezes outcome counts — component stays hidden. */
    outcomes: publicationCharts.outcomes,
  },
  researchArtifacts: [
    {
      id: 'source-manifest',
      label: 'Source Manifest',
      role: 'Documented coverage windows for audited public sources',
    },
    {
      id: 'break-registry',
      label: 'Statistical Break Registry',
      role: 'Ruled IPC / EPH methodological breaks',
    },
    {
      id: 'compat-matrix',
      label: 'Metric Compatibility Matrix',
      role: 'Object-to-object compatibility dispositions',
    },
    {
      id: 'gov002',
      label: 'GOV-002',
      role: 'Price-quote descriptive-only ruling',
    },
  ],
}

/** Non-null hero snapshot metrics only — empty array if nothing is frozen yet. */
export function getAletheiaHeroSnapshot(meta = ALETHEIA_EVIDENCE.meta) {
  const items = []
  if (meta.testCount != null) items.push({ id: 'tests', value: meta.testCount })
  if (meta.freezeDate) items.push({ id: 'freeze', value: meta.freezeDate })
  if (meta.commitSha) items.push({ id: 'commit', value: meta.commitSha })
  if (meta.provenanceHashes) items.push({ id: 'provenance', value: meta.provenanceHashes })
  return items.slice(0, 4)
}

/** Non-null verification fields for Block 6 — null → omit. */
export function getAletheiaVerificationFields(meta = ALETHEIA_EVIDENCE.meta) {
  const fields = []
  if (meta.freezeDate) fields.push({ id: 'freezeDate', value: meta.freezeDate })
  if (meta.commitSha) fields.push({ id: 'commitSha', value: meta.commitSha })
  if (meta.testCount != null) fields.push({ id: 'testCount', value: String(meta.testCount) })
  if (meta.provenanceHashes) fields.push({ id: 'provenance', value: meta.provenanceHashes })
  return fields
}

/** True when a chart payload has required provenance fields. */
export function chartHasProvenance(chart) {
  return Boolean(chart && chart.sourceArtifact && chart.evidenceBasis && chart.frozenClaim)
}

/** Public navigation hrefs used by ALETHEIA CTAs (must not be raw files). */
export function listPublicActionHrefs() {
  return [CASEWORK_ALETHEIA_HASH, CASEWORK_ALETHEIA_RESEARCH_HASH, '#data-bi']
}
