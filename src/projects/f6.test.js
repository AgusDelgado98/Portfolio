import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FINAL_WAPE } from '../visual/data/providentia.js'
import { formatPercent } from '../visual/format.js'
import { spotlightFacts } from '../components/figures/spotlightFacts.js'
import { homeEs, homeEn } from '../i18n/messages/home.js'
import { projectsCopy } from '../i18n/messages/projects.js'
import { getSpotlightProjectIds } from './registry.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const srcDir = path.join(rootDir, 'src')
const read = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8')
const strip = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

test('F6 figures: ForecastFan and QualityMosaic require a conceptual legend', () => {
  for (const file of ['components/figures/ForecastFan.jsx', 'components/figures/QualityMosaic.jsx']) {
    const source = strip(read(file))
    assert.match(source, /copy\.note/)
    assert.match(source, /if \(!copy/)
    assert.match(source, /home-pfig__note/)
  }
  assert.match(homeEs.selected.projects.providentia.figure.note, /concept/i)
  assert.match(homeEs.selected.projects.providentia.figure.note, /no es un pronóstico|ilustrativa/i)
  assert.match(homeEn.selected.projects.providentia.figure.note, /conceptual/i)
  assert.match(homeEn.selected.projects.providentia.figure.note, /not a forecast/i)
  assert.match(homeEs.selected.projects.paradigm.figure.note, /concept/i)
  assert.match(homeEn.selected.projects.paradigm.figure.note, /conceptual/i)
})

test('F6 PROVIDENTIA facts: ETS primary, LightGBM sensitivity, WAPE from frozen FINAL_WAPE', () => {
  const es = spotlightFacts('providentia', homeEs.selected.projects.providentia, 'es')
  const en = spotlightFacts('providentia', homeEn.selected.projects.providentia, 'en')
  assert.ok(es.some((row) => /ETS/i.test(row.value) && /principal/i.test(row.value)))
  assert.ok(en.some((row) => /ETS/i.test(row.value) && /primary/i.test(row.value)))
  assert.ok(es.some((row) => /LightGBM/i.test(row.value) && /sensibilidad/i.test(row.value)))
  assert.ok(en.some((row) => /LightGBM/i.test(row.value) && /sensitivity/i.test(row.value)))
  const resultEs = es.find((row) => row.label === homeEs.selected.projects.providentia.facts.resultLabel)
  const resultEn = en.find((row) => row.label === homeEn.selected.projects.providentia.facts.resultLabel)
  assert.ok(resultEs.value.includes(formatPercent(FINAL_WAPE.ets, 'es')))
  assert.ok(resultEs.value.includes(formatPercent(FINAL_WAPE.naive, 'es')))
  assert.ok(resultEn.value.includes(formatPercent(FINAL_WAPE.ets, 'en')))
  assert.ok(resultEn.value.includes(formatPercent(FINAL_WAPE.naive, 'en')))
  const blob = JSON.stringify(es) + JSON.stringify(en)
  assert.ok(!/\bahorro\b|optimal capacity/i.test(blob))
  assert.match(blob, /no capacidad hospitalaria real|not real hospital capacity/i)
})

test('F6 PARADIGM facts: synthetic data, moderate signal, no clinical claim', () => {
  for (const copy of [homeEs.selected.projects.paradigm, homeEn.selected.projects.paradigm]) {
    const rows = spotlightFacts('paradigm', copy, 'es')
    const text = rows.map((row) => row.value).join(' ')
    assert.match(text, /sintét|synthetic/i)
    assert.match(text, /moderad|moderate/i)
    assert.ok(!/clínic|clinical/i.test(text) || /no es un modelo clínico|not a clinical/i.test(text))
  }
  assert.ok(homeEs.selected.projects.paradigm.tags.some((tag) => /ML|calidad|Calidad/i.test(tag)))
  assert.ok(homeEn.selected.projects.paradigm.tags.some((tag) => /ML|quality|Quality/i.test(tag)))
})

test('F6 ForecastFan is not mounted on Project Detail (ficha); listing uses the shared component', () => {
  const detail = strip(read('components/ProjectDetail.jsx'))
  assert.ok(!/ForecastFan|forecast-fan|QualityMosaic|quality-mosaic/.test(detail))
  const spotlight = strip(read('components/projects/ProjectsSpotlight.jsx'))
  assert.match(spotlight, /SpotlightFigure/)
  assert.match(spotlight, /spotlightFacts/)
  const home = strip(read('components/home/FeaturedProjects.jsx'))
  assert.match(home, /SpotlightFigure/)
  assert.ok(!/FIGURE_META\.fan|forecast-fan\.svg/.test(home))
})

test('F6 hero adapts to published spotlight count (two today)', () => {
  assert.deepEqual(getSpotlightProjectIds(), ['providentia', 'paradigm'])
  const hero = strip(read('components/projects/ProjectsHero.jsx'))
  assert.match(hero, /titleByCount/)
  assert.match(hero, /getSpotlightProjectIds/)
  assert.match(hero, /\.question/)
})

test('F6 PROVIDENTIA detail copy keeps ETS primary and LightGBM as sensitivity (ES/EN)', () => {
  const es = projectsCopy.providentia.es.detail
  const en = projectsCopy.providentia.en.detail
  assert.ok(es.method.some((step) => /ETS \(modelo principal\)/.test(step.body) && /LightGBM \(sensibilidad\)/.test(step.body)))
  assert.ok(en.method.some((step) => /ETS \(primary model\)/.test(step.body) && /LightGBM \(sensitivity\)/.test(step.body)))
})

test('F6 components never name a withheld project', () => {
  for (const file of [
    'components/figures/ForecastFan.jsx',
    'components/figures/QualityMosaic.jsx',
    'components/figures/spotlightFigures.jsx',
    'components/figures/spotlightFacts.js',
    'components/projects/ProjectsHero.jsx',
    'components/projects/ProjectsSpotlight.jsx',
  ]) {
    assert.ok(!/decerno/i.test(read(file)), file)
  }
})
