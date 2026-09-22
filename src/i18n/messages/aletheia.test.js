import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { translations } from '../translations.js'
import {
  ALETHEIA_ACTIONABLE,
  ALETHEIA_EVIDENCE,
  ALETHEIA_METRICS,
  ALETHEIA_RESIDUALS,
  CASEWORK_ALETHEIA_RESEARCH_HASH,
  chartHasProvenance,
  getAletheiaHeroSnapshot,
  getAletheiaVerificationFields,
  listPublicActionHrefs,
} from '../../casework/aletheia/data.js'
import {
  CASEWORK_ALETHEIA_HASH,
  ALETHEIA_EVIDENCE_BASE,
  ALETHEIA_REPO_URL,
  ALETHEIA_WEB_URL,
} from '../../constants/links.js'
import { resolveAppRoute } from '../../router/resolveAppRoute.js'

const es = translations.es.aletheia
const en = translations.en.aletheia
const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const pageSrc = readFileSync(join(root, 'casework/aletheia/Aletheia.jsx'), 'utf8')
const researchSrc = readFileSync(join(root, 'casework/aletheia/AletheiaResearch.jsx'), 'utf8')

test('aletheia hero: short titles + Evidence Case · ALETHEIA eyebrow', () => {
  assert.equal(es.hero.eyebrow, 'EVIDENCE CASE · ALETHEIA')
  assert.equal(en.hero.eyebrow, 'EVIDENCE CASE · ALETHEIA')
  assert.equal(es.hero.title, 'Qué datos públicos se pueden comparar')
  assert.equal(en.hero.title, 'Which public datasets can actually be compared')
})

test('aletheia freeze status: CLOSED / FROZEN with canonical tag + commit', () => {
  assert.equal(ALETHEIA_EVIDENCE.meta.status, 'CLOSED')
  assert.equal(ALETHEIA_EVIDENCE.meta.researchFoundation, 'FROZEN')
  assert.equal(ALETHEIA_EVIDENCE.meta.researchFoundationStatus, 'CLOSED / FROZEN')
  assert.equal(ALETHEIA_EVIDENCE.meta.finalFreeze, 'VERIFIED')
  assert.equal(ALETHEIA_EVIDENCE.meta.freezeTag, 'aletheia-research-foundation-v1.0.0')
  assert.equal(
    ALETHEIA_EVIDENCE.meta.freezeCommit,
    '2da6a2b59cf08ef23b0fc68dce394b46626b5f12',
  )
  assert.equal(ALETHEIA_EVIDENCE.meta.freezeCommitShort, '2da6a2b')
  assert.equal(es.hero.freezeStatus, 'Research Foundation · Congelada')
  assert.equal(en.hero.freezeStatus, 'Research Foundation · Frozen')
  assert.match(pageSrc, /aletheia\.hero\.freezeStatus/)
})

test('aletheia final metrics: single numeric source of truth', () => {
  assert.equal(ALETHEIA_METRICS.sourceManifestRecords, 22)
  assert.equal(ALETHEIA_METRICS.statisticalObjects, 16)
  assert.equal(ALETHEIA_METRICS.statisticalBreaks, 8)
  assert.equal(ALETHEIA_METRICS.compatibilityRelationships, 8)
  assert.equal(ALETHEIA_EVIDENCE.meta.testCount, 749)
  assert.equal(ALETHEIA_EVIDENCE.meta.subtestCount, 58577)
  assert.equal(ALETHEIA_RESIDUALS.total, 36)
  assert.equal(ALETHEIA_RESIDUALS.resolved, 2)
  assert.equal(ALETHEIA_RESIDUALS.acceptedLimitation, 26)
  assert.equal(ALETHEIA_RESIDUALS.outOfScope, 8)
  assert.equal(ALETHEIA_ACTIONABLE.governance, 0)
  assert.equal(ALETHEIA_ACTIONABLE.breakBridge, 0)
  assert.equal(ALETHEIA_ACTIONABLE.compatibility, 0)
  assert.equal(ALETHEIA_ACTIONABLE.provenanceSource, 0)
})

test('aletheia hero snapshot: 4 recruiter metrics from frozen data', () => {
  const snap = getAletheiaHeroSnapshot(ALETHEIA_EVIDENCE)
  assert.equal(snap.length, 4)
  assert.deepEqual(
    snap.map((item) => item.id),
    ['sources', 'objects', 'breaks', 'tests'],
  )
  assert.deepEqual(
    snap.map((item) => item.value),
    [22, 16, 8, 749],
  )
  assert.ok(!snap.some((item) => String(item.value).includes('58577')))
})

test('aletheia verification fields: freeze tag, short commit, suite', () => {
  const fields = Object.fromEntries(
    getAletheiaVerificationFields(ALETHEIA_EVIDENCE).map((f) => [f.id, f.value]),
  )
  assert.equal(fields.status, 'CLOSED / FROZEN')
  assert.equal(fields.freezeTag, 'aletheia-research-foundation-v1.0.0')
  assert.equal(fields.commitSha, '2da6a2b')
  assert.equal(fields.testCount, '749 passed')
  assert.equal(fields.subtests, '58,577')
  assert.equal(fields.failures, '0')
})

test('aletheia residuals / outcomes chart populated', () => {
  const outcomes = ALETHEIA_EVIDENCE.charts.outcomes
  assert.ok(outcomes)
  assert.equal(outcomes.total, 36)
  assert.deepEqual(
    outcomes.counts.map((row) => [row.id, row.count]),
    [
      ['RESOLVED', 2],
      ['ACCEPTED_LIMITATION', 26],
      ['OUT_OF_SCOPE', 8],
    ],
  )
  assert.equal(chartHasProvenance(outcomes), true)
})

test('aletheia technical details: bilingual disclosure labels', () => {
  assert.equal(es.actions.technicalDetails, 'Detalles técnicos')
  assert.equal(en.actions.technicalDetails, 'Technical details')
  assert.ok(es.verification.techFreeze && en.verification.techFreeze)
  assert.ok(es.verification.techWarnings.includes('openpyxl'))
  assert.ok(en.verification.techWarnings.includes('openpyxl'))
})

test('aletheia technical details: disclosure in page; hidden by default; aria-expanded wired', () => {
  assert.match(pageSrc, /VerificationTechnicalDetails|aletheia-tech-disclosure/)
  assert.match(pageSrc, /aria-expanded=\{expanded\}/)
  assert.ok(!/<details[^>]*\sopen[\s>]/.test(pageSrc), 'technical details stay collapsed by default')
  assert.ok(!/openTechnicalDetails/.test(pageSrc), 'broken CTA handler removed')
})

test('aletheia charts: evidence-basis + scope labels without count mismatch', () => {
  assert.equal(es.charts.coverage.basis, 'Source Manifest')
  assert.equal(en.charts.breaks.basis, 'Statistical Break Registry')
  assert.equal(es.charts.compat.basis, 'Metric Compatibility Matrix')
  assert.match(es.charts.coverage.scope, /\{shown\}/)
  assert.match(en.charts.breaks.scope, /\{total\}/)
  assert.match(es.charts.compat.scope, /\{total\}/)
  assert.equal(ALETHEIA_METRICS.chartCoverageSources, 10)
  assert.equal(ALETHEIA_METRICS.chartSelectedBreaks, 7)
  assert.equal(ALETHEIA_EVIDENCE.charts.sourceCoverage.sources.length, 10)
  assert.equal(ALETHEIA_EVIDENCE.charts.breakTimeline.events.length, 7)
  assert.equal(ALETHEIA_EVIDENCE.charts.compatibilityMatrix.full.length, 8)
  assert.equal(chartHasProvenance(ALETHEIA_EVIDENCE.charts.sourceCoverage), true)
  assert.equal(chartHasProvenance(ALETHEIA_EVIDENCE.charts.breakTimeline), true)
  assert.equal(chartHasProvenance(ALETHEIA_EVIDENCE.charts.compatibilityMatrix), true)
})

test('aletheia UX: no raw-file hrefs; ruling modal + research route; github hidden when null', () => {
  const hrefs = listPublicActionHrefs()
  assert.ok(hrefs.includes(CASEWORK_ALETHEIA_HASH))
  assert.ok(hrefs.includes(CASEWORK_ALETHEIA_RESEARCH_HASH))
  for (const href of hrefs) {
    assert.ok(!/\.(md|json|txt|csv)(\?|#|$)/i.test(href))
  }
  assert.ok(!hrefs.some((h) => h.startsWith(ALETHEIA_EVIDENCE_BASE)))
  assert.match(pageSrc, /RulingModal/)
  assert.match(pageSrc, /setOpenRuling\('gov002'\)/)
  assert.match(pageSrc, /CASEWORK_ALETHEIA_RESEARCH_HASH/)
  assert.equal(ALETHEIA_REPO_URL, null)
  assert.equal(ALETHEIA_WEB_URL, 'https://aletheia-web-seven.vercel.app/')
  assert.match(pageSrc, /ALETHEIA_WEB_URL/)
  assert.match(pageSrc, /ALETHEIA_REPO_URL \?/)

  const resolve = (hash) => resolveAppRoute(hash, { hasCaseworkCase: (slug) => slug === 'aletheia' })
  const research = resolve('#casework/aletheia/research')
  assert.equal(research.view, 'casework-detail')
  assert.equal(research.params.caseSection, 'research')
  assert.equal(research.canonicalHash, '#casework/aletheia/research')
})

test('aletheia data: GOV-002 semantics unchanged', () => {
  assert.equal(ALETHEIA_EVIDENCE.gov002.ruling, 'ENERGIA × SEPA = DESCRIPTIVE_ONLY')
  assert.equal(ALETHEIA_EVIDENCE.gov002.quoteVsIndex, 'PRICE_QUOTE != PRICE_INDEX')
  assert.equal(ALETHEIA_EVIDENCE.gov002.establishmentObject, 'ESTABLISHMENT + PRICE_QUOTE')
  assert.deepEqual(ALETHEIA_EVIDENCE.gov002.sources, ['ENERGIA', 'SEPA'])
})

test('aletheia full research: final closure header + sections', () => {
  assert.equal(es.research.version, 'Research Foundation v1.0.0')
  assert.equal(en.research.version, 'Research Foundation v1.0.0')
  assert.match(researchSrc, /aletheia-research-closeout/)
  assert.match(researchSrc, /aletheia-research-finalVerification/)
  assert.match(researchSrc, /aletheia-research-finalFreeze/)
  assert.match(researchSrc, /researchFoundationStatus/)
  for (const key of Object.keys(es.research.toc)) {
    assert.equal(typeof en.research.toc[key], 'string')
  }
})

test('aletheia i18n: neutral framing + six stages + ES/EN parity + no pending copy', () => {
  assert.match(es.neutralFraming, /no evalúa si una cifra oficial es correcta/i)
  assert.match(en.neutralFraming, /does not evaluate whether an official figure is correct/i)
  const keys = ['problem', 'method', 'cases', 'refusals', 'support', 'verification']
  assert.deepEqual(Object.keys(es.stages).sort(), [...keys].sort())
  assert.deepEqual(Object.keys(en.stages).sort(), [...keys].sort())
  const blob = JSON.stringify(es) + JSON.stringify(en) + JSON.stringify(ALETHEIA_EVIDENCE)
  assert.ok(!/pending freeze|pendiente de freeze|coming soon|will be published after|final values pending|to be completed/i.test(blob))
  assert.ok(!/\b27\b/.test(JSON.stringify(ALETHEIA_RESIDUALS)))
  assert.ok(!blob.includes('2 / 27 / 7'))
})

test('dataBi.aletheia card still present bilingually', () => {
  assert.equal(translations.es.dataBi.aletheia.name, 'ALETHEIA')
  assert.equal(translations.es.dataBi.aletheia.liveCta, 'Abrir ALETHEIA')
  assert.equal(translations.en.dataBi.aletheia.liveCta, 'Open ALETHEIA')
  assert.equal(translations.en.dataBi.aletheia.cta, 'Explore the case')
})
