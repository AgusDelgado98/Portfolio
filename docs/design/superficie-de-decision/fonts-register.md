# Registro de fuentes (F1)

Fuentes autoalojadas en `src/assets/fonts/`, descargadas el **2026-11-03** desde su origen oficial. Los archivos están **sin modificar**, tal como los sirve Google Fonts (subconjunto `latin`). La integridad (tamaño y SHA-256) la verifica `src/assets/fonts/fonts.assets.test.js` contra `src/assets/fonts/fonts.manifest.json`.

## Archivos

| Archivo | Familia | Bytes | SHA-256 |
| --- | --- | --- | --- |
| `fraunces-latin-normal.woff2` | Fraunces normal 300 500 | 67.304 | `7234ed860a9cc83045413c4faee63c960a8f2d1917adcf728119307d56e0d783` |
| `fraunces-latin-italic.woff2` | Fraunces italic 300 500 | 81.520 | `066710ce7ed235a339d3d6cdcc8b55c0bea5632232662d83aacea25852108271` |
| `instrument-sans-latin-normal.woff2` | Instrument Sans normal 400 700 | 30.092 | `2ee17598a98d8a59e4df8152d015bec9ab8e4d5672cc0ab42bef806b568e3971` |
| `ibm-plex-mono-latin-400.woff2` | IBM Plex Mono normal 400 | 14.708 | `08949f728dc52d528e69b1667d15c89a5686a4ee9a296ff90983985f99c380f7` |
| `ibm-plex-mono-latin-500.woff2` | IBM Plex Mono normal 500 | 14.888 | `01d285447409c8a588692162439a038b8cbd7871309ee20267b0d2d91c6e8e22` |

Total: **208.512 bytes** (presupuesto total: 210.000). Los cinco respondieron `content-type: font/woff2` y su tamaño coincide con la cabecera `content-length`.

## Origen de cada archivo

Se consultó la API de CSS de Google Fonts (`fonts.googleapis.com/css2`) y se descargó el archivo del bloque `latin` desde `fonts.gstatic.com`:

| Archivo | URL |
| --- | --- |
| `fraunces-latin-normal.woff2` | <https://fonts.gstatic.com/s/fraunces/v38/6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeA.woff2> |
| `fraunces-latin-italic.woff2` | <https://fonts.gstatic.com/s/fraunces/v38/6NU58FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnbB-gzTK0K1ChjeveQ.woff2> |
| `instrument-sans-latin-normal.woff2` | <https://fonts.gstatic.com/s/instrumentsans/v4/pxiTypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr0SZe1Q.woff2> |
| `ibm-plex-mono-latin-400.woff2` | <https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2> |
| `ibm-plex-mono-latin-500.woff2` | <https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgg.woff2> |

Verificación cruzada: `instrument-sans-latin-normal.woff2` e `ibm-plex-mono-latin-400.woff2` son **idénticos byte por byte** (mismo SHA-256) a las copias que ya tiene el proyecto DECERNO en `web/fonts` (obtenidas por otra vía). No se copió nada desde DECERNO.

## Licencias

Las tres familias están bajo **SIL Open Font License 1.1**. El texto se descargó de los repositorios originales y se incluye junto a las fuentes, como exige la licencia, en `public/fonts/licenses/`:

| Archivo | Origen | SHA-256 |
| --- | --- | --- |
| `public/fonts/licenses/OFL-Fraunces.txt` | <https://raw.githubusercontent.com/undercasetype/Fraunces/master/OFL.txt> | `bdf4c22802eaf804f998195871c6b8938aac2ac14b2d78a8bd66a6f1eced833b` |
| `public/fonts/licenses/OFL-InstrumentSans.txt` | <https://raw.githubusercontent.com/Instrument/instrument-sans/master/OFL.txt> | `9e27a72ed30eb49a08678f6a5d6ed98ec7ba5368f541637ee0683ec9134ef966` |
| `public/fonts/licenses/OFL-IBMPlex.txt` | <https://raw.githubusercontent.com/IBM/plex/master/LICENSE.txt> | `7e6b2818edbd8f6a01ae80641cc8f16a51080d08fb4e532be3a0b6f74adb07da` |

| Familia | Titular | Nombre de fuente reservado |
| --- | --- | --- |
| Fraunces | © 2018 The Fraunces Project Authors | Ninguno |
| Instrument Sans | © 2022 The Instrument Sans Project Authors | Ninguno |
| IBM Plex Mono | © 2017 IBM Corp. | **«Plex»** |

**Consecuencia:** como IBM Plex declara el nombre reservado «Plex», sus archivos **no se modifican** (ni subconjunto ni cambio de ejes) sin renombrar la familia. Fraunces e Instrument Sans no tienen nombre reservado y podrían optimizarse (ver más abajo), conservando su licencia y atribución.

## Cobertura de glifos

`node scripts/audit-glyphs.mjs` lee el `cmap` de cada archivo (solo módulos de Node) y lo compara con los caracteres no ASCII que usa el código (sin comentarios). Resultado del 2026-11-03: 36 caracteres; todos los del español y el inglés (acentos, «¿», «—», comillas, «·», «×», «−») están cubiertos. **Se renderizan con la fuente del sistema**, igual que antes de F1, estos diez: `Δ ← → ↔ ↗ ↳ ∪ ≈ ≠ ≤` (el rango `latin` de Google no los incluye; `↑ ↓` están en Instrument Sans y Plex Mono pero no en Fraunces). La lista conocida está en `KNOWN_FALLBACK`; un carácter nuevo fuera de las fuentes hace fallar `node scripts/audit-glyphs.mjs --strict`.

## Caras de respaldo (CLS)

`fonts.css` declara, para cada familia, una cara local con las métricas ajustadas, para que el cambio de fuente no mueva el diseño:

| Cara | Base | size-adjust | ascent / descent |
| --- | --- | --- | --- |
| Fraunces Fallback | Georgia | 84,8 % | 115,3 % / 30,1 % |
| Instrument Sans Fallback | Arial | 100,6 % | 96,4 % / 24,9 % |
| IBM Plex Mono Fallback | Courier New | 100 % | 102,5 % / 27,5 % |

`size-adjust` es la razón de anchos medios de texto medida en Edge (Fraunces 0,82 a 0,87 frente a Georgia según el peso; Instrument Sans 0,97 a 1,03 frente a Arial; Plex Mono 1,00 frente a Courier New). Los `ascent` y `descent` salen de la tabla `hhea` de cada fuente (Fraunces 1956/−510 sobre 2000; Instrument Sans 970/−250 sobre 1000; Plex Mono 1025/−275 sobre 1000).

## Estudio de optimización (no incorporado)

Para saber si el objetivo de 115 KB de fuentes críticas se puede cumplir sin cambiar el diseño se midieron variantes de Fraunces e Instrument Sans con **fonttools 4.55.3 y brotli en un entorno temporal fuera del proyecto** (no es una dependencia del repositorio y no se agrega a `package.json`). El script está en `tools/font-optimization-study.py`. Se conservaron los 215 puntos de código que usa el sitio más Latin-1 completo y las funciones `kern`, `liga`, `ccmp`, `locl`, `mark` y `mkmk`.

| Variante | Fraunces normal | Fraunces cursiva | Instrument Sans |
| --- | --- | --- | --- |
| Archivo oficial | 67.304 | 81.520 | 30.092 |
| Subconjunto (sin cambio visual) | 62.804 | 74.028 | 26.496 |
| Subconjunto + peso 300–400 (Instrument Sans: 400–600) | 53.624 | 62.388 | 25.324 |
| Subconjunto + tamaño óptico fijo en 48 | 34.104 | 41.288 | — |
| Subconjunto + tamaño óptico fijo en 144 | 30.920 | 37.856 | — |

Plex Mono (400 y 500) no se puede reducir sin renombrar: 14.708 + 14.888.

**Lo que piden hoy las páginas (carga en frío, medido en el navegador):** Fraunces normal, Instrument Sans, Plex Mono 400 y Plex Mono 500: **127.012 bytes de archivo** (unos 128 KB en la red) frente al objetivo de 115 KB. Con el estudio:

| Escenario (composición actual) | Bytes | Cumple 115 KB |
| --- | --- | --- |
| Archivos oficiales (lo implementado) | 127.012 | No |
| Subconjunto, sin cambio visual | 118.900 | No (3,9 KB de más) |
| Subconjunto + peso 300–400 | 108.500 | Sí |
| Subconjunto + tamaño óptico fijo en 144 | 87.000 | Sí |

**Con la composición de F4** (el titular de Home lleva una palabra en cursiva) hay que sumar Fraunces cursiva: 208.500 con los archivos oficiales; 192.900 con subconjunto; 170.900 con subconjunto + peso 300–400; unos 124.900 con el tamaño óptico fijo en 144. **El objetivo de 115 KB solo se alcanzaría en F4 fijando el tamaño óptico, es decir, cambiando el aspecto de Fraunces según el tamaño**, y eso es una decisión de diseño. Las opciones están en `f1-report.md`.
