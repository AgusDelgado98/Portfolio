import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Contrast checks for the design tokens (F1). tokens.css promises that text meets
 * 4.5:1 and graphics / interactive borders meet 3:1 against the dark surfaces;
 * this file is what enforces it. It also pins the palette rule that the bright
 * copper is never used as text on paper (2.0:1) — the paper variant is --ds-copper-ink.
 */

const css = readFileSync(fileURLToPath(new URL('./tokens.css', import.meta.url)), 'utf8')

function token(name) {
  const match = css.match(new RegExp(`${name}:\\s*([^;]+);`))
  assert.ok(match, `${name} is not defined in tokens.css`)
  return match[1].trim()
}

function parse(value) {
  const hex = value.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 }
  }
  const rgba = value.match(/^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)$/)
  assert.ok(rgba, `cannot parse color: ${value}`)
  return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: +rgba[4] }
}

/** Composites `fg` (possibly translucent) over an opaque `bg`. */
function over(fg, bg) {
  return { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 }
}

function luminance({ r, g, b }) {
  const channel = (v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function ratio(fg, bg) {
  const solid = over(fg, bg)
  const [light, dark] = [luminance(solid), luminance(bg)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

const color = (name) => parse(token(name))
const SURFACES = ['--ds-bg-0', '--ds-bg-1', '--ds-bg-2']

test('text tokens reach 4.5:1 on every dark surface', () => {
  for (const text of ['--ds-text', '--ds-text-2', '--ds-text-3', '--ds-mist', '--ds-sand', '--ds-copper']) {
    for (const surface of SURFACES) {
      const value = ratio(color(text), color(surface))
      assert.ok(value >= 4.5, `${text} on ${surface} is ${value.toFixed(2)}:1`)
    }
  }
})

test('graphics and interactive borders reach 3:1 on every dark surface', () => {
  for (const graphic of ['--ds-border-strong', '--ds-focus', '--ds-data', '--ds-evidence', '--ds-prediction', '--ds-decision']) {
    for (const surface of SURFACES) {
      const value = ratio(color(graphic), color(surface))
      assert.ok(value >= 3, `${graphic} on ${surface} is ${value.toFixed(2)}:1`)
    }
  }
})

test('paper surface: text and ink variants reach 4.5:1; bright copper does not (and is not for text)', () => {
  const paper = color('--ds-paper')
  for (const text of ['--ds-paper-text', '--ds-paper-text-2', '--ds-copper-ink']) {
    const value = ratio(color(text), paper)
    assert.ok(value >= 4.5, `${text} on --ds-paper is ${value.toFixed(2)}:1`)
  }
  assert.ok(ratio(color('--ds-copper'), paper) < 3, 'the bright copper must stay a dark-surface color')
})

test('the dark surfaces are ordered from darkest to lightest', () => {
  const [a, b, c] = SURFACES.map((name) => luminance(color(name)))
  assert.ok(a < b && b < c)
})

test('the decorative hairline stays below 3:1 (it separates, it never carries information)', () => {
  assert.ok(ratio(color('--ds-border'), color('--ds-bg-0')) < 3)
})

test('the new palette tokens exist with the approved values', () => {
  const expected = {
    '--ds-abyss': '#0a151a',
    '--ds-abyss-2': '#071015',
    '--ds-petrol': '#2b5563',
    '--ds-mist': '#86a9b3',
    '--ds-ivory': '#f1ebdd',
    '--ds-paper': '#f3eee2',
    '--ds-sand': '#e7d2ac',
    '--ds-copper': '#d6a266',
    '--ds-copper-ink': '#8a5a22',
  }
  for (const [name, value] of Object.entries(expected)) assert.equal(token(name).toLowerCase(), value, name)
})
