import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveAppRoute, getRenderKey } from './resolveAppRoute.js'
import { getRouteTitle } from './documentTitle.js'
import { translations } from '../i18n/translations.js'
import { resolvePath, interpolate } from '../i18n/config.js'

/**
 * Navigation Contract — Phase 0 route tests.
 *
 * Node's built-in test runner (`node --test`) is used deliberately — the
 * repo has no test framework yet, and Phase 0 explicitly avoids adding one
 * just for this. Run with: `npm test` (see package.json).
 *
 * resolveAppRoute/getRouteTitle take the Casework registry by injection
 * (see resolveAppRoute.js), so this file fakes it rather than importing the
 * real casework/registry.js — which pulls in case JSX components and their
 * CSS that Node can't load directly. The fake mirrors the real registry's
 * five registered slugs (casework/registry.js is the source of truth).
 */

const REGISTERED_CASES = {
  'no-show': 'Paradigm',
  'operational-risk': 'Paradigm',
  'demand-forecasting': 'PROVIDENTIA',
  'capacity-decision': 'PROVIDENTIA',
  'policy-decision': 'PROVIDENTIA',
  aletheia: 'ALETHEIA',
}

const testDeps = { hasCaseworkCase: (slug) => Object.hasOwn(REGISTERED_CASES, slug) }
const titleDeps = { getCaseworkSystem: (slug) => REGISTERED_CASES[slug] ?? null }

function resolve(hash) {
  return resolveAppRoute(hash, testDeps)
}

function title(hash) {
  return getRouteTitle(resolve(hash), t, titleDeps)
}

function t(key, params) {
  const value = resolvePath(translations.es, key) ?? key
  return typeof value === 'string' ? interpolate(value, params) : value
}

// --- Canonical routes ---------------------------------------------------

test('canonical: #home', () => {
  const route = resolve('#home')
  assert.equal(route.view, 'home')
  assert.equal(route.canonicalHash, '#home')
})

test('canonical: #data-bi (recognized, no destination yet)', () => {
  assert.equal(resolve('#data-bi').view, 'data-bi')
})

test('canonical: #operations (recognized, no destination yet)', () => {
  assert.equal(resolve('#operations').view, 'operations')
})

test('canonical: #projects (index, no destination yet)', () => {
  const route = resolve('#projects')
  assert.equal(route.view, 'projects')
  assert.equal(route.canonicalHash, '#projects')
})

test('canonical: #projects/providentia (known id, no destination yet)', () => {
  const route = resolve('#projects/providentia')
  assert.equal(route.view, 'project-detail')
  assert.equal(route.params.projectId, 'providentia')
  assert.equal(route.canonicalHash, '#projects/providentia')
})

test('canonical: #casework (index)', () => {
  const route = resolve('#casework')
  assert.equal(route.view, 'casework-index')
})

test('canonical: #casework/no-show (valid slug)', () => {
  const route = resolve('#casework/no-show')
  assert.equal(route.view, 'casework-detail')
  assert.equal(route.params.caseSlug, 'no-show')
})

test('canonical: #about (recognized, no destination yet)', () => {
  assert.equal(resolve('#about').view, 'about')
})

test('canonical: #contact (recognized, no destination yet)', () => {
  const route = resolve('#contact')
  assert.equal(route.view, 'contact')
  assert.equal(route.canonicalHash, '#contact')
})

// --- Legacy hashes --------------------------------------------------------

test('legacy: empty hash and bare "#" behave like #home', () => {
  assert.equal(resolve('').view, 'home')
  assert.equal(resolve('#').view, 'home')
})

test('legacy: #portada resolves to home', () => {
  const route = resolve('#portada')
  assert.equal(route.view, 'home')
  assert.equal(route.canonicalHash, '#home')
  assert.equal(route.legacyHash, '#portada')
})

// Phase 2 (Home Hub) activated these — the old scroll sections they used
// to target no longer exist on Home, so they now alias their real
// destination's view instead of falling back to Home.
const legacyDestinationAliases = [
  { legacy: '#proyectos', view: 'projects', canonicalHash: '#projects' },
  { legacy: '#enfoque', view: 'about', canonicalHash: '#about' },
  { legacy: '#stack', view: 'data-bi', canonicalHash: '#data-bi' },
  { legacy: '#formacion', view: 'about', canonicalHash: '#about' },
]

for (const { legacy, view, canonicalHash } of legacyDestinationAliases) {
  test(`legacy: ${legacy} aliases the real ${view} destination (Phase 2 activation)`, () => {
    const route = resolve(legacy)
    assert.equal(route.view, view)
    assert.equal(route.canonicalHash, canonicalHash)
    assert.equal(route.legacyHash, legacy)
  })
}

test('legacy: #contacto aliases the future #contact', () => {
  const route = resolve('#contacto')
  assert.equal(route.view, 'contact')
  assert.equal(route.canonicalHash, '#contact')
  assert.equal(route.legacyHash, '#contacto')
})

test('legacy: #engineering-log aliases #casework/no-show and is never removed', () => {
  const route = resolve('#engineering-log')
  assert.equal(route.view, 'casework-detail')
  assert.equal(route.params.caseSlug, 'no-show')
  assert.equal(route.canonicalHash, '#casework/no-show')
  assert.equal(route.legacyHash, '#engineering-log')
})

test('legacy: #engineering-log/<anything> also aliases #casework/no-show', () => {
  const route = resolve('#engineering-log/lead-bucket')
  assert.equal(route.view, 'casework-detail')
  assert.equal(route.params.caseSlug, 'no-show')
})

test('legacy: #casework/operational-risk (Case 02) still resolves directly', () => {
  const route = resolve('#casework/operational-risk')
  assert.equal(route.view, 'casework-detail')
  assert.equal(route.params.caseSlug, 'operational-risk')
})

test('legacy: #casework/demand-forecasting (Case 03) still resolves directly', () => {
  assert.equal(resolve('#casework/demand-forecasting').view, 'casework-detail')
})

test('legacy: #casework/capacity-decision (Case 04) still resolves directly', () => {
  assert.equal(resolve('#casework/capacity-decision').view, 'casework-detail')
})

test('#casework/policy-decision (Case 05, Phase 5) resolves directly, no router changes needed', () => {
  const route = resolve('#casework/policy-decision')
  assert.equal(route.view, 'casework-detail')
  assert.equal(route.params.caseSlug, 'policy-decision')
  assert.equal(route.canonicalHash, '#casework/policy-decision')
})

test('#casework/aletheia (Evidence Case) resolves directly, no router changes needed', () => {
  const route = resolve('#casework/aletheia')
  assert.equal(route.view, 'casework-detail')
  assert.equal(route.params.caseSlug, 'aletheia')
  assert.equal(route.canonicalHash, '#casework/aletheia')
})

// --- Invalid routes ---------------------------------------------------

test('invalid: #casework/<bad-slug> falls back to home, never opens a case', () => {
  const route = resolve('#casework/not-real')
  assert.equal(route.view, 'home')
})

test('invalid: #projects/ (empty id) falls back to home', () => {
  assert.equal(resolve('#projects/').view, 'home')
})

test('invalid: #projects/not-real (unknown id) falls back to home', () => {
  assert.equal(resolve('#projects/not-real').view, 'home')
})

test('invalid/unknown: a totally unrecognized hash resolves to "unknown", not silently to something else', () => {
  const route = resolve('#unknown')
  assert.equal(route.view, 'unknown')
  assert.equal(route.canonicalHash, '#home')
})

test('resolveAppRoute never throws on odd input', () => {
  for (const input of [null, undefined, 123, '#casework/', '#projects//x', '###']) {
    assert.doesNotThrow(() => resolve(input))
  }
})

test('resolveAppRoute never throws when deps are omitted (safe default: no case matches)', () => {
  assert.doesNotThrow(() => resolveAppRoute('#casework/no-show'))
  assert.equal(resolveAppRoute('#casework/no-show').view, 'home')
})

// --- Document title -----------------------------------------------------

test('title: home uses the base localized title', () => {
  assert.equal(title('#home'), t('meta.title'))
})

test('title: casework-detail uses the case system name', () => {
  assert.equal(title('#casework/demand-forecasting'), 'Agustín Delgado — PROVIDENTIA')
})

test('title: Case 05 (policy-decision) also resolves to PROVIDENTIA — no router change needed for a new case', () => {
  assert.equal(title('#casework/policy-decision'), 'Agustín Delgado — PROVIDENTIA')
})

test('title: ALETHEIA Evidence Case resolves to ALETHEIA', () => {
  assert.equal(title('#casework/aletheia'), 'Agustín Delgado — ALETHEIA')
})

test('title: every Phase 1 destination gets its own distinct title', () => {
  assert.equal(title('#data-bi'), 'Agustín Delgado — Data & BI')
  assert.equal(title('#operations'), 'Agustín Delgado — Operations')
  assert.equal(title('#about'), 'Agustín Delgado — About')
  assert.equal(title('#contact'), 'Agustín Delgado — Contact')
  assert.equal(title('#casework'), 'Agustín Delgado — Casework')
})

test('title: legacy aliases produce the same title as their real destination (Phase 2 activation)', () => {
  assert.equal(title('#proyectos'), title('#projects'))
  assert.equal(title('#enfoque'), title('#about'))
  assert.equal(title('#stack'), title('#data-bi'))
  assert.equal(title('#formacion'), title('#about'))
  assert.equal(title('#contacto'), title('#contact'))
})

test('title: project-detail uses the project\'s real title from the registry', () => {
  assert.equal(title('#projects/providentia'), 'Agustín Delgado — PROVIDENTIA')
  assert.equal(title('#projects/paradigm'), 'Agustín Delgado — Paradigm')
})

test('getRouteTitle never throws when deps are omitted (soft fallback: generic base title)', () => {
  const route = resolve('#casework/no-show')
  assert.doesNotThrow(() => getRouteTitle(route, t))
})

// --- Focus Management: render-key identity ------------------------------
//
// getRenderKey is what App.jsx uses to decide whether a hash change is a
// *real* view change (worth moving focus to <main>) or one that stays
// within the same rendered destination.

test('renderKey: only #home/#portada and unknown share the "home" key now', () => {
  const homeFamily = ['#home', '#portada', '#unknown']
  const keys = new Set(homeFamily.map((hash) => getRenderKey(resolve(hash))))
  assert.deepEqual([...keys], ['home'])
})

test('renderKey: every destination has its own key, distinct from home and from each other, including legacy aliases', () => {
  const destinations = {
    '#data-bi': 'data-bi',
    '#stack': 'data-bi', // legacy alias, activated in Phase 2
    '#operations': 'operations',
    '#about': 'about',
    '#enfoque': 'about', // legacy alias, activated in Phase 2
    '#formacion': 'about', // legacy alias, activated in Phase 2
    '#contact': 'contact',
    '#contacto': 'contact', // legacy alias, activated in Phase 1
    '#projects': 'projects',
    '#proyectos': 'projects', // legacy alias, activated in Phase 2
  }
  for (const [hash, expectedKey] of Object.entries(destinations)) {
    assert.equal(getRenderKey(resolve(hash)), expectedKey, `${hash} should have key "${expectedKey}"`)
  }
  const distinctKeys = new Set(Object.values(destinations))
  distinctKeys.add('home')
  assert.equal(distinctKeys.size, 6) // home, data-bi, operations, about, contact, projects — all distinct
})

test('renderKey: #projects (Index) and #projects/<id> (a real Project Detail page) have distinct keys (Phase 4)', () => {
  const indexKey = getRenderKey(resolve('#projects'))
  const detailKey = getRenderKey(resolve('#projects/providentia'))
  assert.equal(indexKey, 'projects')
  assert.notEqual(detailKey, indexKey)
})

test('renderKey: each project detail has its own distinct key, like casework cases', () => {
  const providentia = getRenderKey(resolve('#projects/providentia'))
  const paradigm = getRenderKey(resolve('#projects/paradigm'))
  assert.notEqual(providentia, paradigm)
})

test('renderKey: casework-index has its own key, distinct from home', () => {
  assert.equal(getRenderKey(resolve('#casework')), 'casework-index')
})

test('renderKey: each casework case has its own distinct key', () => {
  const noShow = getRenderKey(resolve('#casework/no-show'))
  const opRisk = getRenderKey(resolve('#casework/operational-risk'))
  const policyDecision = getRenderKey(resolve('#casework/policy-decision'))
  assert.notEqual(noShow, opRisk)
  assert.notEqual(noShow, policyDecision)
  assert.notEqual(opRisk, policyDecision)
  assert.equal(noShow, getRenderKey(resolve('#engineering-log'))) // legacy alias, same case, same key
})

test('renderKey: invalid casework slug falls back to the home key, not a stray "casework-detail:" key', () => {
  assert.equal(getRenderKey(resolve('#casework/not-real')), 'home')
})

test('renderKey: invalid project id falls back to the home key, not a stray "projects" key', () => {
  assert.equal(getRenderKey(resolve('#projects/not-real')), 'home')
})
