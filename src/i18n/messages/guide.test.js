import test from 'node:test'
import assert from 'node:assert/strict'

import { translations } from '../translations.js'
import { GUIDE_INTENTS } from '../../guide/intents.js'

/**
 * Guided Portfolio Experience v0.2 — Fase 1A i18n content-integrity tests.
 * Same intent as ui.test.js: guard ES/EN falling out of parity, and guard
 * the frozen contract's "sin opción AI en la UI" rule at the copy level.
 */

const es = translations.es.guide
const en = translations.en.guide

function collectStrings(node, path = '') {
  if (typeof node === 'string') return [[path, node]]
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([key, value]) => collectStrings(value, path ? `${path}.${key}` : key))
  }
  return []
}

test('guide.invitation and guide.header exist in both languages with identical key shape', () => {
  const esKeys = collectStrings(es).map(([path]) => path).sort()
  const enKeys = collectStrings(en).map(([path]) => path).sort()
  assert.deepEqual(esKeys, enKeys)
})

test('every guide.* string is non-empty in both languages', () => {
  for (const dict of [es, en]) {
    for (const [path, value] of collectStrings(dict)) {
      assert.ok(value.length > 0, `${path} is empty`)
    }
  }
})

test('guide.header.values covers exactly the three contract intents, nothing else', () => {
  for (const dict of [es, en]) {
    const keys = Object.keys(dict.header.values).sort()
    assert.deepEqual(keys, Object.values(GUIDE_INTENTS).sort())
  }
})

test('no "AI" option anywhere in the guide copy (frozen contract: sin opción AI en la UI)', () => {
  for (const dict of [es, en]) {
    for (const [, value] of collectStrings(dict)) {
      assert.ok(!/\bAI\b|\bIA\b/i.test(value), `unexpected AI/IA mention: "${value}"`)
    }
  }
})
