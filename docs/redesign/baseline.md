# Baseline — antes del rediseño (F0)

Medido el 2026-10-07 sobre el commit `879ca82` más los cambios de F0 (los cuatro componentes sin imports no alteran el bundle: el hash de los assets es idéntico al de `pre-redesign`). Referencia para los criterios de F3, F6 y F7 de `PLAN-FROZEN.md`.

## Entorno

| | |
|---|---|
| Node / npm | v22.23.2 / 10.9.8 |
| Build | `npm run build` (Vite 5.4.21) |
| Servidor | `npm run preview` (`vite preview`, puerto 4173, `localhost`) |
| Lighthouse | 13.5.0 (`npx --yes lighthouse`, no es dependencia del proyecto) |
| Navegador | Microsoft Edge 154 headless (no hay Chrome instalado), vía `CHROME_PATH` |
| Perfil | Mobile (por defecto de Lighthouse), throttling simulado |

## 1. Peso del build

Medido con `wc -c` y `gzip -9 -c` sobre `dist/assets/*`.

| Asset | Raw (bytes) | gzip -9 (bytes) | Reporte de Vite |
|---|---|---|---|
| `index-BvBe-ubd.js` | 573.084 | 154.965 | 570,17 kB · gzip 155,38 kB |
| `index-3vM9p_Mq.css` | 184.007 | 32.300 | 183,98 kB · gzip 32,75 kB |
| `index.html` | 1.898 | — | 1,88 kB |

Nota: Vite mide el JS en caracteres, no en bytes UTF-8 (por eso 570,17 kB vs. 573.084 bytes). **Para comparar entre fases, usar la columna `gzip -9`.**

Un único chunk JS (Vite avisa que supera 500 kB) y un único CSS. Sin code-splitting.

| Carpeta | Tamaño |
|---|---|
| `public/` | 12.866 KB |
| `public/media` | 4.436 KB (4 PNG de más de 100 KB, ~0,8 MB los mayores) |
| `public/casework` | 4.945 KB |
| `public/engineering-log` | 3.312 KB |
| `dist/` | 13.604 KB |

Código fuente: 16.212 líneas JS/JSX y 11.433 líneas de CSS en `src/`.

## 2. Tests

`npm test` → `node --test "src/**/*.test.js"`: **10 archivos, 164 tests, 164 pasan, 0 fallan.**

Corrección al plan: el "80 tests" citado antes era un subconjunto (4 archivos corridos a mano). La suite completa tiene 164.

## 3. Lighthouse mobile

3 corridas por página, mediana; entre paréntesis, las 3 puntuaciones de Performance en orden de ejecución.

| Página | Perf | A11y | Best Pr. | SEO | FCP = LCP = SI (ms) | TBT (ms) | CLS | Transferido |
|---|---|---|---|---|---|---|---|---|
| `#home` | **91** (76 / 91 / 93) | 92 | 100 | 91 | 2.842 | 0 | 0,005 | 376 KiB |
| `#projects` | **86** (86 / 86 / 84) | 96 | 100 | 91 | 2.711 | 0 | 0,154 | 376 KiB |
| `#casework/demand-forecasting` | **87** (88 / 87 / 87) | 97 | 100 | 92 | 2.688 | 68 | 0,132 | 981 KiB |

**Lectura:**

- La primera corrida de Home (76, TBT 515 ms) es un arranque en frío; las otras dos dan 91 y 93. Hay variabilidad entre corridas: tomar siempre la mediana de 3 y no comparar una sola corrida contra otra.
- LCP, FCP y Speed Index coinciden: el contenido aparece de una vez porque todo se renderiza en cliente.

**Hallazgos útiles para fases posteriores** (Lighthouse, corrida 2 de cada página):

| Hallazgo | Páginas | Fase relevante |
|---|---|---|
| `color-contrast` falla | Home, Projects, caso | F3 (tokens y script de contraste) |
| `aria-prohibited-attr` falla | Home | F3 |
| CLS 0,154 en `.atlas-entry-rail` | Projects | F4 (la vista se reescribe) |
| CLS 0,132 en `nav.elog-toc` | Caso Demand Forecasting | F6 (skeleton de alto fijo) |
| `unused-javascript`: ahorro est. 56–58 KiB | Todas | F6 (lazy) |
| `unused-css-rules`: ahorro est. 27–28 KiB | Todas | F7 |
| `render-blocking-insight`: ~1.200–1.330 ms | Todas | F7 (fuentes de Google y CSS) |
| `image-delivery-insight`: ahorro est. 496 KiB; `unsized-images` | Caso | F7 (WebP con `width`/`height`) |
| `valid-source-maps` | Todas | Sin acción prevista |

## 4. Qué NO se pudo medir o no es comparable

- **Producción real:** todo se midió contra `vite preview` en `localhost`. No se midieron cabeceras de caché, compresión ni CDN del hosting real.
- **`robots-txt` (31 errores):** es un artefacto de `vite preview`, que devuelve `index.html` para `/robots.txt`. No hay `robots.txt` en el proyecto. No se tomó como dato de producción.
- **Navegador:** Edge 154 en lugar de Chrome. Las puntuaciones pueden diferir ligeramente de Chrome o de PageSpeed Insights.
- **Fuentes:** se cargan desde Google Fonts en el momento de la medición; dependen de la red de esa corrida.
- **Escritorio y dispositivos reales:** no medidos.
- **Resto de rutas:** no se midieron los otros 5 casos, el detalle de proyecto, About ni Contact.
- **Exit code:** las 9 corridas terminaron con código 1 porque Lighthouse no pudo borrar su carpeta temporal en Windows (`EBUSY` sobre `CrashpadMetrics-active.pma`), después de escribir cada informe. Los JSON están completos y sin `runWarnings`.

## 5. Pisos para las fases siguientes

`PLAN-FROZEN.md` pide "igual o mejor que el baseline" en F7 y un JS inicial menor al actual en F6. Valores de referencia derivados de esta medición:

| Criterio | Piso (mediana de 3 corridas) |
|---|---|
| Performance mobile | Home ≥ 91 · Projects ≥ 86 · Caso ≥ 87 |
| Accessibility mobile | Home ≥ 92 · Projects ≥ 96 · Caso ≥ 97 (el objetivo real es subirla: contraste) |
| JS inicial gzip -9 | < 154.965 bytes |
| CSS total gzip -9 | < 32.300 bytes |

**Gate aprobado de F6:** JS inicial de la Home ≤ 110 KB gzip -9 (≈ −30 % respecto del baseline). Es un criterio objetivo respaldado por este baseline. Si un análisis de bundle en F6 demuestra que no es razonable sin comprometer funcionalidad, UX o mantenibilidad, se reporta antes de modificar el criterio; no se hacen optimizaciones artificiales.

**Dominio canónico actual** (usado en `og:url` y `og:image` de `index.html`): `https://portfolio-me-f104.vercel.app`. Si se adopta un dominio propio, hay que actualizar ambas URLs.

## 6. Cómo reproducir

```bash
npm ci
npm run build
node ./node_modules/vite/bin/vite.js preview --port 4173 --strictPort &

# Pesos
wc -c dist/assets/*
for f in dist/assets/*; do gzip -9 -c "$f" | wc -c; done

# Lighthouse (3 corridas por URL; mediana)
export CHROME_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
for i in 1 2 3; do
  npx --yes lighthouse "http://localhost:4173/#home" --output=json \
    --output-path="home-$i.json" \
    --only-categories=performance,accessibility,best-practices,seo \
    --chrome-flags="--headless=new --no-sandbox"
done
# Repetir con #projects y #casework/demand-forecasting
```
