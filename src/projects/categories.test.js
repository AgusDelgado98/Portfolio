import test from 'node:test'
import assert from 'node:assert/strict'

import {
  MIN_PROJECTS_FOR_FILTER,
  ALL_FILTER_ID,
  CATEGORIES,
  CATEGORY_IDS,
  isValidCategory,
  getPrimaryCategory,
  countProjectsByCategory,
  isFilterVisible,
  getVisibleFilterCategories,
  filterProjectsByCategory,
} from './categories.js'
import { categoryLabels, pickCategoryLabel } from '../i18n/messages/projects.js'

const project = (id, categories) => ({ id, categories })

test('categories: the five categories exist, evidence-research included', () => {
  assert.deepEqual(
    [...CATEGORY_IDS],
    ['analytics-bi', 'ds-ml', 'applied-ai', 'products', 'evidence-research'],
  )
  for (const id of CATEGORY_IDS) assert.equal(isValidCategory(id), true)
  assert.equal(isValidCategory('evidence-research'), true)
  assert.equal(isValidCategory('data-bi'), false)
  assert.equal(isValidCategory('all'), false, '"all" is a pseudo-filter, not a category')
  assert.equal(isValidCategory(undefined), false)
})

test('categories: display order is explicit and unique', () => {
  const orders = CATEGORIES.map((category) => category.order)
  assert.equal(new Set(orders).size, orders.length)
  assert.deepEqual([...orders].sort((a, b) => a - b), orders)
})

test('MIN_PROJECTS_FOR_FILTER is 2', () => {
  assert.equal(MIN_PROJECTS_FOR_FILTER, 2)
})

test('filters: a category with one visible project gets no filter; with two it does', () => {
  const one = [project('a', ['ds-ml']), project('b', ['analytics-bi'])]
  assert.deepEqual(getVisibleFilterCategories(one), [])
  const two = [project('a', ['ds-ml']), project('b', ['ds-ml']), project('c', ['analytics-bi'])]
  assert.deepEqual(getVisibleFilterCategories(two), ['ds-ml'])
  assert.equal(isFilterVisible('ds-ml', two), true)
  assert.equal(isFilterVisible('analytics-bi', two), false)
})

test('filters: secondary categories count toward the threshold (a project is counted in every category it lists)', () => {
  const projects = [project('a', ['ds-ml', 'analytics-bi']), project('b', ['analytics-bi'])]
  assert.deepEqual(countProjectsByCategory(projects), {
    'analytics-bi': 2,
    'ds-ml': 1,
    'applied-ai': 0,
    products: 0,
    'evidence-research': 0,
  })
  assert.deepEqual(getVisibleFilterCategories(projects), ['analytics-bi'])
})

test('filters: the threshold is exactly "at least MIN" — the boundary is inclusive', () => {
  const justEnough = Array.from({ length: MIN_PROJECTS_FOR_FILTER }, (_, i) => project(`p${i}`, ['products']))
  const oneShort = justEnough.slice(1)
  assert.equal(isFilterVisible('products', justEnough), true)
  assert.equal(isFilterVisible('products', oneShort), false)
})

test('filters: visible filters come out in display order, not input order', () => {
  const projects = [
    project('a', ['products']),
    project('b', ['products']),
    project('c', ['analytics-bi']),
    project('d', ['analytics-bi']),
  ]
  assert.deepEqual(getVisibleFilterCategories(projects), ['analytics-bi', 'products'])
})

test('filters: a project that lists the same category twice is counted once', () => {
  assert.deepEqual(countProjectsByCategory([project('a', ['ds-ml', 'ds-ml'])])['ds-ml'], 1)
})

test('filters: unknown categories and malformed projects are ignored, never thrown on', () => {
  const counts = countProjectsByCategory([project('a', ['made-up']), {}, null, undefined, { categories: null }])
  assert.deepEqual(Object.values(counts), [0, 0, 0, 0, 0])
  assert.deepEqual(getVisibleFilterCategories(undefined), [])
})

test('filterProjectsByCategory: "all" returns everything in order; a category returns only its members (any position)', () => {
  const projects = [project('a', ['ds-ml', 'analytics-bi']), project('b', ['analytics-bi']), project('c', ['products'])]
  assert.deepEqual(filterProjectsByCategory(projects, ALL_FILTER_ID).map((p) => p.id), ['a', 'b', 'c'])
  assert.deepEqual(filterProjectsByCategory(projects, 'analytics-bi').map((p) => p.id), ['a', 'b'])
  assert.deepEqual(filterProjectsByCategory(projects, 'ds-ml').map((p) => p.id), ['a'])
  assert.deepEqual(filterProjectsByCategory(projects, 'applied-ai'), [])
  assert.notEqual(filterProjectsByCategory(projects, ALL_FILTER_ID), projects, '"all" must return a copy')
})

test('getPrimaryCategory is categories[0]', () => {
  assert.equal(getPrimaryCategory(project('a', ['ds-ml', 'analytics-bi'])), 'ds-ml')
  assert.equal(getPrimaryCategory(project('a', [])), null)
  assert.equal(getPrimaryCategory(null), null)
})

test('labels: every category and the "all" pseudo-filter have non-empty ES and EN labels, even when their filter is hidden', () => {
  for (const language of ['es', 'en']) {
    for (const id of [ALL_FILTER_ID, ...CATEGORY_IDS]) {
      const label = pickCategoryLabel(id, language)
      assert.ok(typeof label === 'string' && label.length > 0 && label !== id, `${language} label for "${id}"`)
    }
  }
  assert.deepEqual(Object.keys(categoryLabels.es).sort(), Object.keys(categoryLabels.en).sort())
  assert.equal(pickCategoryLabel('products', 'en'), 'Products & Engineering')
  assert.equal(pickCategoryLabel('evidence-research', 'es'), 'Evidence / Research')
  assert.equal(pickCategoryLabel('ds-ml', 'es'), 'Data Science / ML')
})
