import test from 'node:test'
import assert from 'node:assert/strict'

import { createRouteResolver, resolveAppRoute } from './resolveAppRoute.js'
import { getNormalizedHash } from './normalizeHash.js'
import { CASE_STUDIES, isCasePublic, getPublicCaseStudiesForProject } from '../projects/caseStudies.js'
import { PROJECT_REGISTRY, getProjectEntry, hasProject } from '../projects/registry.js'

/**
 * Visibility rules — PLAN-FROZEN v1.1, F2 (correction).
 *
 * Two separate concepts:
 *   - project `hidden`   -> no Projects listing, no Project Detail (treated as non-existent)
 *   - case `isPublic`    -> alone decides whether a case can be opened
 *
 * The rules are exercised with FAKE projects and cases, so they do not depend on
 * which project happens to be hidden today; a second group checks that the real
 * data (ALETHEIA) behaves accordingly, derived from the registry and caseStudies.
 */

function makeCase(projectId, slug, isPublic, sections = []) {
  const canonicalHash = `#projects/${projectId}/${slug}`
  return {
    projectId,
    slug,
    isPublic,
    sections,
    canonicalHash,
    canonicalSectionHashes: Object.fromEntries(sections.map((section) => [section, `${canonicalHash}/${section}`])),
  }
}

/**
 * A world with a visible and a hidden project, each with a public and a
 * non-public case, plus a case with no `isPublic` at all.
 */
function makeWorld({ hiddenProjectHidden = true, legacy = { exact: new Map(), prefixes: [], bases: [] } } = {}) {
  const projects = new Map([
    ['shown', { id: 'shown', hidden: false }],
    ['tucked', { id: 'tucked', hidden: hiddenProjectHidden }],
  ])
  const cases = [
    makeCase('shown', 'open', true, ['extra']),
    makeCase('shown', 'draft', false),
    makeCase('tucked', 'open', true, ['extra']),
    makeCase('tucked', 'draft', false),
    makeCase('tucked', 'undeclared', undefined),
  ]
  return createRouteResolver({
    getProject: (id) => projects.get(id) ?? null,
    isProjectPublic: (id) => projects.has(id) && !projects.get(id).hidden,
    getCase: (projectId, slug) => cases.find((c) => c.projectId === projectId && c.slug === slug) ?? null,
    legacy,
  })
}

// ── The four rules, with fake data ──────────────────────────────────────────

test('rule 1: a PUBLIC case of a HIDDEN project is accessible', () => {
  const resolve = makeWorld()
  const route = resolve('#projects/tucked/open')
  assert.equal(route.view, 'project-case')
  assert.deepEqual(route.params, { projectId: 'tucked', caseSlug: 'open', caseSection: null })
  assert.equal(route.canonicalHash, '#projects/tucked/open')
  assert.equal(route.legacyHash, null)
})

test('rule 1b: the public case\'s own sections open too, and an unknown section does not', () => {
  const resolve = makeWorld()
  assert.equal(resolve('#projects/tucked/open/extra').view, 'project-case')
  assert.equal(resolve('#projects/tucked/open/extra').params.caseSection, 'extra')
  assert.equal(resolve('#projects/tucked/open/nope').view, 'home')
})

test('rule 2: a HIDDEN project\'s own page (Project Detail) is inaccessible', () => {
  const resolve = makeWorld()
  for (const hash of ['#projects/tucked', '#projects/tucked/']) {
    const route = resolve(hash)
    assert.equal(route.view, 'home', hash)
    assert.equal(route.legacyHash, null)
  }
})

test('rule 3: a NON-public case of a hidden project is inaccessible (falls to Home, not to a detail page that does not exist)', () => {
  const resolve = makeWorld()
  for (const hash of ['#projects/tucked/draft', '#projects/tucked/undeclared', '#projects/tucked/draft/extra']) {
    assert.equal(resolve(hash).view, 'home', hash)
  }
})

test('rule 3b: a case that does not declare `isPublic` is NOT public — opting in must be explicit', () => {
  const resolve = makeWorld()
  assert.equal(resolve('#projects/tucked/undeclared').view, 'home')
  assert.equal(isCasePublic({ isPublic: undefined }), false)
  assert.equal(isCasePublic({ isPublic: 'true' }), false)
  assert.equal(isCasePublic({ isPublic: 1 }), false)
  assert.equal(isCasePublic(null), false)
  assert.equal(isCasePublic({ isPublic: true }), true)
})

test('rule 4: the same decisions hold for a VISIBLE project — a public case opens, a non-public one never does', () => {
  const resolve = makeWorld()
  assert.equal(resolve('#projects/shown').view, 'project-detail')
  assert.equal(resolve('#projects/shown/open').view, 'project-case')
  const draft = resolve('#projects/shown/draft')
  assert.equal(draft.view, 'project-detail', 'a non-public case of a public project is just "unknown case": the project page')
  assert.deepEqual(draft.params, { projectId: 'shown' })
  assert.equal(draft.legacyHash, null)
})

test('rule 5: unregistered projects never resolve, whatever the case slug', () => {
  const resolve = makeWorld()
  for (const hash of ['#projects/ghost', '#projects/ghost/open', '#projects//open']) assert.equal(resolve(hash).view, 'home', hash)
})

test('when the parent flips from hidden to visible nothing special is needed: the same data now also gives it a detail page', () => {
  const resolve = makeWorld({ hiddenProjectHidden: false })
  assert.equal(resolve('#projects/tucked').view, 'project-detail')
  assert.equal(resolve('#projects/tucked/open').view, 'project-case')
  assert.equal(resolve('#projects/tucked/draft').view, 'project-detail', 'still never opens a non-public case')
})

test('visibility is decided by the data it is given, not by project names (swapping which project is hidden swaps the behavior)', () => {
  const a = makeWorld({ hiddenProjectHidden: true })
  const b = makeWorld({ hiddenProjectHidden: false })
  assert.equal(a('#projects/tucked').view, 'home')
  assert.equal(b('#projects/tucked').view, 'project-detail')
  assert.equal(a('#projects/tucked/open').view, b('#projects/tucked/open').view)
})

// ── Legacy aliases follow the same rules ────────────────────────────────────

test('legacy alias of a PUBLIC case of a hidden project resolves and carries the legacy marker', () => {
  const resolve = makeWorld({
    legacy: { exact: new Map([['#old/open', '#projects/tucked/open']]), prefixes: [], bases: [] },
  })
  const route = resolve('#old/open')
  assert.equal(route.view, 'project-case')
  assert.equal(route.canonicalHash, '#projects/tucked/open')
  assert.equal(route.legacyHash, '#old/open')
  assert.equal(getNormalizedHash(route, '#old/open'), '#projects/tucked/open')
})

test('legacy alias of a NON-public case is not an alias at all: Home, no legacy marker, so the URL is never rewritten', () => {
  const resolve = makeWorld({
    legacy: { exact: new Map([['#old/draft', '#projects/tucked/draft']]), prefixes: [], bases: [] },
  })
  const route = resolve('#old/draft')
  assert.equal(route.view, 'home')
  assert.equal(route.legacyHash, null)
  assert.equal(getNormalizedHash(route, '#old/draft'), null)
})

test('legacy alias prefixes and unknown family members behave the same way with injected tables', () => {
  const resolve = makeWorld({
    legacy: { exact: new Map(), prefixes: [['#old-log', '#projects/tucked/open']], bases: ['#old'] },
  })
  assert.equal(resolve('#old-log/anything').view, 'project-case')
  assert.equal(resolve('#old/unknown').view, 'home')
})

// ── The real data obeys the same rules ──────────────────────────────────────

const hiddenProjects = PROJECT_REGISTRY.filter((project) => project.hidden)

test('real data: every case study declares `isPublic` as an explicit boolean, and all current cases are public', () => {
  for (const study of CASE_STUDIES) {
    assert.equal(typeof study.isPublic, 'boolean', `${study.projectId}/${study.slug} must declare isPublic explicitly`)
    assert.equal(study.isPublic, true, `${study.projectId}/${study.slug}`)
  }
})

test('real data: a hidden project has no detail page, but each of its PUBLIC cases is reachable and its legacy alias normalizes to it', () => {
  assert.ok(hiddenProjects.length > 0, 'expected at least one hidden project in the registry')
  for (const project of hiddenProjects) {
    assert.equal(hasProject(project.id), false)
    assert.equal(resolveAppRoute(`#projects/${project.id}`).view, 'home', `${project.id} detail must not exist publicly`)
    const publicCases = CASE_STUDIES.filter((study) => study.projectId === project.id && isCasePublic(study))
    assert.ok(publicCases.length > 0, `${project.id} has no public case to check`)
    for (const study of publicCases) {
      const direct = resolveAppRoute(study.canonicalHash)
      assert.equal(direct.view, 'project-case')
      assert.equal(direct.params.projectId, project.id)
      const alias = resolveAppRoute(study.legacyHash)
      assert.equal(alias.view, 'project-case')
      assert.equal(alias.canonicalHash, study.canonicalHash)
      assert.equal(alias.legacyHash, study.legacyHash)
      assert.equal(getNormalizedHash(alias, study.legacyHash), study.canonicalHash)
      for (const section of study.sections) {
        assert.equal(resolveAppRoute(study.canonicalSectionHashes[section]).view, 'project-case')
        assert.equal(resolveAppRoute(study.legacySectionHashes[section]).canonicalHash, study.canonicalSectionHashes[section])
      }
    }
  }
})

test('real data: visible projects keep their detail pages, and Project Detail only links PUBLIC cases', () => {
  for (const project of PROJECT_REGISTRY.filter((p) => !p.hidden)) {
    assert.equal(resolveAppRoute(`#projects/${project.id}`).view, 'project-detail', project.id)
    const linked = getPublicCaseStudiesForProject(project.id)
    assert.deepEqual(
      linked.map((study) => study.slug),
      CASE_STUDIES.filter((study) => study.projectId === project.id && study.isPublic === true).map((study) => study.slug),
    )
  }
})

test('real data: a hidden project\'s unknown case does not fall back to a project page that does not exist', () => {
  for (const project of hiddenProjects) assert.equal(resolveAppRoute(`#projects/${project.id}/not-a-case`).view, 'home')
})

test('real data: the rule is derived from the registry and caseStudies only — the router names no project, case or slug', async () => {
  const { readFileSync } = await import('node:fs')
  const { fileURLToPath } = await import('node:url')
  const { dirname, join } = await import('node:path')
  const here = dirname(fileURLToPath(import.meta.url))
  const strip = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1')
  const names = new Set([...PROJECT_REGISTRY.map((p) => p.id), ...CASE_STUDIES.flatMap((s) => [s.slug, s.legacySlug])])
  for (const file of ['resolveAppRoute.js', 'normalizeHash.js', 'syncRoute.js', 'documentTitle.js', 'hashes.js']) {
    const code = strip(readFileSync(join(here, file), 'utf8'))
    for (const name of names) {
      assert.ok(!new RegExp(`['"\`/#]${name}['"\`/]`).test(code), `${file} hard-codes "${name}"`)
    }
    assert.ok(!/aletheia/i.test(code), `${file} mentions ALETHEIA`)
  }
  assert.ok(getProjectEntry(hiddenProjects[0].id), 'sanity: hidden projects are still registered')
})
