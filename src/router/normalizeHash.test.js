import test from 'node:test'
import assert from 'node:assert/strict'

import { getNormalizedHash, normalizeLocationHash } from './normalizeHash.js'
import { syncRouteFromLocation } from './syncRoute.js'
import { resolveAppRoute } from './resolveAppRoute.js'
import { ALL_LEGACY_HASHES, STATIC_LEGACY_ALIASES } from './legacyHashRoadmap.js'
import { CASE_STUDIES } from '../projects/caseStudies.js'
import { MAIN_CONTENT_HASH } from './hashes.js'

/**
 * Silent legacy-URL normalization — PLAN-FROZEN v1.1, section 5.2 (F2).
 *
 * `FakeBrowser` models the three things that matter: a history stack with a
 * current entry, `location.hash` following it, and the difference between
 * pushing an entry (what clicking a link / assigning location.hash does) and
 * `replaceState` (what normalization uses). `replaceState` deliberately does
 * NOT fire `hashchange`, like the real thing.
 */
class FakeBrowser {
  constructor(initialHash = '') {
    this.entries = [initialHash]
    this.index = 0
    this.pathname = '/'
    this.search = ''
    this.replaceCalls = []
    this.handlers = []
    const self = this
    this.location = {
      get hash() {
        return self.entries[self.index]
      },
      get pathname() {
        return self.pathname
      },
      get search() {
        return self.search
      },
    }
    this.history = {
      state: null,
      replaceState: (state, _title, url) => {
        this.replaceCalls.push(url)
        const hashAt = url.indexOf('#')
        this.entries[this.index] = hashAt === -1 ? '' : url.slice(hashAt)
      },
    }
  }

  get current() {
    return this.entries[this.index]
  }

  onHashChange(handler) {
    this.handlers.push(handler)
  }

  fire() {
    for (const handler of this.handlers) handler()
  }

  /** Clicking a link / assigning location.hash: a NEW history entry, then `hashchange`. */
  navigate(hash) {
    this.entries.splice(this.index + 1)
    this.entries.push(hash)
    this.index += 1
    this.fire()
  }

  back() {
    assert.ok(this.index > 0, 'nothing to go back to')
    this.index -= 1
    this.fire()
  }

  forward() {
    assert.ok(this.index < this.entries.length - 1, 'nothing to go forward to')
    this.index += 1
    this.fire()
  }
}

/** Mirrors App.jsx: sync once on mount, then on every hashchange. Returns the "rendered" route log. */
function mount(browser) {
  const rendered = []
  const sync = () => {
    const route = syncRouteFromLocation(browser)
    if (route) rendered.push(route)
  }
  browser.onHashChange(sync)
  sync()
  return rendered
}

const caseAliases = CASE_STUDIES.map((study) => ({ legacy: study.legacyHash, canonical: study.canonicalHash }))
const staticAliases = STATIC_LEGACY_ALIASES.map((alias) => ({ legacy: alias.legacy, canonical: alias.canonicalHash }))
const allAliases = [...staticAliases, ...caseAliases]

// ── getNormalizedHash (pure) ────────────────────────────────────────────────

test('getNormalizedHash: every legacy alias normalizes to its canonical hash', () => {
  assert.ok(allAliases.length >= 10)
  for (const { legacy, canonical } of allAliases) {
    assert.equal(getNormalizedHash(resolveAppRoute(legacy), legacy), canonical, legacy)
  }
})

test('getNormalizedHash: legacy hashes of case sections and the #engineering-log family normalize too', () => {
  for (const study of CASE_STUDIES) {
    for (const section of study.sections) {
      const legacy = study.legacySectionHashes[section]
      assert.equal(getNormalizedHash(resolveAppRoute(legacy), legacy), study.canonicalSectionHashes[section])
    }
    for (const prefix of study.legacyPrefixes) {
      for (const hash of [prefix, `${prefix}/anything`, `${prefix}/a/b`]) {
        assert.equal(getNormalizedHash(resolveAppRoute(hash), hash), study.canonicalHash, hash)
      }
    }
  }
})

test('getNormalizedHash: canonical routes are never rewritten', () => {
  const canonical = [
    '#home', '#projects', '#about', '#contact', '#about/skills', '#about/experience', '#about/education', '#about/method',
    '#projects/providentia', ...CASE_STUDIES.map((s) => s.canonicalHash),
    ...CASE_STUDIES.flatMap((s) => s.sections.map((section) => s.canonicalSectionHashes[section])),
  ]
  for (const hash of canonical) assert.equal(getNormalizedHash(resolveAppRoute(hash), hash), null, hash)
})

test('getNormalizedHash: the empty hash and a bare # are never rewritten', () => {
  for (const hash of ['', '#']) assert.equal(getNormalizedHash(resolveAppRoute(hash), hash), null)
})

test('getNormalizedHash: unknown hashes and bad ids/cases/sections are never rewritten', () => {
  const hashes = [
    '#nope', '#projects/not-real', '#projects/', '#about/bogus', `${CASE_STUDIES[0].canonicalHash}/not-a-section`,
    '#projects/providentia/not-a-case', '#casework/not-a-case', '#casework/aletheia/bogus',
  ]
  for (const hash of hashes) assert.equal(getNormalizedHash(resolveAppRoute(hash), hash), null, hash)
})

test('getNormalizedHash: #main-content is never touched', () => {
  assert.equal(getNormalizedHash(resolveAppRoute(MAIN_CONTENT_HASH), MAIN_CONTENT_HASH), null)
  // Even a (hypothetical) alias route is left alone while the skip-link anchor is the current hash.
  assert.equal(getNormalizedHash({ legacyHash: '#data-bi', canonicalHash: '#about/skills' }, MAIN_CONTENT_HASH), null)
})

test('getNormalizedHash: tolerates a missing route', () => {
  assert.equal(getNormalizedHash(null, '#x'), null)
  assert.equal(getNormalizedHash(undefined, '#x'), null)
})

// ── normalizeLocationHash: replaceState ─────────────────────────────────────

test('normalizeLocationHash: calls history.replaceState with the canonical URL, preserving pathname and search', () => {
  const browser = new FakeBrowser('#casework/no-show')
  browser.pathname = '/portfolio/'
  browser.search = '?utm=1'
  const study = CASE_STUDIES.find((s) => s.legacySlug === 'no-show')
  const written = normalizeLocationHash(resolveAppRoute(browser.current), browser)
  assert.equal(written, study.canonicalHash)
  assert.deepEqual(browser.replaceCalls, [`/portfolio/?utm=1${study.canonicalHash}`])
  assert.equal(browser.current, study.canonicalHash)
})

test('normalizeLocationHash: does not call replaceState when there is nothing to normalize', () => {
  for (const hash of ['', '#', '#home', '#projects', '#about/skills', '#nope', MAIN_CONTENT_HASH]) {
    const browser = new FakeBrowser(hash)
    assert.equal(normalizeLocationHash(resolveAppRoute(hash), browser), null, hash)
    assert.deepEqual(browser.replaceCalls, [], `"${hash}" must not touch history`)
  }
})

// ── Initial load ────────────────────────────────────────────────────────────

test('initial load: every legacy alias opens its canonical view and the URL is rewritten in place — still ONE history entry', () => {
  for (const { legacy, canonical } of allAliases) {
    const browser = new FakeBrowser(legacy)
    const rendered = mount(browser)
    assert.equal(rendered.length, 1)
    assert.equal(rendered[0].canonicalHash, canonical, legacy)
    assert.equal(rendered[0].legacyHash, legacy)
    assert.equal(browser.current, canonical, `${legacy} was not normalized`)
    assert.equal(browser.entries.length, 1, `${legacy} added a history entry`)
    assert.equal(browser.replaceCalls.length, 1)
  }
})

test('initial load: canonical, empty, bare # and unknown hashes are left exactly as they are', () => {
  for (const hash of ['', '#', '#home', '#projects', '#about/method', '#nope']) {
    const browser = new FakeBrowser(hash)
    mount(browser)
    assert.equal(browser.current, hash)
    assert.deepEqual(browser.replaceCalls, [])
    assert.equal(browser.entries.length, 1)
  }
})

test('initial load: #main-content is not resolved at all — no route is rendered and nothing is rewritten', () => {
  const browser = new FakeBrowser(MAIN_CONTENT_HASH)
  const rendered = mount(browser)
  assert.deepEqual(rendered, [])
  assert.equal(browser.current, MAIN_CONTENT_HASH)
  assert.deepEqual(browser.replaceCalls, [])
})

// ── hashchange ──────────────────────────────────────────────────────────────

test('hashchange: following a legacy link replaces the new entry with the canonical one (one entry added by the click, none by us)', () => {
  const browser = new FakeBrowser('#home')
  const rendered = mount(browser)
  const study = CASE_STUDIES.find((s) => s.legacySlug === 'no-show')

  browser.navigate(study.legacyHash) // what the click did: 1 new entry
  assert.equal(browser.entries.length, 2)
  assert.equal(browser.current, study.canonicalHash, 'normalized in place')
  assert.deepEqual(browser.entries, ['#home', study.canonicalHash])
  assert.equal(browser.replaceCalls.length, 1)
  assert.equal(rendered.at(-1).view, 'project-case')
  assert.equal(rendered.at(-1).canonicalHash, study.canonicalHash)
})

test('hashchange: navigating between canonical routes never rewrites anything', () => {
  const browser = new FakeBrowser('#home')
  mount(browser)
  for (const hash of ['#projects', '#about/skills', CASE_STUDIES[0].canonicalHash, '#contact']) browser.navigate(hash)
  assert.deepEqual(browser.replaceCalls, [])
  assert.equal(browser.entries.length, 5)
})

test('hashchange: the skip-link (#main-content) neither re-renders nor rewrites, and the current route is kept', () => {
  const browser = new FakeBrowser('#about/skills')
  const rendered = mount(browser)
  const before = rendered.length
  browser.navigate(MAIN_CONTENT_HASH)
  assert.equal(rendered.length, before, 'the skip-link must not produce a route change')
  assert.deepEqual(browser.replaceCalls, [])
  assert.equal(browser.current, MAIN_CONTENT_HASH)
})

test('hashchange: a legacy alias after the skip-link is still normalized', () => {
  const browser = new FakeBrowser('#home')
  mount(browser)
  browser.navigate(MAIN_CONTENT_HASH)
  browser.navigate('#data-bi')
  assert.equal(browser.current, '#about/skills')
})

// ── Back / Forward ──────────────────────────────────────────────────────────

test('Back/Forward: Back from a normalized legacy entry goes to the previous page, never to the alias; Forward returns without rewriting again', () => {
  const browser = new FakeBrowser('#home')
  const rendered = mount(browser)
  browser.navigate('#projects')
  browser.navigate('#operations') // legacy -> #about/experience, replaced in place
  assert.deepEqual(browser.entries, ['#home', '#projects', '#about/experience'])
  assert.equal(browser.replaceCalls.length, 1)

  browser.back()
  assert.equal(browser.current, '#projects')
  assert.equal(rendered.at(-1).view, 'projects')

  browser.back()
  assert.equal(browser.current, '#home')
  assert.equal(rendered.at(-1).view, 'home')

  browser.forward()
  browser.forward()
  assert.equal(browser.current, '#about/experience')
  assert.equal(rendered.at(-1).canonicalHash, '#about/experience')
  assert.equal(browser.replaceCalls.length, 1, 'Forward must not trigger another replaceState')
  assert.deepEqual(browser.entries, ['#home', '#projects', '#about/experience'])
})

test('Back/Forward: opening the site directly on a legacy URL leaves a single, canonical entry (Back leaves the site)', () => {
  const browser = new FakeBrowser('#engineering-log/whatever')
  mount(browser)
  assert.equal(browser.entries.length, 1)
  assert.ok(browser.entries[0].startsWith('#projects/'))
})

test('Back/Forward: every alias round-trips through navigate -> back -> forward with no history growth beyond the click', () => {
  for (const { legacy, canonical } of allAliases) {
    const browser = new FakeBrowser('#home')
    mount(browser)
    browser.navigate(legacy)
    assert.deepEqual(browser.entries, ['#home', canonical], legacy)
    browser.back()
    browser.forward()
    assert.deepEqual(browser.entries, ['#home', canonical], `${legacy} grew the history on Back/Forward`)
    assert.equal(browser.replaceCalls.length, 1)
  }
})

test('the roadmap lists every legacy hash it can normalize', () => {
  for (const legacy of ALL_LEGACY_HASHES) {
    const route = resolveAppRoute(legacy)
    assert.equal(route.legacyHash, legacy, `${legacy} is documented but not recognized as an alias`)
  }
})
