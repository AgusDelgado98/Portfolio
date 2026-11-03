// Static server that compresses like a CDN would (brotli for text, as-is for fonts/images).
// node serve.mjs <dir> <port>
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const [dir, portArg] = process.argv.slice(2)
const root = path.resolve(dir)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml', '.mp4': 'video/mp4' }
const TEXT = new Set(['.html', '.js', '.css', '.svg', '.json', '.txt', '.xml'])
const cache = new Map()

function load(file) {
  if (cache.has(file)) return cache.get(file)
  const ext = path.extname(file)
  const raw = fs.readFileSync(file)
  const entry = { type: TYPES[ext] || 'application/octet-stream', raw, br: TEXT.has(ext) ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } }) : null }
  cache.set(file, entry)
  return entry
}

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p === '/') p = '/index.html'
  const file = path.join(root, p)
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return }
  const e = load(file)
  const useBr = e.br && /\bbr\b/.test(req.headers['accept-encoding'] || '')
  const body = useBr ? e.br : e.raw
  const headers = { 'Content-Type': e.type, 'Content-Length': body.length, 'Cache-Control': 'public, max-age=0, must-revalidate' }
  if (useBr) headers['Content-Encoding'] = 'br'
  res.writeHead(200, headers)
  res.end(body)
}).listen(Number(portArg), '127.0.0.1')
