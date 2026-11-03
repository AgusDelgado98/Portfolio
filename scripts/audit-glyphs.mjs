#!/usr/bin/env node
/**
 * Glyph coverage audit for the self-hosted fonts (src/assets/fonts).
 *
 * Reads each WOFF2 listed in fonts.manifest.json, extracts its `cmap` with
 * Node built-ins only (no dependencies), then compares it with every non-ASCII
 * character used by the site's source text (src/**, JS/JSX/CSS, tests excluded).
 *
 *   node scripts/audit-glyphs.mjs            report (always exits 0)
 *   node scripts/audit-glyphs.mjs --strict   exit 1 if a character is covered by
 *                                            no font and is not in KNOWN_FALLBACK
 *   node scripts/audit-glyphs.mjs --metrics  also print vertical metrics per font
 *
 * The WOFF2 container keeps `cmap`, `head`, `hhea` and `OS/2` untransformed, so
 * they are read straight out of the decompressed table stream.
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fontsDir = path.join(root, 'src/assets/fonts')

/**
 * Characters that render with the system font, as they did before F1: Google's `latin`
 * subsets (the ones the site used and the ones self-hosted now) share one unicode-range
 * that has no arrows beyond ↑ ↓, no Greek and no math operators. Audited on 2026-11-03.
 * A new character outside the fonts fails `--strict` until it is reviewed and listed here.
 */
export const KNOWN_FALLBACK = new Set([0x0394, 0x2190, 0x2192, 0x2194, 0x2197, 0x21b3, 0x222a, 0x2248, 0x2260, 0x2264])

const KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG',
  'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC',
  'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc',
  'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat',
  'Gloc', 'Feat', 'Sill',
]

function readBase128(buf, pos) {
  let value = 0
  for (let i = 0; i < 5; i += 1) {
    const byte = buf[pos.offset]
    pos.offset += 1
    value = (value << 7) | (byte & 0x7f)
    if ((byte & 0x80) === 0) return value >>> 0
  }
  throw new Error('invalid UIntBase128')
}

/** Returns { tables: Map<tag, Buffer> } for the untransformed tables of a WOFF2 file. */
export function readWoff2(buf) {
  if (buf.toString('latin1', 0, 4) !== 'wOF2') throw new Error('not a WOFF2 file')
  const numTables = buf.readUInt16BE(12)
  const totalCompressed = buf.readUInt32BE(20)
  const pos = { offset: 48 }
  const dir = []
  for (let i = 0; i < numTables; i += 1) {
    const flags = buf[pos.offset]
    pos.offset += 1
    const index = flags & 0x3f
    const version = (flags >> 6) & 3
    let tag
    if (index === 63) {
      tag = buf.toString('latin1', pos.offset, pos.offset + 4)
      pos.offset += 4
    } else tag = KNOWN_TAGS[index]
    const origLength = readBase128(buf, pos)
    const transformed = tag === 'glyf' || tag === 'loca' ? version === 0 : version !== 0
    const length = transformed ? readBase128(buf, pos) : origLength
    dir.push({ tag, length })
  }
  const stream = zlib.brotliDecompressSync(buf.subarray(pos.offset, pos.offset + totalCompressed))
  const tables = new Map()
  let cursor = 0
  for (const entry of dir) {
    tables.set(entry.tag, stream.subarray(cursor, cursor + entry.length))
    cursor += entry.length
  }
  return { tables }
}

/** Set of code points mapped to a non-zero glyph by the best Unicode cmap subtable. */
export function readCmap(cmap) {
  const count = cmap.readUInt16BE(2)
  let best = null
  for (let i = 0; i < count; i += 1) {
    const platform = cmap.readUInt16BE(4 + i * 8)
    const encoding = cmap.readUInt16BE(6 + i * 8)
    const offset = cmap.readUInt32BE(8 + i * 8)
    const format = cmap.readUInt16BE(offset)
    const unicode = platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10))
    if (!unicode) continue
    if (format === 12 || (format === 4 && !best)) best = { offset, format }
  }
  const covered = new Set()
  if (!best) return covered
  const { offset, format } = best
  if (format === 12) {
    const groups = cmap.readUInt32BE(offset + 12)
    for (let g = 0; g < groups; g += 1) {
      const at = offset + 16 + g * 12
      const start = cmap.readUInt32BE(at)
      const end = cmap.readUInt32BE(at + 4)
      for (let c = start; c <= end; c += 1) covered.add(c)
    }
    return covered
  }
  const segX2 = cmap.readUInt16BE(offset + 6)
  const seg = segX2 / 2
  const endBase = offset + 14
  const startBase = endBase + segX2 + 2
  const deltaBase = startBase + segX2
  const rangeBase = deltaBase + segX2
  for (let s = 0; s < seg; s += 1) {
    const end = cmap.readUInt16BE(endBase + s * 2)
    const start = cmap.readUInt16BE(startBase + s * 2)
    const delta = cmap.readInt16BE(deltaBase + s * 2)
    const rangeOffset = cmap.readUInt16BE(rangeBase + s * 2)
    for (let c = start; c <= end && c < 0xffff; c += 1) {
      let glyph
      if (rangeOffset === 0) glyph = (c + delta) & 0xffff
      else {
        const at = rangeBase + s * 2 + rangeOffset + (c - start) * 2
        glyph = cmap.readUInt16BE(at)
        if (glyph !== 0) glyph = (glyph + delta) & 0xffff
      }
      if (glyph !== 0) covered.add(c)
    }
  }
  return covered
}

export function readMetrics(tables) {
  const head = tables.get('head')
  const hhea = tables.get('hhea')
  const os2 = tables.get('OS/2')
  return {
    unitsPerEm: head.readUInt16BE(18),
    ascender: hhea.readInt16BE(4),
    descender: hhea.readInt16BE(6),
    lineGap: hhea.readInt16BE(8),
    xAvgCharWidth: os2.readInt16BE(2),
  }
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.(js|jsx|css)$/.test(entry.name) && !/\.test\.js$/.test(entry.name)) out.push(full)
  }
  return out
}

/** Comments never render: drop block comments and `//` line comments (approximate, but safe for this codebase). */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\'"`])\/\/.*$/gm, '$1')
}

function usedCodePoints() {
  const used = new Map()
  for (const file of walk(path.join(root, 'src'))) {
    for (const ch of stripComments(fs.readFileSync(file, 'utf8'))) {
      const cp = ch.codePointAt(0)
      if (cp > 127) used.set(cp, (used.get(cp) || 0) + 1)
    }
  }
  return used
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(fontsDir, 'fonts.manifest.json'), 'utf8'))
  const fonts = manifest.fonts.map((font) => {
    const { tables } = readWoff2(fs.readFileSync(path.join(fontsDir, font.file)))
    return { font, covered: readCmap(tables.get('cmap')), metrics: readMetrics(tables) }
  })
  if (process.argv.includes('--metrics')) {
    for (const { font, metrics } of fonts) console.log(font.id.padEnd(22), JSON.stringify(metrics))
    console.log()
  }
  const used = usedCodePoints()
  const rows = [...used.entries()].sort((a, b) => a[0] - b[0])
  const names = fonts.map(({ font }) => font.id)
  console.log(`Non-ASCII characters used in src (${rows.length}); ✓ = in the font's cmap`)
  console.log(['char'.padEnd(6), 'code'.padEnd(8), 'uses'.padEnd(6), ...names.map((n) => n.slice(0, 12).padEnd(13))].join(' '))
  const uncovered = []
  for (const [cp, uses] of rows) {
    const marks = fonts.map(({ covered }) => (covered.has(cp) ? '✓' : '·'))
    const anywhere = marks.includes('✓')
    const ch = cp < 0x20 ? ' ' : String.fromCodePoint(cp)
    console.log(
      [ch.padEnd(6), `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`.padEnd(8), String(uses).padEnd(6), ...marks.map((m) => m.padEnd(13))].join(' '),
    )
    if (!anywhere && !KNOWN_FALLBACK.has(cp)) uncovered.push(cp)
  }
  const fallback = rows.filter(([cp]) => !fonts.some(({ covered }) => covered.has(cp))).map(([cp]) => cp)
  console.log(`\nRendered with the system font (in no self-hosted font): ${fallback.map((c) => String.fromCodePoint(c)).join(' ') || 'none'}`)
  if (uncovered.length) {
    console.log(`Unexpected (not in KNOWN_FALLBACK): ${uncovered.map((c) => `U+${c.toString(16).toUpperCase()}`).join(', ')}`)
    if (process.argv.includes('--strict')) process.exit(1)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
