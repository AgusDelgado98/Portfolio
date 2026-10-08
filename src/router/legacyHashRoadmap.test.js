import test from 'node:test'
import assert from 'node:assert/strict'

import {
  STATIC_LEGACY_ALIASES,
  CASE_LEGACY_ALIASES,
  LEGACY_EXACT_ALIASES,
  LEGACY_PREFIX_ALIASES,
  LEGACY_FAMILY_BASES,
  ALL_LEGACY_HASHES,
} from './legacyHashRoadmap.js'
import { resolveAppRoute } from './resolveAppRoute.js'
import { CASE_STUDIES } from '../projects/caseStudies.js'
import { ABOUT_SECTIONS } from './hashes.js'

/**
 * Every legacy hash the plan promises to keep alive (PLAN-FROZEN v1.1, F2).
 * This list is the requirement itself, so it is the one place it is spelled out;
 * the case aliases are NOT listed — they are derived from projects/caseStudies.js.
 */
const REQUIRED_LEGACY_HASHES = [
  '#casework',
  '#casework/*', // any registered case slug
  '#engineering-log',
  '#engineering-log/*',
  '#data-bi',
  '#stack',
  '#operations',
  '#enfoque',
  '#formacion',
  '#proyectos',
  '#portada',
  '#contacto',
]

test('roadmap: every legacy hash the plan requires is documented', () => {
  const documented = new Set(ALL_LEGACY_HASHES)
  for (const required of REQUIRED_LEGACY_HASHES.filter((hash) => !hash.endsWith('/*'))) {
    assert.ok(documented.has(required), `${required} is not in the roadmap`)
  }
  // `#casework/*`: every case study's legacy hash is documented...
  for (const study of CASE_STUDIES) assert.ok(documented.has(study.legacyHash), study.legacyHash)
  // ...and `#engineering-log/*` is a prefix alias.
  assert.ok(LEGACY_PREFIX_ALIASES.some(([prefix]) => prefix === '#engineering-log'))
})

test('roadmap: legacy hashes are unique', () => {
  assert.equal(new Set(ALL_LEGACY_HASHES).size, ALL_LEGACY_HASHES.length)
})

test('roadmap: the static aliases map to the architecture the plan defines', () => {
  const byLegacy = Object.fromEntries(STATIC_LEGACY_ALIASES.map((alias) => [alias.legacy, alias.canonicalHash]))
  assert.deepEqual(byLegacy, {
    '#portada': '#home',
    '#proyectos': '#projects',
    '#contacto': '#contact',
    '#enfoque': '#about/method',
    '#stack': '#about/skills',
    '#data-bi': '#about/skills',
    '#formacion': '#about/education',
    '#operations': '#about/experience',
    '#casework': '#projects',
    '#casework/archive': '#projects',
  })
})

test('roadmap: every static alias lands on a real, canonical, un-aliased route (no chains)', () => {
  for (const alias of STATIC_LEGACY_ALIASES) {
    const target = resolveAppRoute(alias.canonicalHash)
    assert.equal(target.canonicalHash, alias.canonicalHash, `${alias.legacy} -> ${alias.canonicalHash} is not itself canonical`)
    assert.equal(target.legacyHash, null, `${alias.legacy} points at another alias`)
    assert.notEqual(target.view, 'unknown')
    assert.ok(alias.rationale && alias.rationale.length > 0, `${alias.legacy} has no rationale`)
  }
})

test('roadmap: About-bound aliases point only at About sections that exist', () => {
  for (const alias of STATIC_LEGACY_ALIASES.filter((a) => a.canonicalHash.startsWith('#about/'))) {
    assert.ok(ABOUT_SECTIONS.includes(alias.canonicalHash.slice('#about/'.length)), alias.legacy)
  }
})

test('roadmap: the case aliases are derived from caseStudies.js — one exact alias per case and per case section', () => {
  const exact = CASE_LEGACY_ALIASES.filter((entry) => entry.kind === 'exact')
  const expected = CASE_STUDIES.reduce((total, study) => total + 1 + study.sections.length, 0)
  assert.equal(exact.length, expected)
  for (const study of CASE_STUDIES) {
    assert.equal(LEGACY_EXACT_ALIASES.get(study.legacyHash), study.canonicalHash)
    for (const section of study.sections) {
      assert.equal(LEGACY_EXACT_ALIASES.get(study.legacySectionHashes[section]), study.canonicalSectionHashes[section])
    }
    for (const prefix of study.legacyPrefixes) {
      assert.ok(LEGACY_PREFIX_ALIASES.some(([p, canonical]) => p === prefix && canonical === study.canonicalHash))
    }
  }
})

test('roadmap: every documented alias resolves, marks legacyHash, and lands on its documented canonical hash', () => {
  for (const [legacy, canonicalHash] of LEGACY_EXACT_ALIASES) {
    const route = resolveAppRoute(legacy)
    assert.equal(route.legacyHash, legacy)
    assert.equal(route.canonicalHash, canonicalHash, legacy)
    assert.notEqual(route.view, 'unknown', legacy)
    if (legacy !== '#portada') assert.notEqual(route.view, 'home', `${legacy} fell back to Home`)
  }
})

test('roadmap: #portada is the one alias that lands on Home', () => {
  assert.equal(resolveAppRoute('#portada').view, 'home')
  assert.equal(resolveAppRoute('#portada').canonicalHash, '#home')
  assert.equal(resolveAppRoute('#portada').legacyHash, '#portada')
})

test('roadmap: prefix aliases cover the bare prefix and any suffix, and carry the incoming hash as legacyHash', () => {
  for (const [prefix, canonicalHash] of LEGACY_PREFIX_ALIASES) {
    for (const hash of [prefix, `${prefix}/`, `${prefix}/anything`, `${prefix}/a/b/c`]) {
      const route = resolveAppRoute(hash)
      assert.equal(route.canonicalHash, canonicalHash, hash)
      assert.equal(route.legacyHash, hash)
    }
  }
})

test('roadmap: a malformed member of a legacy family falls back to Home and is NOT marked as an alias', () => {
  for (const base of LEGACY_FAMILY_BASES) {
    for (const hash of [`${base}/definitely-not-a-case`, `${base}/x/y/z`]) {
      const route = resolveAppRoute(hash)
      assert.equal(route.view, 'home', hash)
      assert.equal(route.legacyHash, null, hash)
    }
  }
  // A real case with a section it does not have.
  for (const study of CASE_STUDIES) {
    const route = resolveAppRoute(`${study.legacyHash}/not-a-section`)
    assert.equal(route.view, 'home')
    assert.equal(route.legacyHash, null)
  }
})

test('roadmap: trailing slashes on a legacy hash are tolerated', () => {
  for (const study of CASE_STUDIES) {
    const route = resolveAppRoute(`${study.legacyHash}/`)
    assert.equal(route.canonicalHash, study.canonicalHash)
  }
  assert.equal(resolveAppRoute('#casework/').canonicalHash, '#projects')
})

test('roadmap: the old "never rewritten" contract is gone — it must not survive in the docs of the router modules', async () => {
  const { readFileSync } = await import('node:fs')
  const { fileURLToPath } = await import('node:url')
  const { dirname, join } = await import('node:path')
  const here = dirname(fileURLToPath(import.meta.url))
  for (const file of ['resolveAppRoute.js', 'legacyHashRoadmap.js', 'normalizeHash.js']) {
    const source = readFileSync(join(here, file), 'utf8')
    assert.ok(!/never rewritten in the address bar|no pushState\/replaceState|never call(s)? history\.pushState/i.test(source), `${file} still states the old contract`)
  }
})
