import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ALL_PROJECT_IDS,
  hasProject,
  getProjectMeta,
  getVisibleProjects,
  PROJECT_REGISTRY,
} from './registry.js'
import { resolveAppRoute, getRenderKey } from '../router/resolveAppRoute.js'
import { getRouteTitle } from '../router/documentTitle.js'
import { getPublicCaseStudiesForProject } from './caseStudies.js'

const WITHOUT_STACK = ['aletheia']

test('registry: every visible id has metadata with an id and a title (and a stack, unless none is documented)', () => {
  for (const id of ALL_PROJECT_IDS) {
    const meta = getProjectMeta(id)
    assert.ok(meta, `missing metadata for "${id}"`)
    assert.equal(meta.id, id)
    assert.ok(meta.title && meta.title.length > 0)
    assert.ok(Array.isArray(meta.stack))
    if (!WITHOUT_STACK.includes(id)) assert.ok(meta.stack.length > 0, `"${id}" has an empty stack`)
  }
})

test('hasProject/getProjectMeta: known vs unknown ids', () => {
  assert.equal(hasProject('providentia'), true)
  assert.equal(hasProject('not-a-real-project'), false)
  assert.equal(getProjectMeta('providentia')?.title, 'PROVIDENTIA')
  assert.equal(getProjectMeta('not-a-real-project'), null)
})

const routerDeps = undefined

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

test('registry: every project has a valid resultsSectionKey (results or product)', () => {
  for (const id of ALL_PROJECT_IDS) {
    assert.ok(['results', 'product'].includes(getProjectMeta(id).resultsSectionKey), `"${id}" has an invalid resultsSectionKey`)
  }
})

test('registry: Soma, Hogares and Kairós stay product projects; only Soma is public', () => {
  const productIds = PROJECT_REGISTRY.filter((project) => project.resultsSectionKey === 'product').map((project) => project.id)
  assert.deepEqual(productIds.sort(), ['hogares', 'kairos', 'soma'])
  const publicIds = ALL_PROJECT_IDS.filter((id) => getProjectMeta(id).resultsSectionKey === 'product')
  assert.deepEqual(publicIds, ['soma'])
})

test('registry: case studies — only Paradigm, PROVIDENTIA and ALETHEIA have public cases', () => {
  const withCases = ALL_PROJECT_IDS.filter((id) => getPublicCaseStudiesForProject(id).length > 0)
  assert.deepEqual(withCases.sort(), ['aletheia', 'paradigm', 'providentia'])
  assert.deepEqual(
    getPublicCaseStudiesForProject('providentia').map((study) => study.slug).sort(),
    ['capacity-decision', 'demand-forecasting', 'policy-decision'],
  )
  assert.deepEqual(
    getPublicCaseStudiesForProject('paradigm').map((study) => study.slug).sort(),
    ['no-show', 'operational-risk'],
  )
  assert.deepEqual(
    getPublicCaseStudiesForProject('aletheia').map((study) => study.slug),
    ['evidence-case'],
  )
})

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
  const t = (key) => key
  for (const id of ALL_PROJECT_IDS) {
    const route = resolveAppRoute(`#projects/${id}`, routerDeps)
    const title = getRouteTitle(route, t)
    assert.ok(title.includes(getProjectMeta(id).title), `title for "${id}" did not include its registry title`)
  }
})

test('catalog order is flagship, featured, standard, then compact', () => {
  assert.deepEqual(
    getVisibleProjects().map((project) => project.id),
    [
      'providentia',
      'caelum',
      'aletheia',
      'paradigm',
      'soma',
      'tekmerion',
      'lumenvox',
      'clarusflow',
    ],
  )
})
