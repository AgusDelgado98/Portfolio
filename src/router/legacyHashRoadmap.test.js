import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveAppRoute, HOME_HASH, DATA_BI_HASH, OPERATIONS_HASH, PROJECTS_HASH, ABOUT_HASH, CONTACT_HASH } from './resolveAppRoute.js'
import { LEGACY_HASH_ROADMAP, ROADMAP_LEGACY_HASHES, RESOLVER_LEGACY_HASHES } from './legacyHashRoadmap.js'

/**
 * Guards the Legacy Hash Migration Roadmap against silent drift: if
 * resolveAppRoute.js's actual behavior for a legacy hash ever changes, or a
 * legacy hash is added/removed there without updating the roadmap, or a
 * gate is marked "activated" without the resolver actually agreeing, one of
 * these fails — so the migration decision can't be quietly forgotten or
 * misreported between phases.
 */

const testDeps = { hasCaseworkCase: (slug) => slug === 'no-show' }
const VALID_FUTURE_HASHES = new Set([HOME_HASH, DATA_BI_HASH, OPERATIONS_HASH, PROJECTS_HASH, ABOUT_HASH, CONTACT_HASH, '#casework/no-show'])
const VALID_GATE_STATUSES = new Set(['activated', 'pending-phase-2'])

test('roadmap: documents exactly the legacy hashes the resolver recognizes (no orphans, no gaps)', () => {
  assert.deepEqual([...ROADMAP_LEGACY_HASHES].sort(), [...RESOLVER_LEGACY_HASHES].sort())
})

for (const entry of LEGACY_HASH_ROADMAP) {
  test(`roadmap: "${entry.legacy}" currentCanonicalHash matches what resolveAppRoute() returns today`, () => {
    const route = resolveAppRoute(entry.legacy, testDeps)
    assert.equal(
      route.canonicalHash,
      entry.currentCanonicalHash,
      `resolveAppRoute('${entry.legacy}') returned canonicalHash "${route.canonicalHash}", ` +
        `but the roadmap says today's behavior is "${entry.currentCanonicalHash}" — update whichever one is stale.`,
    )
  })

  test(`roadmap: "${entry.legacy}" futureCanonicalHash is a real, known canonical hash`, () => {
    assert.ok(
      VALID_FUTURE_HASHES.has(entry.futureCanonicalHash),
      `"${entry.futureCanonicalHash}" is not one of the known canonical hashes — typo?`,
    )
  })

  test(`roadmap: "${entry.legacy}" has a valid, documented gate status and rationale`, () => {
    assert.ok(VALID_GATE_STATUSES.has(entry.gateStatus), `unknown gateStatus "${entry.gateStatus}"`)
    assert.equal(typeof entry.destinationBuilt, 'boolean')
    assert.ok(entry.rationale && entry.rationale.length > 0)
  })

  test(`roadmap: "${entry.legacy}" gateStatus "activated" implies currentCanonicalHash === futureCanonicalHash (and vice versa)`, () => {
    if (entry.gateStatus === 'activated') {
      assert.equal(
        entry.currentCanonicalHash,
        entry.futureCanonicalHash,
        `"${entry.legacy}" is marked activated but current/future canonical hashes still differ`,
      )
    } else {
      assert.notEqual(
        entry.currentCanonicalHash,
        entry.futureCanonicalHash,
        `"${entry.legacy}" is marked pending-phase-2 but current/future canonical hashes already match — should this be "activated"?`,
      )
    }
  })
}

test('roadmap: every destination is built — none is still a fallback', () => {
  for (const entry of LEGACY_HASH_ROADMAP) {
    assert.equal(entry.destinationBuilt, true, `"${entry.legacy}"'s future destination (${entry.futureCanonicalHash}) should be built`)
  }
})

test('roadmap: Phase 2 activates every remaining gate — all seven legacy hashes are now "activated"', () => {
  const activated = LEGACY_HASH_ROADMAP.filter((e) => e.gateStatus === 'activated').map((e) => e.legacy).sort()
  assert.deepEqual(activated, [...ROADMAP_LEGACY_HASHES].sort())
})

test('roadmap: no entry is still pending-phase-2 — Home Hub retired the old sections, so nothing is left to preserve', () => {
  const pending = LEGACY_HASH_ROADMAP.filter((e) => e.gateStatus === 'pending-phase-2')
  assert.deepEqual(pending, [])
})

test('roadmap: #engineering-log is documented as a permanent alias, never a migration', () => {
  const entry = LEGACY_HASH_ROADMAP.find((e) => e.legacy === '#engineering-log')
  assert.ok(entry)
  assert.equal(entry.gateStatus, 'activated')
  assert.equal(entry.futureCanonicalHash, entry.currentCanonicalHash)
})
