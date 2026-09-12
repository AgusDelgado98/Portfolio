/**
 * ALETHEIA — frozen public claims for the portfolio publication layer.
 *
 * Research Foundation CLOSED / FROZEN (v1.0.0). Publication layer only:
 * SELECT / SIMPLIFY / VISUALIZE / EXPLAIN / PRESENT — no new claims.
 *
 * Chart payloads live in publication-charts.js (curated extract). Each chart
 * carries sourceArtifact / evidenceBasis / frozenClaim for provenance.
 */

import publicationCharts from './publication-charts.js'
import {
  CASEWORK_ALETHEIA_HASH,
  CASEWORK_ALETHEIA_RESEARCH_HASH,
} from '../../constants/links.js'

export { CASEWORK_ALETHEIA_RESEARCH_HASH }

/** Single numeric source of truth — labels live in i18n. */
export const ALETHEIA_METRICS = {
  sourceManifestRecords: 22,
  retrievedSources: 10,
  sourcesWithoutRaw: 12,
  rawSourceTrees: 10,
  standardizedSourceTrees: 7,
  statisticalObjects: 16,
  statisticalBreaks: 8,
  compatibilityRelationships: 8,
  /** Chart shows documented temporal-coverage subset (not all 22). */
  chartCoverageSources: 10,
  /** Chart shows selected IPC/EPH breaks (registry total is 8). */
  chartSelectedBreaks: 7,
}

export const ALETHEIA_RESIDUALS = {
  total: 36,
  resolved: 2,
  acceptedLimitation: 26,
  outOfScope: 8,
}

export const ALETHEIA_ACTIONABLE = {
  governance: 0,
  breakBridge: 0,
  compatibility: 0,
  provenanceSource: 0,
}

export const ALETHEIA_EVIDENCE = {
  meta: {
    system: 'ALETHEIA',
    classification: 'Evidence Case',
    primaryArea: 'Data & BI',
    status: 'CLOSED',
    researchFoundation: 'FROZEN',
    researchFoundationStatus: 'CLOSED / FROZEN',
    finalFreeze: 'VERIFIED',
    freezeDate: '2026-09-11',
    freezeTag: 'aletheia-research-foundation-v1.0.0',
    freezeCommit: '2da6a2b59cf08ef23b0fc68dce394b46626b5f12',
    freezeCommitShort: '2da6a2b',
    testCount: 749,
    subtestCount: 58577,
    failures: 0,
    skips: 0,
    openpyxlWarnings: 2,
  },
  metrics: ALETHEIA_METRICS,
  residuals: ALETHEIA_RESIDUALS,
  actionable: ALETHEIA_ACTIONABLE,
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
    outcomes: {
      sourceArtifact: 'closeout residual disposition (research-foundation freeze)',
      evidenceBasis:
        'Terminal residual inventory at freeze: RESOLVED / ACCEPTED_LIMITATION / OUT_OF_SCOPE',
      frozenClaim:
        '36 residual issues closed as governance dispositions; actionable open work is zero',
      total: ALETHEIA_RESIDUALS.total,
      counts: [
        { id: 'RESOLVED', count: ALETHEIA_RESIDUALS.resolved },
        { id: 'ACCEPTED_LIMITATION', count: ALETHEIA_RESIDUALS.acceptedLimitation },
        { id: 'OUT_OF_SCOPE', count: ALETHEIA_RESIDUALS.outOfScope },
      ],
    },
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

function formatThousands(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** Compact hero snapshot — max 4 recruiter-facing metrics. */
export function getAletheiaHeroSnapshot(evidence = ALETHEIA_EVIDENCE) {
  const { metrics, meta } = evidence
  return [
    { id: 'sources', value: metrics.sourceManifestRecords },
    { id: 'objects', value: metrics.statisticalObjects },
    { id: 'breaks', value: metrics.statisticalBreaks },
    { id: 'tests', value: meta.testCount },
  ].slice(0, 4)
}

/** Verification Block 6 fields from frozen meta. */
export function getAletheiaVerificationFields(evidence = ALETHEIA_EVIDENCE) {
  const { meta } = evidence
  return [
    { id: 'status', value: meta.researchFoundationStatus },
    { id: 'freezeTag', value: meta.freezeTag },
    { id: 'commitSha', value: meta.freezeCommitShort },
    { id: 'testCount', value: `${meta.testCount} passed` },
    { id: 'subtests', value: formatThousands(meta.subtestCount) },
    { id: 'failures', value: String(meta.failures) },
  ]
}

/** True when a chart payload has required provenance fields. */
export function chartHasProvenance(chart) {
  return Boolean(chart && chart.sourceArtifact && chart.evidenceBasis && chart.frozenClaim)
}

/** Public navigation hrefs used by ALETHEIA CTAs (must not be raw files). */
export function listPublicActionHrefs() {
  return [CASEWORK_ALETHEIA_HASH, CASEWORK_ALETHEIA_RESEARCH_HASH, '#data-bi']
}

export function formatAletheiaSubtests(n = ALETHEIA_EVIDENCE.meta.subtestCount) {
  return formatThousands(n)
}
