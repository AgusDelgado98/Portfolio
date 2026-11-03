#!/usr/bin/env node
/**
 * Build budget check — F1 of the "Superficie de decisión" redesign.
 *
 *   node scripts/check-budget.mjs [outDir]        default outDir: dist
 *   node scripts/check-budget.mjs --measured f.json   (optional) compare the fonts
 *       actually requested during a cold load, as recorded by a browser run:
 *       a JSON array of { "url": "...", "bytes": 12345 }.
 *
 * Sizes are gzip level 9 for JS and CSS (the measure the README documents) and
 * raw bytes for WOFF2 (already compressed). Fails with exit code 1 when a budget
 * is exceeded.
 *
 * "Critical" fonts are the font files the browser actually requests to render a page
 * from a cold cache. That cannot be read from the build (the app preloads nothing and
 * which faces a page uses depends on its CSS), so it is only evaluated when a measured
 * list is passed with `--measured`. It is a TARGET: a miss is reported as MISS and does
 * not change the exit code; JS, CSS and total fonts are hard budgets.
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

/** Baseline: main @ 868c767, measured with this script (Node zlib level 9; the shell `gzip -9` differs by ~150 bytes).
 *  docs/design/superficie-de-decision/baseline.md */
export const BUDGET = Object.freeze({
  jsMaxGzip: 110_000, // documented budget for Home's initial JavaScript
  jsBaselineGzip: 103_306, // measured baseline (index-D_IMKLky.js)
  // Cumulative allowance over the baseline for the whole redesign, in bytes. F1 used 0; F2 adds the DECERNO
  // registry entry and the journey data (+216); F3 adds the header behavior and the full-screen menu (+1,250 more,
  // +1,466 in total, measured 104,772). The hard cap above (110 KB) is the real limit: the room left under
  // it is what F4 to F10 share.
  jsTolerance: 1_600,
  cssBaselineGzip: 10_966, // index-DSf8unIR.css
  cssTolerance: 2_048, // maximum planned increase
  fontsTotalMax: 210_000,
  fontsCriticalTarget: 115_000,
})

const args = process.argv.slice(2)
const measuredFlag = args.indexOf('--measured')
const measuredFile = measuredFlag >= 0 ? args[measuredFlag + 1] : null
const outDir = path.resolve(args.find((arg, i) => !arg.startsWith('--') && !(measuredFlag >= 0 && i === measuredFlag + 1)) || 'dist')

const gz = (file) => zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length
const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
const local = (href) => path.join(outDir, href.replace(/^\//, ''))

const entryJs = [...html.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)].map((m) => m[1])
const entryCss = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="(\/[^"]+\.css)"/g)].map((m) => m[1])
const preloaded = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*href="([^"]+)"/g)].map((m) => m[1])
const fontFiles = fs.existsSync(path.join(outDir, 'assets'))
  ? fs.readdirSync(path.join(outDir, 'assets')).filter((name) => name.endsWith('.woff2'))
  : []

const sum = (list, fn) => list.reduce((total, item) => total + fn(item), 0)
const jsGz = sum(entryJs, (href) => gz(local(href)))
const cssGz = sum(entryCss, (href) => gz(local(href)))
const fontsTotal = sum(fontFiles, (name) => fs.statSync(path.join(outDir, 'assets', name)).size)

const checks = [
  ['Initial JS (gzip -9)', jsGz, Math.min(BUDGET.jsMaxGzip, BUDGET.jsBaselineGzip + BUDGET.jsTolerance), true],
  ['Initial CSS (gzip -9)', cssGz, BUDGET.cssBaselineGzip + BUDGET.cssTolerance, true],
  ['Fonts, all files', fontsTotal, BUDGET.fontsTotalMax, true],
]

console.log(`Budget check for ${outDir}\n`)
if (measuredFile) {
  const measured = JSON.parse(fs.readFileSync(measuredFile, 'utf8'))
  checks.push(['Fonts requested in a cold load (target)', sum(measured, (r) => r.bytes), BUDGET.fontsCriticalTarget, false])
} else {
  console.log('Fonts requested in a cold load: not evaluated (pass --measured <file> with the requests recorded by a browser run)\n')
}

let failed = false
for (const [label, value, max, hard] of checks) {
  const ok = value <= max
  if (!ok && hard) failed = true
  console.log(`${ok ? 'PASS' : hard ? 'FAIL' : 'MISS'}  ${label.padEnd(42)} ${String(value).padStart(8)} / ${String(max).padStart(8)}  (${max - value >= 0 ? '+' : ''}${max - value} margin)`)
}
console.log(`\nEntry JS: ${entryJs.join(', ') || 'none'}\nEntry CSS: ${entryCss.join(', ') || 'none'}\nPreloaded fonts: ${preloaded.length ? preloaded.join(', ') : 'none'}`)
if (failed) process.exit(1)
