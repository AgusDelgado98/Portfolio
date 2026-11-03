import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * How the self-hosted fonts are wired (F1): declarations, tokens, aliases, no
 * remaining Google Fonts, preload hygiene and the weight ceiling of Fraunces.
 * File integrity lives in src/assets/fonts/fonts.assets.test.js.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(here, '..')
const rootDir = path.resolve(srcDir, '..')
const read = (...parts) => readFileSync(path.join(...parts), 'utf8')
const manifest = JSON.parse(read(srcDir, 'assets/fonts/fonts.manifest.json'))
const fontsCss = read(here, 'fonts.css')
const tokensCss = read(here, 'tokens.css')
const indexHtml = read(rootDir, 'index.html')

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const sourceFiles = walk(srcDir).filter((file) => /\.(css|js|jsx)$/.test(file) && !/\.test\.js$/.test(file))

test('fonts.css declares every manifest file with font-display: swap and the right weight range', () => {
  const faces = [...fontsCss.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((match) => match[1]).filter((body) => /url\(/.test(body))
  assert.equal(faces.length, manifest.fonts.length)
  for (const font of manifest.fonts) {
    const face = faces.find((body) => body.includes(`/${font.file}`))
    assert.ok(face, `no @font-face points at ${font.file}`)
    assert.match(face, new RegExp(`font-family:\\s*'${font.family}'`))
    assert.match(face, new RegExp(`font-style:\\s*${font.style}`))
    assert.match(face, new RegExp(`font-weight:\\s*${font.weight}\\s*;`))
    assert.match(face, /font-display:\s*swap/)
    assert.match(face, /format\('woff2'\)/)
  }
})

test('tokens: display, body and mono families, each with a generic fallback', () => {
  assert.match(tokensCss, /--ds-font-display:\s*'Fraunces',[^;]*\bserif\s*;/)
  assert.match(tokensCss, /--ds-font-body:\s*'Instrument Sans',[^;]*\bsans-serif\s*;/)
  assert.match(tokensCss, /--ds-font-mono:\s*'IBM Plex Mono',[^;]*\bmonospace\s*;/)
})

test('the legacy --font-* variables are aliases of the --ds-font-* tokens (one source of truth)', () => {
  const legacy = read(srcDir, 'styles.css')
  assert.match(legacy, /--font-display:\s*var\(--ds-font-display\)\s*;/)
  assert.match(legacy, /--font-body:\s*var\(--ds-font-body\)\s*;/)
  assert.match(legacy, /--font-mono:\s*var\(--ds-font-mono\)\s*;/)
})

test('no Google Fonts remain: not in index.html, not in any stylesheet or script', () => {
  assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(indexHtml), 'index.html still references Google Fonts')
  for (const file of sourceFiles) {
    const text = readFileSync(file, 'utf8')
    assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(text), `${path.relative(rootDir, file)} references Google Fonts`)
    assert.ok(!/@import\s+url\(\s*['"]?https?:/.test(text), `${path.relative(rootDir, file)} @imports a remote stylesheet`)
  }
  assert.ok(!/Newsreader|IBM Plex Sans/.test(tokensCss + read(srcDir, 'styles.css')), 'the previous families are still referenced')
})

test('fonts are not preloaded: with a client-rendered app a preload competes with the JavaScript (Home LCP 763 -> 1373 ms measured)', () => {
  const preloads = [...indexHtml.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g)]
  assert.equal(preloads.length, 0, 'a font preload was added: re-measure LCP with Lighthouse before keeping it')
})

test('each web family has a metric-matched fallback face (keeps the font swap from shifting the layout)', () => {
  const faces = [...fontsCss.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((match) => match[1]).filter((body) => /local\(/.test(body))
  for (const family of ['Fraunces', 'Instrument Sans', 'IBM Plex Mono']) {
    const mine = faces.filter((body) => body.includes(`'${family} Fallback'`))
    assert.ok(mine.length >= 1, `${family} Fallback is missing`)
    for (const body of mine) for (const prop of ['size-adjust', 'ascent-override', 'descent-override', 'line-gap-override']) assert.match(body, new RegExp(`${prop}:`))
    assert.match(tokensCss, new RegExp(`'${family}',\\s*'${family} Fallback'`), `${family} Fallback is not in its token stack`)
  }
})

test('Fraunces stops at weight 500: no rule using the display font asks for more', () => {
  const offenders = []
  for (const file of sourceFiles.filter((item) => item.endsWith('.css'))) {
    const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    for (const match of css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
      const body = match[2]
      if (!/font-family:[^;]*var\(--(ds-)?font-display\)/.test(body)) continue
      const weight = body.match(/font-weight:\s*(\d+)/)
      if (weight && Number(weight[1]) > 500) {
        offenders.push(`${path.relative(rootDir, file)}: ${match[1].trim().replace(/\s+/g, ' ')} { font-weight: ${weight[1]} }`)
      }
    }
  }
  assert.deepEqual(offenders, [], 'Fraunces would be synthesized bold')
})
