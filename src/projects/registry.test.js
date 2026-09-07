import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ALL_PROJECT_IDS,
  FEATURED_PROJECT_IDS,
  APPLICATION_PROJECT_IDS,
  PROJECTS_META,
  NODE_PROFILES,
  TERRITORIES,
  hasProject,
  getProjectMeta,
  getTerritoryForProject,
  getCaseworkSlugsForProject,
} from './registry.js'
import { resolveAppRoute, getRenderKey } from '../router/resolveAppRoute.js'
import { getRouteTitle } from '../router/documentTitle.js'

test('registry: FEATURED + APPLICATION ids are disjoint and together make up ALL_PROJECT_IDS', () => {
  const overlap = FEATURED_PROJECT_IDS.filter((id) => APPLICATION_PROJECT_IDS.includes(id))
  assert.deepEqual(overlap, [])
  assert.deepEqual(ALL_PROJECT_IDS, [...FEATURED_PROJECT_IDS, ...APPLICATION_PROJECT_IDS])
})

test('registry: every id has a metadata entry with at least an id, title and stack', () => {
  for (const id of ALL_PROJECT_IDS) {
    const meta = PROJECTS_META[id]
    assert.ok(meta, `missing PROJECTS_META entry for "${id}"`)
    assert.equal(meta.id, id)
    assert.ok(meta.title && meta.title.length > 0)
    assert.ok(Array.isArray(meta.stack) && meta.stack.length > 0)
  }
})

test('registry: every id has a node profile', () => {
  for (const id of ALL_PROJECT_IDS) {
    assert.ok(NODE_PROFILES[id], `missing NODE_PROFILES entry for "${id}"`)
  }
})

test('registry: every territory project id is a real, known project', () => {
  for (const territory of TERRITORIES) {
    for (const id of territory.projectIds) {
      assert.ok(hasProject(id), `territory "${territory.id}" references unknown project "${id}"`)
    }
  }
})

test('registry: every project belongs to exactly one territory', () => {
  const counts = new Map(ALL_PROJECT_IDS.map((id) => [id, 0]))
  for (const territory of TERRITORIES) {
    for (const id of territory.projectIds) {
      counts.set(id, (counts.get(id) || 0) + 1)
    }
  }
  for (const [id, count] of counts) {
    assert.equal(count, 1, `project "${id}" appears in ${count} territories, expected exactly 1`)
  }
})

test('hasProject/getProjectMeta: known vs unknown ids', () => {
  assert.equal(hasProject('providentia'), true)
  assert.equal(hasProject('not-a-real-project'), false)
  assert.equal(getProjectMeta('providentia')?.title, 'PROVIDENTIA')
  assert.equal(getProjectMeta('not-a-real-project'), null)
})

// --- Integration: the router consumes this same registry, no duplication ---

const routerDeps = { hasCaseworkCase: () => false }

test('router integration: every registered project id resolves to project-detail via #projects/<id>', () => {
  for (const id of ALL_PROJECT_IDS) {
    const route = resolveAppRoute(`#projects/${id}`, routerDeps)
    assert.equal(route.view, 'project-detail', `#projects/${id} did not resolve to project-detail`)
    assert.equal(route.params.projectId, id)
  }
})

test('router integration: a project id absent from the registry is not accepted as project-detail', () => {
  const route = resolveAppRoute('#projects/definitely-not-registered', routerDeps)
  assert.notEqual(route.view, 'project-detail')
})

// --- Phase 4 (Projects Experience): editorial priority, Related Casework ---

test('registry: every project has a valid priority (primary or secondary)', () => {
  for (const id of ALL_PROJECT_IDS) {
    assert.ok(['primary', 'secondary'].includes(PROJECTS_META[id].priority), `"${id}" has an invalid priority`)
  }
})

test('registry: priority matches the existing FEATURED/APPLICATION grouping exactly', () => {
  for (const id of FEATURED_PROJECT_IDS) {
    assert.equal(PROJECTS_META[id].priority, 'primary', `"${id}" is featured but not marked primary`)
  }
  for (const id of APPLICATION_PROJECT_IDS) {
    assert.equal(PROJECTS_META[id].priority, 'secondary', `"${id}" is an application project but not marked secondary`)
  }
})

test('registry: every project has a valid resultsSectionKey (results or product)', () => {
  for (const id of ALL_PROJECT_IDS) {
    assert.ok(['results', 'product'].includes(PROJECTS_META[id].resultsSectionKey), `"${id}" has an invalid resultsSectionKey`)
  }
})

test('registry: Soma is the only "product" project — everything else is an analytical "result"', () => {
  const productIds = ALL_PROJECT_IDS.filter((id) => PROJECTS_META[id].resultsSectionKey === 'product')
  assert.deepEqual(productIds.sort(), ['soma', 'hogares', 'kairos'].sort())
})

test('registry: Related Casework — only Paradigm and PROVIDENTIA have associations; every slug is a real, registered case', () => {
  const KNOWN_REAL_CASE_SLUGS = ['no-show', 'operational-risk', 'demand-forecasting', 'capacity-decision', 'policy-decision']
  for (const id of ALL_PROJECT_IDS) {
    const slugs = getCaseworkSlugsForProject(id)
    assert.ok(Array.isArray(slugs))
    for (const slug of slugs) {
      assert.ok(KNOWN_REAL_CASE_SLUGS.includes(slug), `"${id}" links to unknown/phantom case slug "${slug}"`)
    }
  }
  assert.deepEqual(getCaseworkSlugsForProject('paradigm').sort(), ['no-show', 'operational-risk'].sort())
  // PROVIDENTIA (Phase 5): Case 05 — Policy & Decision Intelligence — added
  // alongside the two it already had. Exactly three, never a phantom case.
  assert.deepEqual(
    getCaseworkSlugsForProject('providentia').sort(),
    ['demand-forecasting', 'capacity-decision', 'policy-decision'].sort(),
  )
  const projectsWithCasework = ALL_PROJECT_IDS.filter((id) => getCaseworkSlugsForProject(id).length > 0)
  assert.deepEqual(projectsWithCasework.sort(), ['paradigm', 'providentia'].sort())
})

test('getTerritoryForProject: every real project resolves to a territory; an unknown id resolves to none', () => {
  for (const id of ALL_PROJECT_IDS) {
    assert.ok(getTerritoryForProject(id), `"${id}" has no territory`)
  }
  assert.equal(getTerritoryForProject('not-a-real-project'), null)
})

// --- Phase 4: Project Detail routing/title, for every real project id ------

test('every project id: #projects/<id> resolves to project-detail with its own distinct render key', () => {
  const keys = new Set()
  for (const id of ALL_PROJECT_IDS) {
    const route = resolveAppRoute(`#projects/${id}`, routerDeps)
    const key = getRenderKey(route)
    assert.ok(!keys.has(key), `render key for "${id}" collides with another project's`)
    keys.add(key)
  }
})

test('every project id: document title uses the real project title from the registry', () => {
  const t = (key) => key // title lookup doesn't need real i18n strings for this check
  for (const id of ALL_PROJECT_IDS) {
    const route = resolveAppRoute(`#projects/${id}`, routerDeps)
    const title = getRouteTitle(route, t)
    assert.ok(title.includes(getProjectMeta(id).title), `title for "${id}" did not include its registry title`)
  }
})
