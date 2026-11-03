import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The approved design mockups (docs/design/superficie-de-decision) carry annotations
 * — blue "NOTA DE DISEÑO" tags and dashed boxes — that exist only in sketches. They
 * must never reach production. This scans what ships: src, public and index.html.
 * It does NOT scan docs/, where the mockup sources live on purpose.
 */

const srcDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(srcDir, '..')

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const shipped = [
  ...walk(srcDir).filter((file) => /\.(js|jsx|css)$/.test(file) && !/\.test\.js$/.test(file)),
  ...walk(path.join(rootDir, 'public')).filter((file) => /\.(txt|xml|json|md|html|svg|css|js)$/i.test(file)),
  path.join(rootDir, 'index.html'),
]

test('no design-note text ("NOTA DE DISEÑO") ships in the source, the public folder or index.html', () => {
  for (const file of shipped) {
    assert.ok(!/NOTA DE DISE[ÑN]O/i.test(fs.readFileSync(file, 'utf8')), `${path.relative(rootDir, file)} carries a design note`)
  }
})

test('no mockup-only annotation class (`.dn`, `.skel`) ships', () => {
  for (const file of shipped) {
    const text = fs.readFileSync(file, 'utf8')
    assert.ok(!/class(Name)?=["']dn["']/.test(text), `${path.relative(rootDir, file)} uses class "dn"`)
    assert.ok(!/class(Name)?=["']skel["']/.test(text), `${path.relative(rootDir, file)} uses class "skel"`)
  }
})
