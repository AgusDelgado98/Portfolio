import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import {
  POLICY_TRADEOFF,
  REFERENCE_POLICY_ID,
  FINAL_WAPE,
  FINAL_PI90_COVERAGE,
  FINAL_MEAN_WIDTH,
  BAND_RATIOS,
} from './data/providentia.js'
import { CAELUM_LAYERS, CAELUM_DBT_TESTS } from './data/caelum.js'
import { ALETHEIA_COUNTS } from './data/aletheia.js'
import { TEKMERION_MACRO_F1 } from './data/tekmerion.js'
import { ALETHEIA_METRICS } from '../casework/aletheia/data.js'
import { projectsCopy } from '../i18n/messages/projects.js'
import { formatPercent, formatNumber } from './format.js'
import { dotGrid, dotsPath, bandPaths } from './geometry.js'

const here = dirname(fileURLToPath(import.meta.url))
const pack = (...segments) => join(here, '..', '..', 'public', 'casework', ...segments)

function readCsv(path) {
  const [header, ...lines] = readFileSync(path, 'utf8').trim().split(/\r?\n/)
  const columns = header.split(',')
  return lines.map((line) => Object.fromEntries(line.split(',').map((cell, index) => [columns[index], cell])))
}

const TOLERANCE = 1e-9

test('PROVIDENTIA trade-off: matches policy_tradeoff.csv (FINAL_LOCKED_EVALUATION, ets_aicc) exactly', () => {
  const rows = readCsv(pack('capacity-decision', 'evidence-pack', 'policy_tradeoff.csv')).filter(
    (row) => row.evaluation_label === 'FINAL_LOCKED_EVALUATION' && row.model_id === 'ets_aicc',
  )
  assert.equal(rows.length, 3)
  assert.equal(POLICY_TRADEOFF.length, 3)
  for (const point of POLICY_TRADEOFF) {
    const row = rows.find((candidate) => candidate.protection_policy_id === `${point.id}_POLICY`)
    assert.ok(row, `no CSV row for ${point.id}`)
    assert.ok(Math.abs(Number(row.policy_level) - point.level) < TOLERANCE, `${point.id} level`)
    assert.ok(Math.abs(Number(row.mean_buffer) - point.meanBuffer) < TOLERANCE, `${point.id} mean buffer`)
    assert.ok(Math.abs(Number(row.exceedance_rate) - point.exceedanceRate) < TOLERANCE, `${point.id} exceedance`)
  }
})

test('PROVIDENTIA trade-off: PI90 is the frozen reference policy, per the CSV', () => {
  const reference = readCsv(pack('capacity-decision', 'evidence-pack', 'policy_tradeoff.csv')).find(
    (row) =>
      row.evaluation_label === 'FINAL_LOCKED_EVALUATION' &&
      row.model_id === 'ets_aicc' &&
      row.evaluation_role === 'reference',
  )
  assert.equal(reference.protection_policy_id, `${REFERENCE_POLICY_ID}_POLICY`)
})

test('PROVIDENTIA trade-off: the numbers shown on Home (buffer 100 / 135 / 168, exceedance 10,9 / 6,1 / 3,6 %) are these', () => {
  assert.deepEqual(POLICY_TRADEOFF.map((p) => Math.round(p.meanBuffer)), [100, 135, 168])
  assert.deepEqual(POLICY_TRADEOFF.map((p) => formatPercent(p.exceedanceRate, 'es')), ['10,9 %', '6,1 %', '3,6 %'])
  assert.deepEqual(POLICY_TRADEOFF.map((p) => formatPercent(p.exceedanceRate, 'en')), ['10.9%', '6.1%', '3.6%'])
})

test('PROVIDENTIA metrics: WAPE, PI90 coverage and interval widths match forecasting_metrics.csv (FINAL_LOCKED_EVALUATION)', () => {
  const rows = readCsv(pack('demand-forecasting', 'evidence-pack', 'forecasting_metrics.csv')).filter(
    (row) => row.evaluation_set === 'FINAL_LOCKED_EVALUATION',
  )
  const wape = (model) =>
    Number(rows.find((row) => row.model_id === model && row.metric_family === 'point' && row.metric_id === 'wape').value)
  assert.ok(Math.abs(wape('ets_aicc') - FINAL_WAPE.ets) < TOLERANCE)
  assert.ok(Math.abs(wape('naive') - FINAL_WAPE.naive) < TOLERANCE)
  assert.ok(Math.abs(wape('seasonal_naive') - FINAL_WAPE.seasonalNaive) < TOLERANCE)
  const interval = (metric, level) =>
    Number(
      rows.find(
        (row) =>
          row.model_id === 'ets_aicc' &&
          row.metric_family === 'interval' &&
          row.metric_id === metric &&
          Number(row.level) === level,
      ).value,
    )
  assert.ok(Math.abs(interval('coverage', 0.9) - FINAL_PI90_COVERAGE.observed) < TOLERANCE)
  assert.equal(FINAL_PI90_COVERAGE.nominal, 0.9)
  assert.deepEqual(
    [0.8, 0.9, 0.95].map((level) => interval('mean_width', level)),
    [...FINAL_MEAN_WIDTH],
  )
})

test('PROVIDENTIA metrics: the headline reads 9,2 % vs 10,7 % (naïve) and 89,6 % coverage', () => {
  assert.equal(formatPercent(FINAL_WAPE.ets, 'es'), '9,2 %')
  assert.equal(formatPercent(FINAL_WAPE.naive, 'en'), '10.7%')
  assert.equal(formatPercent(FINAL_PI90_COVERAGE.observed, 'es'), '89,6 %')
  assert.ok(FINAL_WAPE.ets < FINAL_WAPE.naive, 'the headline compares against a baseline it actually beats')
})

test('hero bands: ratios are the real interval-width ratios (1 : 1.34 : 1.68)', () => {
  assert.equal(BAND_RATIOS[0], 1)
  assert.ok(Math.abs(BAND_RATIOS[1] - 1.3448) < 1e-3)
  assert.ok(Math.abs(BAND_RATIOS[2] - 1.6779) < 1e-3)
})

test('Caelum: layer counts and dbt tests match the approved project copy (ES and EN)', () => {
  assert.deepEqual(
    CAELUM_LAYERS.map((layer) => [layer.id, layer.count]),
    [
      ['staging', 8],
      ['dimensions', 5],
      ['facts', 3],
      ['marts', 2],
    ],
  )
  const es = projectsCopy.caelum.es
  const en = projectsCopy.caelum.en
  assert.ok(es.impactHighlight.includes('8 staging → 5 dimensiones → 3 hechos → 2 marts → Power BI'))
  assert.ok(
    ['8 staging', '5 dimensions', '3 facts', '2 marts'].every((fragment) => en.impactHighlight.includes(fragment)),
  )
  assert.ok(es.highlights.some((line) => line.startsWith(`${CAELUM_DBT_TESTS} tests dbt`)))
  assert.ok(en.highlights.some((line) => line.startsWith(`${CAELUM_DBT_TESTS} dbt `)))
})

test('ALETHEIA: counts equal the Evidence Case data (22 sources, 16 statistical objects, 8 breaks)', () => {
  assert.equal(ALETHEIA_COUNTS.sources, ALETHEIA_METRICS.sourceManifestRecords)
  assert.equal(ALETHEIA_COUNTS.statisticalObjects, ALETHEIA_METRICS.statisticalObjects)
  assert.equal(ALETHEIA_COUNTS.breaks, ALETHEIA_METRICS.statisticalBreaks)
})

test('Tekmérion: Macro F1 figures are the ones published in the project copy', () => {
  for (const language of ['es', 'en']) {
    const highlight = projectsCopy.tekmerion[language].impactHighlight
    assert.match(highlight, /0\.866/)
    assert.match(highlight, /0\.816/)
    assert.match(highlight, /promote_ml=false/)
  }
  assert.equal(TEKMERION_MACRO_F1.rules, 0.866)
  assert.equal(TEKMERION_MACRO_F1.linearSvm, 0.816)
})

test('format: Spanish uses a decimal comma, English a point', () => {
  assert.equal(formatNumber(134.9385, 'es', 1), '134,9')
  assert.equal(formatNumber(134.9385, 'en', 1), '134.9')
  assert.equal(formatNumber(168.37, 'en'), '168')
})

test('geometry: dot grids and bands are deterministic and well-formed', () => {
  const grid = { cols: 5, rows: 6, x0: 36, y0: 74, dx: 24, dy: 50 }
  assert.deepEqual(dotGrid(grid), dotGrid(grid))
  assert.equal(dotGrid(grid).length, 30)
  assert.ok(dotsPath(dotGrid(grid)).startsWith('M'))
  const bands = bandPaths({ x0: 0, y0: 0, x1: 100, y1: -10, halfWidth: 10, ratios: BAND_RATIOS })
  assert.equal(bands.paths.length, 3)
  assert.deepEqual(bands.endHalfWidths, [10, 13.4, 16.8])
  assert.ok(bands.paths.every((d) => d.startsWith('M') && d.endsWith('Z')))
})
