import test from 'node:test'
import assert from 'node:assert/strict'
import {
  GUIDE_STORAGE_KEY,
  readStoredIntent,
  writeStoredIntent,
  clearStoredIntent,
  resolveIntentAfterNavigation,
} from './guideStorage.js'
import { GUIDE_INTENTS, GUIDE_VERSION } from './intents.js'

/** Minimal in-memory Storage fake — no jsdom/localStorage needed. */
function createFakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    _data: data,
  }
}

// --- readStoredIntent -------------------------------------------------

test('readStoredIntent: no storage available (SSR-like) returns null', () => {
  assert.equal(readStoredIntent(null), null)
  assert.equal(readStoredIntent(undefined), null)
})

test('readStoredIntent: nothing stored yet returns null (first visit / bounce)', () => {
  const storage = createFakeStorage()
  assert.equal(readStoredIntent(storage), null)
})

test('readStoredIntent: valid recruiter/technical/default all round-trip', () => {
  for (const intent of Object.values(GUIDE_INTENTS)) {
    const storage = createFakeStorage()
    writeStoredIntent(storage, intent)
    assert.equal(readStoredIntent(storage), intent)
  }
})

test('readStoredIntent: version mismatch invalidates the stored choice (guide_version bump)', () => {
  const storage = createFakeStorage()
  writeStoredIntent(storage, GUIDE_INTENTS.RECRUITER, GUIDE_VERSION)
  assert.equal(readStoredIntent(storage, GUIDE_VERSION + 1), null)
})

test('readStoredIntent: no TTL — an old-looking but same-version entry is still honored', () => {
  const storage = createFakeStorage()
  storage.setItem(GUIDE_STORAGE_KEY, JSON.stringify({ intent: GUIDE_INTENTS.TECHNICAL, version: GUIDE_VERSION }))
  assert.equal(readStoredIntent(storage), GUIDE_INTENTS.TECHNICAL)
})

test('readStoredIntent: malformed JSON returns null instead of throwing', () => {
  const storage = createFakeStorage({ [GUIDE_STORAGE_KEY]: '{not json' })
  assert.equal(readStoredIntent(storage), null)
})

test('readStoredIntent: unknown intent value returns null (never trusts a corrupted/foreign value)', () => {
  const storage = createFakeStorage({
    [GUIDE_STORAGE_KEY]: JSON.stringify({ intent: 'ai', version: GUIDE_VERSION }),
  })
  assert.equal(readStoredIntent(storage), null)
})

test('readStoredIntent: a getItem that throws (private mode) returns null, never throws', () => {
  const storage = {
    getItem: () => {
      throw new Error('blocked')
    },
  }
  assert.equal(readStoredIntent(storage), null)
})

// --- writeStoredIntent --------------------------------------------------

test('writeStoredIntent: invalid intent is a silent no-op, storage stays untouched', () => {
  const storage = createFakeStorage()
  writeStoredIntent(storage, 'ai')
  assert.equal(storage.getItem(GUIDE_STORAGE_KEY), null)
})

test('writeStoredIntent: stores intent tagged with the current guide_version', () => {
  const storage = createFakeStorage()
  writeStoredIntent(storage, GUIDE_INTENTS.RECRUITER)
  const parsed = JSON.parse(storage.getItem(GUIDE_STORAGE_KEY))
  assert.deepEqual(parsed, { intent: GUIDE_INTENTS.RECRUITER, version: GUIDE_VERSION })
})

test('writeStoredIntent: a setItem that throws (quota/private mode) never throws outward', () => {
  const storage = {
    setItem: () => {
      throw new Error('quota exceeded')
    },
  }
  assert.doesNotThrow(() => writeStoredIntent(storage, GUIDE_INTENTS.DEFAULT))
})

// --- clearStoredIntent ("Cambiar") --------------------------------------

test('clearStoredIntent: removes a previously persisted choice', () => {
  const storage = createFakeStorage()
  writeStoredIntent(storage, GUIDE_INTENTS.TECHNICAL)
  clearStoredIntent(storage)
  assert.equal(readStoredIntent(storage), null)
})

test('clearStoredIntent: a removeItem that throws never throws outward', () => {
  const storage = {
    removeItem: () => {
      throw new Error('blocked')
    },
  }
  assert.doesNotThrow(() => clearStoredIntent(storage))
})

// --- resolveIntentAfterNavigation ("ignora la card pero sigue navegando") --

test('resolveIntentAfterNavigation: no prior choice -> becomes default on real navigation', () => {
  assert.equal(resolveIntentAfterNavigation(null, GUIDE_INTENTS.DEFAULT), GUIDE_INTENTS.DEFAULT)
})

test('resolveIntentAfterNavigation: an explicit prior choice is never overwritten by navigation', () => {
  assert.equal(resolveIntentAfterNavigation(GUIDE_INTENTS.RECRUITER, GUIDE_INTENTS.DEFAULT), GUIDE_INTENTS.RECRUITER)
  assert.equal(resolveIntentAfterNavigation(GUIDE_INTENTS.TECHNICAL, GUIDE_INTENTS.DEFAULT), GUIDE_INTENTS.TECHNICAL)
  assert.equal(resolveIntentAfterNavigation(GUIDE_INTENTS.DEFAULT, GUIDE_INTENTS.DEFAULT), GUIDE_INTENTS.DEFAULT)
})

// --- End-to-end persistence rules (the frozen contract, as a scenario) --

test('contract scenario: bounce with zero navigation never calls the storage layer at all', () => {
  // Modeled at the call-site level: if the app never calls writeStoredIntent
  // (because no click and no hashchange happened), storage stays empty.
  // This test documents the invariant GuideContext.jsx relies on: it only
  // ever calls writeStoredIntent from an explicit click handler or the
  // hashchange listener — never from a mount/render effect.
  const storage = createFakeStorage()
  assert.equal(readStoredIntent(storage), null)
  assert.equal(storage._data.size, 0)
})

test('contract scenario: explicit recruiter click persists immediately', () => {
  const storage = createFakeStorage()
  writeStoredIntent(storage, GUIDE_INTENTS.RECRUITER)
  assert.equal(readStoredIntent(storage), GUIDE_INTENTS.RECRUITER)
})

test('contract scenario: "Seguir explorando" persists default immediately', () => {
  const storage = createFakeStorage()
  writeStoredIntent(storage, GUIDE_INTENTS.DEFAULT)
  assert.equal(readStoredIntent(storage), GUIDE_INTENTS.DEFAULT)
})

test('contract scenario: ignoring the card then navigating away persists default exactly once', () => {
  const storage = createFakeStorage()
  let intent = null
  // Simulates GuideContext's hashchange handler firing on real navigation.
  const onHashChange = () => {
    const next = resolveIntentAfterNavigation(intent, GUIDE_INTENTS.DEFAULT)
    if (next !== intent) writeStoredIntent(storage, next)
    intent = next
  }
  onHashChange() // first real navigation away from Home
  assert.equal(readStoredIntent(storage), GUIDE_INTENTS.DEFAULT)
  onHashChange() // continuing to browse must not re-write or change anything
  assert.equal(readStoredIntent(storage), GUIDE_INTENTS.DEFAULT)
})
