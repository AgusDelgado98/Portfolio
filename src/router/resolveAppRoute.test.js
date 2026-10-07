import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveAppRoute, getRenderKey } from './resolveAppRoute.js'
import { getRouteTitle } from './documentTitle.js'
import { ABOUT_SECTIONS } from './hashes.js'
import { ALL_PROJECT_IDS, getProjectEntry, PROJECT_REGISTRY } from '../projects/registry.js'
import { CASE_STUDIES } from '../projects/caseStudies.js'
import { translations } from '../i18n/translations.js'
import { resolvePath } from '../i18n/config.js'

/**
 * Router contract tests — PLAN-FROZEN v1.1, F2.
 *
 * Case associations (which project owns which case, slugs, sections) are NEVER
 * restated here: they are read from projects/caseStudies.js, the single source
 * of truth. The only literals below are routes that are not derived from it.
 */

const VIEW_SHAPE = ['view', 'params', 'canonicalHash', 'legacyHash']

const hiddenProjects = PROJECT_REGISTRY.filter((project) => project.hidden)

// ── Canonical routes ────────────────────────────────────────────────────────

test('canonical: #home, and the empty / bare-# hashes, are Home with no legacy marker', () => {
  for (const hash of ['#home', '', '#']) {
    const route = resolveAppRoute(hash)
    assert.equal(route.view, 'home', `"${hash}"`)
    assert.equal(route.canonicalHash, '#home')
    assert.equal(route.legacyHash, null, `"${hash}" must not be treated as an alias`)
  }
})

test('canonical: #projects, #contact and #about', () => {
  assert.deepEqual(resolveAppRoute('#projects'), { view: 'projects', params: {}, canonicalHash: '#projects', legacyHash: null })
  assert.deepEqual(resolveAppRoute('#contact'), { view: 'contact', params: {}, canonicalHash: '#contact', legacyHash: null })
  assert.deepEqual(resolveAppRoute('#about'), { view: 'about', params: { section: null }, canonicalHash: '#about', legacyHash: null })
})

test('canonical: every About section resolves to the about view, carrying its section', () => {
  assert.deepEqual([...ABOUT_SECTIONS], ['skills', 'experience', 'education', 'method'])
  for (const section of ABOUT_SECTIONS) {
    const route = resolveAppRoute(`#about/${section}`)
    assert.equal(route.view, 'about')
    assert.equal(route.params.section, section)
    assert.equal(route.canonicalHash, `#about/${section}`)
    assert.equal(route.legacyHash, null)
  }
})

test('canonical: #projects/<id> resolves to project-detail for every visible project', () => {
  for (const id of ALL_PROJECT_IDS) {
    const route = resolveAppRoute(`#projects/${id}`)
    assert.equal(route.view, 'project-detail', id)
    assert.deepEqual(route.params, { projectId: id })
    assert.equal(route.canonicalHash, `#projects/${id}`)
    assert.equal(route.legacyHash, null)
  }
})

test('canonical: every case study resolves to project-case at #projects/<project>/<case>', () => {
  assert.ok(CASE_STUDIES.length > 0)
  for (const study of CASE_STUDIES) {
    const route = resolveAppRoute(study.canonicalHash)
    assert.equal(route.view, 'project-case', study.canonicalHash)
    assert.deepEqual(route.params, { projectId: study.projectId, caseSlug: study.slug, caseSection: null })
    assert.equal(route.canonicalHash, study.canonicalHash)
    assert.equal(route.legacyHash, null)
  }
})

test('canonical: every case section (ALETHEIA research) resolves to project-case carrying the section', () => {
  const withSections = CASE_STUDIES.filter((study) => study.sections.length > 0)
  assert.ok(withSections.length > 0, 'expected at least one case with a section')
  for (const study of withSections) {
    for (const section of study.sections) {
      const route = resolveAppRoute(study.canonicalSectionHashes[section])
      assert.equal(route.view, 'project-case')
      assert.deepEqual(route.params, { projectId: study.projectId, caseSlug: study.slug, caseSection: section })
      assert.equal(route.canonicalHash, study.canonicalSectionHashes[section])
      assert.equal(route.legacyHash, null)
    }
  }
})

test('canonical: every route has the full { view, params, canonicalHash, legacyHash } shape', () => {
  const hashes = ['#home', '#projects', '#about', '#contact', '#nope', ...CASE_STUDIES.map((s) => s.canonicalHash)]
  for (const hash of hashes) {
    const route = resolveAppRoute(hash)
    for (const key of VIEW_SHAPE) assert.ok(key in route, `"${hash}" is missing ${key}`)
  }
})

test('canonical: the retired views no longer exist — nothing resolves to data-bi, operations, casework-index or casework-detail', () => {
  const retired = new Set(['data-bi', 'operations', 'casework-index', 'casework-detail'])
  const hashes = ['#data-bi', '#operations', '#casework', '#casework/anything', '#engineering-log', '#stack', ...CASE_STUDIES.map((s) => s.legacyHash)]
  for (const hash of hashes) assert.ok(!retired.has(resolveAppRoute(hash).view), `"${hash}" still resolves to a retired view`)
})

test('canonical: a query string is ignored', () => {
  assert.equal(resolveAppRoute('#projects/providentia?utm=x').view, 'project-detail')
  assert.equal(resolveAppRoute('#projects?x=1').view, 'projects')
  const study = CASE_STUDIES[0]
  assert.equal(resolveAppRoute(`${study.canonicalHash}?x=1`).canonicalHash, study.canonicalHash)
})

// ── Safe fallbacks ──────────────────────────────────────────────────────────

test('fallback: unknown project id, and an empty id, go to Home', () => {
  for (const hash of ['#projects/definitely-not-registered', '#projects/', '#projects//x']) {
    const route = resolveAppRoute(hash)
    assert.equal(route.view, 'home', hash)
    assert.equal(route.legacyHash, null)
  }
})

test('fallback: a hidden project has no detail page — it is treated as non-existent (no project is hidden today; router/visibility.test.js exercises the rule with fake data)', () => {
  for (const project of hiddenProjects) {
    assert.equal(resolveAppRoute(`#projects/${project.id}`).view, 'home', project.id)
    assert.equal(resolveAppRoute(`#projects/${project.id}/not-a-case`).view, 'home', `${project.id} + bad case`)
  }
})

test('hidden project: its case studies stay reachable (a live public page must not vanish while the entry is hidden)', () => {
  const hiddenIds = new Set(hiddenProjects.map((project) => project.id))
  const hiddenCases = CASE_STUDIES.filter((study) => hiddenIds.has(study.projectId))
  for (const study of hiddenCases) {
    const route = resolveAppRoute(study.canonicalHash)
    assert.equal(route.view, 'project-case')
    assert.equal(route.params.projectId, study.projectId)
  }
})

test('fallback: a valid, public project with an unknown case resolves to that project\'s detail page', () => {
  const visibleWithCases = ALL_PROJECT_IDS.filter((id) => CASE_STUDIES.some((s) => s.projectId === id))
  assert.ok(visibleWithCases.length > 0)
  for (const id of visibleWithCases) {
    const route = resolveAppRoute(`#projects/${id}/this-case-does-not-exist`)
    assert.equal(route.view, 'project-detail')
    assert.deepEqual(route.params, { projectId: id })
    assert.equal(route.canonicalHash, `#projects/${id}`)
    assert.equal(route.legacyHash, null, 'a bad case is not a legacy alias — never rewritten')
  }
  // ...also for a public project that has no cases at all.
  const noCases = ALL_PROJECT_IDS.find((id) => !CASE_STUDIES.some((s) => s.projectId === id))
  assert.equal(resolveAppRoute(`#projects/${noCases}/anything`).view, 'project-detail')
})

test('fallback: a case that exists with an UNKNOWN section goes to Home (never opens the case)', () => {
  for (const study of CASE_STUDIES) {
    assert.equal(resolveAppRoute(`${study.canonicalHash}/not-a-section`).view, 'home', study.canonicalHash)
  }
})

test('fallback: a case section that belongs to ANOTHER case does not open', () => {
  const withSection = CASE_STUDIES.find((study) => study.sections.length > 0)
  const other = CASE_STUDIES.find((study) => study !== withSection && study.sections.length === 0)
  assert.ok(withSection && other)
  assert.equal(resolveAppRoute(`${other.canonicalHash}/${withSection.sections[0]}`).view, 'home')
})

test('fallback: extra path segments after a case + section go to Home', () => {
  const study = CASE_STUDIES.find((s) => s.sections.length > 0)
  assert.equal(resolveAppRoute(`${study.canonicalSectionHashes[study.sections[0]]}/extra`).view, 'home')
})

test('fallback: an unknown #about section lands on About, with no scroll target and no rewrite', () => {
  for (const hash of ['#about/bogus', '#about/']) {
    const route = resolveAppRoute(hash)
    assert.equal(route.view, 'about')
    assert.equal(route.params.section, null)
    assert.equal(route.canonicalHash, '#about')
    assert.equal(route.legacyHash, null)
  }
})

test('fallback: a totally unrecognized hash is "unknown" (renders Home), not silently something else, and is not an alias', () => {
  for (const hash of ['#something-else', '#nope/nope', '#homes', '#aboutus']) {
    const route = resolveAppRoute(hash)
    assert.equal(route.view, 'unknown', hash)
    assert.equal(route.canonicalHash, '#home')
    assert.equal(route.legacyHash, null)
  }
})

test('skip-link: #main-content is not an app route and is never an alias', () => {
  const route = resolveAppRoute('#main-content')
  assert.equal(route.view, 'unknown')
  assert.equal(route.legacyHash, null)
})

test('resolveAppRoute never throws on odd input', () => {
  for (const input of [undefined, null, 42, {}, [], '#projects/%E0%A4%A', '#projects/\u0000', '#'.repeat(2000), '#casework/' + 'x'.repeat(500)]) {
    assert.doesNotThrow(() => resolveAppRoute(input))
    assert.ok(resolveAppRoute(input).view)
  }
})

test('the old injected `hasCaseworkCase` dependency is gone: a second argument changes nothing', () => {
  const study = CASE_STUDIES[0]
  assert.deepEqual(resolveAppRoute(study.canonicalHash, { hasCaseworkCase: () => false }), resolveAppRoute(study.canonicalHash))
})

// ── getRenderKey ────────────────────────────────────────────────────────────

test('renderKey: Home and unknown share a key; every other view has its own distinct key', () => {
  assert.equal(getRenderKey(resolveAppRoute('#home')), 'home')
  assert.equal(getRenderKey(resolveAppRoute('#unknown-hash')), 'home')
  assert.equal(getRenderKey(null), 'home')
  const keys = ['#projects', '#contact', '#about', '#projects/providentia'].map((hash) => getRenderKey(resolveAppRoute(hash)))
  assert.equal(new Set(keys).size, keys.length)
  assert.ok(!keys.includes('home'))
})

test('renderKey: #projects (index) and #projects/<id> (detail) differ, and each project has its own', () => {
  const keys = new Set([getRenderKey(resolveAppRoute('#projects'))])
  for (const id of ALL_PROJECT_IDS) {
    const key = getRenderKey(resolveAppRoute(`#projects/${id}`))
    assert.ok(!keys.has(key), `render key for "${id}" collides`)
    keys.add(key)
  }
})

test('renderKey: every case study has its own key; a case section is a different page from the case', () => {
  const keys = new Set()
  for (const study of CASE_STUDIES) {
    const key = getRenderKey(resolveAppRoute(study.canonicalHash))
    assert.ok(!keys.has(key))
    keys.add(key)
    for (const section of study.sections) {
      const sectionKey = getRenderKey(resolveAppRoute(study.canonicalSectionHashes[section]))
      assert.ok(!keys.has(sectionKey))
      keys.add(sectionKey)
    }
  }
})

test('renderKey: a legacy alias gets the same key as its canonical route', () => {
  for (const study of CASE_STUDIES) {
    assert.equal(getRenderKey(resolveAppRoute(study.legacyHash)), getRenderKey(resolveAppRoute(study.canonicalHash)))
  }
})

test('renderKey: invalid ids and cases fall back to the key of what actually renders (no stray keys)', () => {
  assert.equal(getRenderKey(resolveAppRoute('#projects/not-real')), 'home')
  assert.equal(getRenderKey(resolveAppRoute(`${CASE_STUDIES[0].canonicalHash}/nope`)), 'home')
  assert.equal(
    getRenderKey(resolveAppRoute(`#projects/${CASE_STUDIES.find((s) => !getProjectEntry(s.projectId).hidden).projectId}/nope`)),
    getRenderKey(resolveAppRoute(`#projects/${CASE_STUDIES.find((s) => !getProjectEntry(s.projectId).hidden).projectId}`)),
  )
})

test('renderKey: every About section shares the about key', () => {
  const about = getRenderKey(resolveAppRoute('#about'))
  for (const section of ABOUT_SECTIONS) {
    assert.equal(getRenderKey(resolveAppRoute(`#about/${section}`)), about, section)
  }
})

// ── Document titles ─────────────────────────────────────────────────────────

const tFor = (language) => (key) => resolvePath(translations[language], key)

test('title: home and unknown use the localized base title', () => {
  const t = tFor('es')
  assert.equal(getRouteTitle(resolveAppRoute('#home'), t), t('meta.title'))
  assert.equal(getRouteTitle(resolveAppRoute('#nope'), t), t('meta.title'))
  assert.equal(getRouteTitle(null, t), t('meta.title'))
})

test('title: projects, about (any section) and contact', () => {
  const t = tFor('en')
  assert.equal(getRouteTitle(resolveAppRoute('#projects'), t), 'Agustín Delgado — Projects')
  assert.equal(getRouteTitle(resolveAppRoute('#contact'), t), 'Agustín Delgado — Contact')
  for (const hash of ['#about', ...ABOUT_SECTIONS.map((s) => `#about/${s}`)]) {
    assert.equal(getRouteTitle(resolveAppRoute(hash), t), 'Agustín Delgado — About', hash)
  }
})

test('title: project-detail uses the real project title from the registry', () => {
  const t = tFor('en')
  for (const id of ALL_PROJECT_IDS) {
    assert.equal(getRouteTitle(resolveAppRoute(`#projects/${id}`), t), `Agustín Delgado — ${getProjectEntry(id).title}`)
  }
})

test('title: project-case is project + case + Agustín Delgado, in both languages', () => {
  for (const language of ['es', 'en']) {
    const t = tFor(language)
    for (const study of CASE_STUDIES) {
      const title = getRouteTitle(resolveAppRoute(study.canonicalHash), t)
      const project = getProjectEntry(study.projectId)
      const caseCopy = t(`casework.cases.${study.i18nKey}`)
      assert.ok(title.startsWith('Agustín Delgado — '), title)
      assert.ok(title.includes(project.title), `"${title}" lacks the project title`)
      assert.ok(title.includes(caseCopy.title), `"${title}" lacks the case title`)
    }
  }
})

test('title: a case title that repeats its project\'s name is not repeated; research adds " · Research"', () => {
  const t = tFor('es')
  const research = CASE_STUDIES.find((study) => study.sections.includes('research'))
  const base = getRouteTitle(resolveAppRoute(research.canonicalHash), t)
  const withResearch = getRouteTitle(resolveAppRoute(research.canonicalSectionHashes.research), t)
  const project = getProjectEntry(research.projectId)
  assert.equal(t(`casework.cases.${research.i18nKey}`).title, project.title, 'this check assumes ALETHEIA\'s case title equals its project title')
  assert.equal(base, `Agustín Delgado — ${project.title}`)
  assert.equal(withResearch, `Agustín Delgado — ${project.title} · Research`)
})

test('title: "Casework" and "Engineering Log" are never part of a title', () => {
  for (const language of ['es', 'en']) {
    const t = tFor(language)
    const hashes = ['#home', '#projects', '#about', '#contact', '#casework', '#engineering-log', ...CASE_STUDIES.map((s) => s.canonicalHash), ...CASE_STUDIES.map((s) => s.legacyHash)]
    for (const hash of hashes) {
      assert.ok(!/casework|engineering log/i.test(getRouteTitle(resolveAppRoute(hash), t)), `"${hash}" title mentions the retired vocabulary`)
    }
  }
})

test('title: legacy aliases produce exactly the title of their canonical route', () => {
  const t = tFor('es')
  for (const study of CASE_STUDIES) {
    assert.equal(getRouteTitle(resolveAppRoute(study.legacyHash), t), getRouteTitle(resolveAppRoute(study.canonicalHash), t))
  }
  assert.equal(getRouteTitle(resolveAppRoute('#data-bi'), t), getRouteTitle(resolveAppRoute('#about/skills'), t))
  assert.equal(getRouteTitle(resolveAppRoute('#proyectos'), t), getRouteTitle(resolveAppRoute('#projects'), t))
})

test('title: never throws on an incomplete route', () => {
  const t = tFor('es')
  assert.doesNotThrow(() => getRouteTitle({ view: 'project-case', params: {} }, t))
  assert.doesNotThrow(() => getRouteTitle({ view: 'project-case', params: { projectId: 'nope', caseSlug: 'nope' } }, t))
  assert.doesNotThrow(() => getRouteTitle({ view: 'project-detail', params: { projectId: 'nope' } }, t))
})
