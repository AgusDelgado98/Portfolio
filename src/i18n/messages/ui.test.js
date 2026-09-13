import test from 'node:test'
import assert from 'node:assert/strict'

import { translations } from '../translations.js'

/**
 * Phase 3 (Professional Views Refinement) — i18n content-integrity tests.
 *
 * These guard the two kinds of mistakes that are easy to make silently
 * when hand-editing bilingual copy: ES/EN falling out of parity (item 18),
 * and a factual claim creeping back in that isn't backed (item 4/12/16).
 * Not a general i18n-key linter — just the specific things Phase 3 touched.
 */

const es = translations.es
const en = translations.en

// --- Data & BI: positioning, capability groups, evidence -----------------

test('dataBi.positioning.items: same length and shape (title+description) in both languages', () => {
  assert.equal(es.dataBi.positioning.items.length, en.dataBi.positioning.items.length)
  for (const list of [es.dataBi.positioning.items, en.dataBi.positioning.items]) {
    for (const item of list) {
      assert.ok(item.title && item.title.length > 0)
      assert.ok(item.description && item.description.length > 0)
    }
  }
})

test('dataBi.capabilityGroups: same group keys in both languages, each with a title and items', () => {
  const esKeys = Object.keys(es.dataBi.capabilityGroups).sort()
  const enKeys = Object.keys(en.dataBi.capabilityGroups).sort()
  assert.deepEqual(esKeys, enKeys)
  assert.deepEqual(
    esKeys,
    ['analyticsBi', 'analyticsEngineering', 'decisionIntelligence', 'mlAppliedAi', 'pythonAutomation'].sort(),
  )
  for (const key of esKeys) {
    for (const dict of [es, en]) {
      const group = dict.dataBi.capabilityGroups[key]
      assert.ok(group.title && group.title.length > 0, `${key} missing a title`)
      assert.ok(Array.isArray(group.items) && group.items.length > 0, `${key} missing items`)
    }
  }
})

test('dataBi evidence paths: Projects, Casework, PROVIDENTIA, Caelum, Paradigm and Contact all have bilingual labels', () => {
  for (const key of [
    'evidenceProjects',
    'evidenceCasework',
    'evidenceProvidentia',
    'evidenceCaelum',
    'evidenceParadigm',
    'evidenceContact',
  ]) {
    assert.ok(es.dataBi[key], `es.dataBi.${key} missing`)
    assert.ok(en.dataBi[key], `en.dataBi.${key} missing`)
  }
})

test('dataBi toolkit: core toolkit and full-toolkit disclosure labels exist bilingually', () => {
  assert.ok(es.dataBi.coreToolkitTitle && en.dataBi.coreToolkitTitle)
  assert.ok(es.dataBi.fullToolkitToggle && en.dataBi.fullToolkitToggle)
})

// --- Operations: content-integrity regression guards ----------------------

test('operations.axes.digital: "Remote collaboration" was removed — not backed by the in-person admin role', () => {
  const esItems = es.operations.axes.digital.items
  const enItems = en.operations.axes.digital.items
  assert.ok(!esItems.some((i) => /colaboraci[oó]n remota/i.test(i)), 'ES still lists remote collaboration')
  assert.ok(!enItems.some((i) => /remote collaboration/i.test(i)), 'EN still lists remote collaboration')
})

test('operations copy never names a specific unverified office suite (e.g. "Google Workspace")', () => {
  assert.ok(!JSON.stringify(es.operations).includes('Google Workspace'))
  assert.ok(!JSON.stringify(en.operations).includes('Google Workspace'))
})

test('operations: cross-links to About, Contact and Data & BI all exist bilingually', () => {
  for (const key of ['crossLinkAbout', 'crossLinkContact', 'crossLinkDataBi']) {
    assert.ok(es.operations[key], `es.operations.${key} missing`)
    assert.ok(en.operations[key], `en.operations.${key} missing`)
  }
})

test('operations: positioning has a secondary line pairing real experience with digital/analytical habits', () => {
  assert.ok(es.operations.hero.ledeSecondary && es.operations.hero.ledeSecondary.length > 0)
  assert.ok(en.operations.hero.ledeSecondary && en.operations.hero.ledeSecondary.length > 0)
})

// --- Availability: exact wording preserved, never "immediate" ------------

test('availability is "~2 weeks" / "~2 semanas" — never "immediate availability"', () => {
  assert.equal(es.contact.aboutFacts.availabilityValue, '~2 semanas')
  assert.equal(en.contact.aboutFacts.availabilityValue, '~2 weeks')
  assert.ok(!/immediate/i.test(en.contact.aboutFacts.availabilityValue))
  assert.ok(!/inmediat/i.test(es.contact.aboutFacts.availabilityValue))
})

// --- No PDI / PROVIDENTIA over-claiming introduced this phase ------------

test('no new PDI/.pbix claims appear anywhere in dataBi or operations copy', () => {
  for (const dict of [es, en]) {
    const blob = JSON.stringify(dict.dataBi) + JSON.stringify(dict.operations)
    assert.ok(!/\.pbix/i.test(blob), 'a .pbix claim leaked into Data & BI / Operations copy')
    assert.ok(!/PDI-?7/i.test(blob), 'a PDI-7 claim leaked into Data & BI / Operations copy')
  }
})
