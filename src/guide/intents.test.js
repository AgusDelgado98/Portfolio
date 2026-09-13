import test from 'node:test'
import assert from 'node:assert/strict'

import { GUIDE_INTENTS, HOME_NUMBERED_SECTIONS, getHomeLayout } from './intents.js'

/**
 * Fase 1B — Home adaptation recipe. Pure, DOM-free (no React needed): just
 * asserts the data Home.jsx renders from, same spirit as
 * router/resolveAppRoute.test.js asserting the data App.jsx renders from.
 */

const ALL_SECTIONS = ['hero', 'selectedWork', 'casework', 'toolkit', 'availability']

test('getHomeLayout: an invalid/unset intent (null, undefined, garbage) normalizes to the default layout', () => {
  const fromNull = getHomeLayout(null)
  const fromUndefined = getHomeLayout(undefined)
  const fromGarbage = getHomeLayout('ai')
  assert.equal(fromNull.intent, GUIDE_INTENTS.DEFAULT)
  assert.deepEqual(fromNull, fromUndefined)
  assert.deepEqual(fromNull, fromGarbage)
})

test('getHomeLayout(default): section order is exactly the pre-Fase-1B Home order — Default keeps Home unchanged', () => {
  const layout = getHomeLayout(GUIDE_INTENTS.DEFAULT)
  assert.deepEqual(layout.sections, ['hero', 'selectedWork', 'casework', 'toolkit', 'availability'])
  assert.equal(layout.showExperienceLine, false)
  assert.equal(layout.showRepoBadge, false)
  assert.deepEqual(layout.selectedWorkIds, ['providentia', 'caelum', 'paradigm'])
})

test('getHomeLayout(recruiter): availability moves right after hero; casework moves last; nothing is dropped', () => {
  const layout = getHomeLayout(GUIDE_INTENTS.RECRUITER)
  assert.deepEqual([...layout.sections].sort(), [...ALL_SECTIONS].sort())
  assert.equal(layout.sections[0], 'hero')
  assert.equal(layout.sections[1], 'availability')
  assert.equal(layout.sections[layout.sections.length - 1], 'casework')
})

test('getHomeLayout(recruiter): 2 representative projects (contract: "2-3"), the brief-experience line shows, CV/Contact are the primary Hero CTAs', () => {
  const layout = getHomeLayout(GUIDE_INTENTS.RECRUITER)
  assert.equal(layout.selectedWorkIds.length, 2)
  assert.equal(layout.showExperienceLine, true)
  assert.equal(layout.showRepoBadge, false)
  assert.equal(layout.heroCtas.primary.labelKey, 'hero.cv')
  assert.equal(layout.heroCtas.secondary.labelKey, 'nav.contact')
  assert.equal(layout.heroCtas.secondary.href, '#contact')
})

test('getHomeLayout(technical): casework moves right after hero; nothing is dropped', () => {
  const layout = getHomeLayout(GUIDE_INTENTS.TECHNICAL)
  assert.deepEqual([...layout.sections].sort(), [...ALL_SECTIONS].sort())
  assert.equal(layout.sections[0], 'hero')
  assert.equal(layout.sections[1], 'casework')
})

test('getHomeLayout(technical): keeps all 3 projects, shows the repo badge, no experience line, Hero CTAs unchanged from default', () => {
  const layout = getHomeLayout(GUIDE_INTENTS.TECHNICAL)
  const defaultLayout = getHomeLayout(GUIDE_INTENTS.DEFAULT)
  assert.equal(layout.selectedWorkIds.length, 3)
  assert.equal(layout.showRepoBadge, true)
  assert.equal(layout.showExperienceLine, false)
  assert.deepEqual(layout.heroCtas, defaultLayout.heroCtas)
})

test('getHomeLayout: selectedWorkIds are always real, known project ids for every intent', () => {
  for (const intent of Object.values(GUIDE_INTENTS)) {
    const layout = getHomeLayout(intent)
    assert.ok(layout.selectedWorkIds.length >= 2 && layout.selectedWorkIds.length <= 3)
    assert.ok(new Set(layout.selectedWorkIds).size === layout.selectedWorkIds.length, 'no duplicate ids')
  }
})

test('getHomeLayout: every intent keeps all 5 Home sections — Hiring Pack/Technical only reorder, never remove', () => {
  for (const intent of Object.values(GUIDE_INTENTS)) {
    const layout = getHomeLayout(intent)
    assert.deepEqual([...layout.sections].sort(), [...ALL_SECTIONS].sort())
  }
})

test('HOME_NUMBERED_SECTIONS: exactly the three sections that render a numbered section-label', () => {
  assert.deepEqual([...HOME_NUMBERED_SECTIONS].sort(), ['casework', 'selectedWork', 'toolkit'])
})
