import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { translations } from '../translations.js'
import {
  ALETHEIA_EVIDENCE,
  CASEWORK_ALETHEIA_RESEARCH_HASH,
  chartHasProvenance,
  getAletheiaHeroSnapshot,
  getAletheiaVerificationFields,
  listPublicActionHrefs,
} from '../../casework/aletheia/data.js'
import { CASEWORK_ALETHEIA_HASH, ALETHEIA_EVIDENCE_BASE } from '../../constants/links.js'
import { resolveAppRoute } from '../../router/resolveAppRoute.js'

const es = translations.es.aletheia
const en = translations.en.aletheia
const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const pageSrc = readFileSync(join(root, 'casework/aletheia/Aletheia.jsx'), 'utf8')

test('aletheia hero: short titles + Evidence Case · ALETHEIA eyebrow', () => {
  assert.equal(es.hero.eyebrow, 'EVIDENCE CASE · ALETHEIA')
  assert.equal(en.hero.eyebrow, 'EVIDENCE CASE · ALETHEIA')
  assert.equal(es.hero.title, 'Qué datos públicos se pueden comparar')
  assert.equal(en.hero.title, 'Which public datasets can actually be compared')
})

test('aletheia technical details: bilingual disclosure labels', () => {
  assert.equal(es.actions.technicalDetails, 'Detalles técnicos')
  assert.equal(en.actions.technicalDetails, 'Technical details')
  assert.ok(es.verification.techFlow && en.verification.techFlow)
  assert.ok(es.verification.techArtifacts && en.verification.techArtifacts)
})

test('aletheia technical details: disclosure in page; hidden by default; aria-expanded wired', () => {
  assert.match(pageSrc, /VerificationTechnicalDetails|aletheia-tech-disclosure/)
  assert.match(pageSrc, /aria-expanded=\{expanded\}/)
  assert.ok(!/<details[^>]*\sopen[\s>]/.test(pageSrc), 'technical details stay collapsed by default')
  assert.ok(!/openTechnicalDetails/.test(pageSrc), 'broken CTA handler removed')
  assert.ok(
    !/atlas-access[^>]*>\s*\n?\s*<span>\{\s*t\('aletheia\.actions\.technicalDetails'\)/.test(pageSrc),
    'technical details is disclosure, not a nav button CTA',
  )
})

test('aletheia charts: evidence-basis public labels + provenance fields', () => {
  assert.equal(es.charts.coverage.basis, 'Source Manifest')
  assert.equal(en.charts.breaks.basis, 'Statistical Break Registry')
  assert.equal(es.charts.compat.basis, 'Metric Compatibility Matrix')
  assert.equal(es.charts.evidenceBasisPrefix, 'Base de evidencia')
  assert.equal(en.charts.evidenceBasisPrefix, 'Evidence basis')
  assert.equal(chartHasProvenance(ALETHEIA_EVIDENCE.charts.sourceCoverage), true)
  assert.equal(chartHasProvenance(ALETHEIA_EVIDENCE.charts.breakTimeline), true)
  assert.equal(chartHasProvenance(ALETHEIA_EVIDENCE.charts.compatibilityMatrix), true)
  assert.equal(ALETHEIA_EVIDENCE.charts.outcomes, null)
})

test('aletheia UX: no raw-file hrefs; ruling modal + research route preserved', () => {
  const hrefs = listPublicActionHrefs()
  assert.ok(hrefs.includes(CASEWORK_ALETHEIA_HASH))
  assert.ok(hrefs.includes(CASEWORK_ALETHEIA_RESEARCH_HASH))
  for (const href of hrefs) {
    assert.ok(!/\.(md|json|txt|csv)(\?|#|$)/i.test(href))
  }
  assert.ok(!hrefs.some((h) => h.startsWith(ALETHEIA_EVIDENCE_BASE)))
  assert.ok(!pageSrc.includes(`${ALETHEIA_EVIDENCE_BASE}/`))
  assert.ok(!/\.md['"`]/.test(pageSrc))
  assert.match(pageSrc, /RulingModal/)
  assert.match(pageSrc, /setOpenRuling\('gov002'\)/)
  assert.match(pageSrc, /CASEWORK_ALETHEIA_RESEARCH_HASH/)

  const resolve = (hash) => resolveAppRoute(hash, { hasCaseworkCase: (slug) => slug === 'aletheia' })
  const research = resolve('#casework/aletheia/research')
  assert.equal(research.view, 'casework-detail')
  assert.equal(research.params.caseSection, 'research')
  assert.equal(research.canonicalHash, '#casework/aletheia/research')
})

test('aletheia data: GOV-002 semantics preserved; null outcomes stay hidden', () => {
  assert.equal(ALETHEIA_EVIDENCE.gov002.ruling, 'ENERGIA × SEPA = DESCRIPTIVE_ONLY')
  assert.deepEqual(getAletheiaHeroSnapshot(ALETHEIA_EVIDENCE.meta), [])
  assert.deepEqual(getAletheiaVerificationFields(ALETHEIA_EVIDENCE.meta), [])
  assert.equal(ALETHEIA_EVIDENCE.findings.length, 0)
})

test('aletheia i18n: neutral framing + six stages + ES/EN parity', () => {
  assert.match(es.neutralFraming, /no evalúa si una cifra oficial es correcta/i)
  assert.match(en.neutralFraming, /does not evaluate whether an official figure is correct/i)
  const keys = ['problem', 'method', 'cases', 'refusals', 'support', 'verification']
  assert.deepEqual(Object.keys(es.stages).sort(), [...keys].sort())
  assert.deepEqual(Object.keys(en.stages).sort(), [...keys].sort())
  const blob = JSON.stringify(es) + JSON.stringify(en)
  assert.ok(!/pending freeze|pendiente de freeze|coming soon|will be published after/i.test(blob))
})

test('dataBi.aletheia card still present bilingually', () => {
  assert.equal(translations.es.dataBi.aletheia.name, 'ALETHEIA')
  assert.equal(translations.en.dataBi.aletheia.cta, 'Explore the case')
})
