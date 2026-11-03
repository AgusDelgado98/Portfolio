import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'
import { buildAll } from '../../tools/figures/build-figures.mjs'
import { FIGURE_META } from '../components/home/figureMeta.js'
import { uiEs, uiEn } from '../i18n/messages/ui.js'
import { getOtherProjectIds, getSpotlightProjectIds, getComplementaryProjectIds } from './registry.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const srcDir = path.join(rootDir, 'src')
const read = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8')
const strip = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

function leaves(node, prefix, out) {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) leaves(value, prefix ? `${prefix}.${key}` : key, out)
    return
  }
  out.push(prefix)
}

test('F5 Projects index: hero, seam, spotlight and other projects — no filters, no carousel', () => {
  const index = strip(read('components/ProjectsIndex.jsx'))
  assert.match(index, /ProjectsHero/)
  assert.match(index, /Seam/)
  assert.match(index, /ProjectsSpotlight/)
  assert.match(index, /OtherProjects/)
  assert.ok(!/FilterBar|ProjectGrid|getVisibleCategoryFilters|useState/.test(index))
  assert.ok(!/ProjectsAtlas|ProjectsCards|carousel|swiper/i.test(index))
})

test('F5 hero: three framing questions in ES/EN, same structure, without naming a withheld project', () => {
  for (const copy of [uiEs.projects.hero, uiEn.projects.hero]) {
    assert.equal(copy.questions.length, 3)
    assert.deepEqual(
      copy.questions.map((q) => q.n),
      ['01', '02', '03'],
    )
    for (const q of copy.questions) assert.ok(q.text.length > 4)
  }
  const esKeys = []
  const enKeys = []
  leaves(uiEs.projects.hero, '', esKeys)
  leaves(uiEn.projects.hero, '', enKeys)
  assert.deepEqual(esKeys.sort(), enKeys.sort())
  assert.ok(!/decerno/i.test(JSON.stringify(uiEs.projects.hero)))
  assert.ok(!/decerno/i.test(JSON.stringify(uiEn.projects.hero)))
  assert.match(uiEs.projects.hero.titleEm, /^preguntas$/)
  assert.match(uiEn.projects.hero.titleEm, /^questions$/)
})

test('F5 ContourMap: generated asset, geometry only, labelled as conceptual, no withheld project name', () => {
  assert.ok(fs.existsSync(path.join(rootDir, 'public/figures/contour-map.svg')))
  const generated = buildAll()['public/figures/contour-map.svg']
  assert.equal(fs.readFileSync(path.join(rootDir, 'public/figures/contour-map.svg'), 'utf8'), generated)
  const svg = generated
  assert.ok(!/<(text|script|image|filter|foreignObject)\b/.test(svg))
  assert.ok(!/decerno/i.test(svg))
  assert.ok(FIGURE_META.contour)
  assert.equal(FIGURE_META.contour.W, 700)
  assert.equal(FIGURE_META.contour.H, 600)
  for (const key of ['action', 'hold', 'contextA', 'contextB', 'threshold']) {
    const label = FIGURE_META.contour.labels[key]
    assert.ok(label, key)
    assert.ok(label.x >= 0 && label.x <= 100, `${key}.x`)
    assert.ok(label.y >= 0 && label.y <= 100, `${key}.y`)
  }
  for (const copy of [uiEs.projects.contour, uiEn.projects.contour]) {
    assert.match(copy.note, /concept/i)
    assert.ok(copy.alt.length > 20)
    assert.ok(copy.action && copy.hold && copy.contextA && copy.contextB && copy.threshold)
  }
  const contour = strip(read('components/projects/ContourFigure.jsx'))
  assert.match(contour, /contour-map\.svg/)
  assert.match(contour, /FIGURE_META\.contour/)
  assert.ok(!/decerno/i.test(contour))
})

test('F5 ContourMap weight fits the figure budget without raising the 80 KB total', () => {
  const buf = fs.readFileSync(path.join(rootDir, 'public/figures/contour-map.svg'))
  const gzip = zlib.gzipSync(buf, { level: 9 }).length
  assert.ok(gzip <= 14_000, `contour-map ${gzip} B gzip`)
  const total = fs
    .readdirSync(path.join(rootDir, 'public/figures'))
    .filter((f) => f.endsWith('.svg'))
    .reduce((sum, file) => sum + zlib.gzipSync(fs.readFileSync(path.join(rootDir, 'public/figures', file)), { level: 9 }).length, 0)
  assert.ok(total <= 80_000, `all figures ${total} B gzip`)
})

test('F5 Otros proyectos: the five personal ids, existing copy only, each opens its detail', () => {
  assert.deepEqual(getOtherProjectIds(), ['caelum', 'aletheia', 'tekmerion', 'lumenvox', 'clarusflow'])
  const other = strip(read('components/projects/OtherProjects.jsx'))
  assert.match(other, /getOtherProjectIds\(\)/)
  assert.match(other, /projectHash\(id\)/)
  assert.match(other, /mergeProjectCopy/)
  assert.match(other, /nodeSummary/)
  assert.ok(!/FilterBar|carousel|swiper/i.test(other))
  assert.ok(!/decerno/i.test(other))
  const shown = new Set([...getSpotlightProjectIds(), ...getComplementaryProjectIds(), ...getOtherProjectIds()])
  assert.equal(shown.size, 8)
})

test('F5 spotlight and ContourFigure never name a withheld project', () => {
  for (const file of [
    'components/ProjectsIndex.jsx',
    'components/projects/ProjectsHero.jsx',
    'components/projects/ProjectsSpotlight.jsx',
    'components/projects/OtherProjects.jsx',
    'components/projects/ContourFigure.jsx',
  ]) {
    assert.ok(!/decerno/i.test(read(file)), file)
  }
  assert.ok(!/decerno/i.test(JSON.stringify(uiEs.projects.contour)))
  assert.ok(!/decerno/i.test(JSON.stringify(uiEn.projects.contour)))
})

test('F5 ContourFigure is ready but not mounted while no published project uses ContourMap', () => {
  const spotlight = strip(read('components/projects/ProjectsSpotlight.jsx'))
  assert.ok(!/ContourFigure|contour-map/.test(spotlight), 'spotlight must not load ContourMap until a published project uses it')
  assert.match(spotlight, /forecast-fan\.svg/)
  assert.match(spotlight, /quality-mosaic\.svg/)
  assert.match(spotlight, /getSpotlightProjectIds\(\)/)
})
