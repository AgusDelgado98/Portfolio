import test from 'node:test'
import assert from 'node:assert/strict'

import { pickProjectCopy } from './projects.js'
import { translations } from '../translations.js'

/**
 * Phase 5 (PROVIDENTIA PDI + Case 05) — content-integrity tests.
 *
 * Guards the two things this phase is strictest about: stale P7-era claims
 * (164 tests, bare "P0–P7" framed as the whole project, "MVP scientifically
 * valid" as the final word) must not linger once the PDI extension is
 * current state, and the Power BI / `.pbix` caveat must never silently
 * become a claim of a finished, validated dashboard.
 */

const providentiaEs = pickProjectCopy('providentia', 'es')
const providentiaEn = pickProjectCopy('providentia', 'en')

test('PROVIDENTIA copy: the stale "164/164 tests" claim is gone (superseded by PDI-7\'s 220)', () => {
  for (const copy of [providentiaEs, providentiaEn]) {
    const blob = JSON.stringify(copy)
    assert.ok(!/164\s*\/\s*164/.test(blob), 'stale 164/164 claim still present')
    assert.ok(!/\(164 tests\)/.test(blob), 'stale "(164 tests)" artifact label still present')
  }
})

test('PROVIDENTIA copy: no unconfirmed test count is claimed (220/220 stays out until it is confirmed)', () => {
  for (const copy of [providentiaEs, providentiaEn]) {
    const blob = JSON.stringify(copy)
    assert.ok(!/220/.test(blob), 'an unconfirmed test count is claimed')
  }
})

test('PROVIDENTIA copy: referrals are not appointments, and the final-period results say where they come from', () => {
  const es = JSON.stringify(providentiaEs)
  const en = JSON.stringify(providentiaEn)
  assert.match(es, /derivación no es una cita atendida|derivación no equivale a una cita atendida/)
  assert.match(en, /referral is not an attended appointment/)
  assert.ok(!/lockbox/i.test(es + en), 'internal "lockbox" wording on a public page')
  for (const copy of [providentiaEs, providentiaEn]) {
    const groups = copy.detail.result.groups.map((group) => group.title).join(' ')
    assert.match(groups, /período final|final evaluation period|final period/i)
    assert.match(copy.detail.demo, /StatsWales/)
  }
})

test('PROVIDENTIA copy: never claims a finished/validated Power BI dashboard or a fabricated .pbix', () => {
  for (const copy of [providentiaEs, providentiaEn]) {
    const blob = JSON.stringify(copy)
    assert.ok(!/\.pbix/i.test(blob) || /pending|pendiente/i.test(blob), '.pbix mentioned without a pending caveat nearby')
    assert.ok(!/dashboard\s+(finalizado|completado|terminado|finished|completed)/i.test(blob))
  }
})

test('PROVIDENTIA copy: Power BI status names "pending"/"pendiente" wherever Power BI is mentioned as a deliverable', () => {
  for (const copy of [providentiaEs, providentiaEn]) {
    if (/Power BI:/i.test(JSON.stringify(copy))) {
      const blob = JSON.stringify(copy)
      assert.ok(/pending|pendiente/i.test(blob), 'Power BI status block present without a pending caveat')
    }
  }
})

test('PROVIDENTIA copy: mentions the policy-evaluation extension and Case 05 (not just the base case)', () => {
  for (const copy of [providentiaEs, providentiaEn]) {
    const blob = JSON.stringify(copy)
    assert.ok(/extensión de evaluación de políticas|policy-evaluation extension/i.test(blob), 'extension missing')
    assert.ok(/Caso 05|Case 05/.test(blob), 'Case 05 missing')
  }
})

// --- policyDecision i18n (Case 05) — ES/EN parity -------------------------

test('policyDecision: same stage keys in ES and EN', () => {
  const esStages = Object.keys(translations.es.policyDecision.stages).sort()
  const enStages = Object.keys(translations.en.policyDecision.stages).sort()
  assert.deepEqual(esStages, enStages)
  assert.deepEqual(esStages, [
    'analyticalDesign', 'bootstrap', 'decisionProblem', 'evaluationGrid',
    'outcome', 'policyComparison', 'powerBi', 'predictiveVsDecision',
  ].sort())
})

test('policyDecision: Power BI stage explicitly states the pending caveat in both languages', () => {
  assert.match(translations.es.policyDecision.stages.powerBi.fast, /PENDIENTE/i)
  assert.match(translations.en.policyDecision.stages.powerBi.fast, /PENDING/i)
})

test('policyDecision: hero status names PDI-7 and the Power BI pending caveat in both languages', () => {
  for (const lang of ['es', 'en']) {
    const status = translations[lang].policyDecision.hero.status
    assert.match(status, /PDI-7/)
    assert.match(status, /PENDING|PENDIENTE/i)
  }
})

test('policyDecision: case card title/tags exist bilingually in the casework index', () => {
  for (const lang of ['es', 'en']) {
    const entry = translations[lang].casework.cases.policyDecision
    assert.ok(entry?.title)
    assert.ok(Array.isArray(entry?.tags) && entry.tags.length > 0)
  }
})
