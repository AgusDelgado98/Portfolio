import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

import { buildAll } from '../tools/figures/build-figures.mjs'
import { translations } from './i18n/translations.js'

/**
 * F8 — About «Superficie de decisión»: EvolutionRoute, trayectoria, matrix.
 */

const srcDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.dirname(srcDir)
const es = translations.es
const en = translations.en

function read(rel) {
  return fs.readFileSync(path.join(srcDir, rel), 'utf8')
}

function strip(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

test('F8 EvolutionRoute: geometry only, published markers, no DECERNO', () => {
  const generated = buildAll()['public/figures/evolution-route.svg']
  const onDisk = fs.readFileSync(path.join(rootDir, 'public/figures/evolution-route.svg'), 'utf8')
  assert.equal(onDisk, generated)
  assert.ok(!/<(text|script|image|filter|foreignObject)\b/.test(generated))
  assert.ok(!/decerno/i.test(generated))
  assert.ok(!/decerno/i.test(JSON.stringify(buildAll()['src/components/home/figureMeta.js'])))
  const meta = JSON.parse(
    buildAll()
      ['src/components/home/figureMeta.js'].match(/export const FIGURE_META = (\{[\s\S]*\})\n/)[1],
  )
  assert.deepEqual(Object.keys(meta.route.markers).sort(), ['paradigm', 'providentia'])
  assert.ok(!('decerno' in meta.route.markers))
})

test('F8 About: R4 structure, dedicación parcial, DataCamp without certificate wording', () => {
  const about = strip(read('components/About.jsx'))
  assert.ok(about.includes('EvolutionRoute'))
  assert.ok(about.includes('about.path.areas'))
  assert.ok(about.includes('MATRIX_ROWS'))
  assert.ok(about.includes('ds-home'))
  assert.ok(about.includes('Seam'))
  assert.ok(!/decerno/i.test(about))
  assert.ok(!/Decisión bajo restricciones|Decision under constraints/i.test(JSON.stringify(es.about) + JSON.stringify(en.about)))

  assert.match(es.about.profile.lede, /dedicación parcial/)
  assert.match(en.about.profile.lede, /partial dedication/)
  assert.match(es.contact.experienceJobs[0].meta, /Dedicación parcial/)
  assert.match(en.contact.experienceJobs[0].meta, /Partial dedication/)

  const training = JSON.stringify(es.about.path.areas.training) + JSON.stringify(en.about.path.areas.training)
  assert.match(training, /DataCamp/)
  assert.ok(!/certificado|certificate/i.test(training))

  assert.equal(es.about.skills.rows.ml && en.about.skills.rows.ml !== undefined, true)
  assert.equal(es.about.skills.cols.paradigm, 'PARADIGM')
  assert.ok(!('decerno' in es.about.skills.cols))
  assert.ok(es.about.skills.notes.length === en.about.skills.notes.length)
  assert.ok(es.about.skills.notes.some((n) => /sintéticos|sintét/.test(n)))
  assert.ok(en.about.skills.notes.some((n) => /synthetic/i.test(n)))
  assert.ok(es.about.skills.notes.some((n) => /ETS/))
  assert.ok(en.about.skills.notes.some((n) => /ETS/))
})

test('F8 About: no DECERNO in about copy, figure component or CSS', () => {
  for (const file of [
    'components/About.jsx',
    'components/figures/EvolutionRoute.jsx',
    'styles/about.css',
    'i18n/messages/ui.js',
  ]) {
    assert.ok(!/decerno/i.test(read(file)), file)
  }
})

test('F8 EvolutionRoute weight fits the shared figure budget', () => {
  const buf = fs.readFileSync(path.join(rootDir, 'public/figures/evolution-route.svg'))
  const gzip = zlib.gzipSync(buf, { level: 9 }).length
  assert.ok(gzip <= 3_000, `evolution-route ${gzip} B gzip`)
  const total = fs
    .readdirSync(path.join(rootDir, 'public/figures'))
    .filter((f) => f.endsWith('.svg'))
    .reduce((sum, file) => sum + zlib.gzipSync(fs.readFileSync(path.join(rootDir, 'public/figures', file)), { level: 9 }).length, 0)
  assert.ok(total <= 80_000, `all figures ${total} B gzip`)
})
