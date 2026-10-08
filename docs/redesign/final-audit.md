# Auditoría final — estado de release

Medido el 2026-10-08 sobre la rama `redesign`, después de F7, la pasada de visual storytelling, el arreglo de overflow responsive y la integración de `origin/main`. Todo está en git. Esta versión reemplaza la auditoría de F7, que describía F7 sin commit, 276 tests y 92.088 B de JS inicial.

## Commits

| Fase | Commit | Mensaje |
| --- | --- | --- |
| Plan | `879ca82` | docs: freeze portfolio redesign plan v1.1 |
| F0 | `5d7ca94` | chore: establish portfolio redesign baseline |
| F1 | `6c01200` | refactor: establish portfolio project registry |
| F2 | `853ca77` | refactor: establish canonical portfolio navigation |
| F3 | `1ee3bd3` | feat: redesign portfolio home experience |
| F4 | `81296f2` | feat: redesign projects and project details |
| F5 | `905247d` | feat: consolidate about and contact experience |
| F6 | `d3a79ce` | perf: lazy-load portfolio case studies |
| F7 | `b2d01f9` | chore: finalize portfolio redesign |
| Visual storytelling | `ec79f5173d3fad46fc31567459af09a8082a5f8a` | feat: refine portfolio visual storytelling and interactions |
| Fix de overflow | `99d2067d586f1a3f9c2d900bc89d3fd02777fa14` | fix: prevent responsive timeline overflow |
| Merge de `origin/main` | `430ce9e941b18e2bb1f7aaa0b9460b5ef107019c` | merge: integrate latest main into portfolio redesign |
| Estado de release | el commit que contiene este documento | chore: finalize redesign release state |

`pre-redesign` apunta a `a83fd98` (estado previo al rediseño, sin el plan). `main` local sigue en `a83fd98`. `redesign` no se mergeó a `main` ni se publicó.

El baseline de peso y Lighthouse está en `docs/redesign/baseline.md`, medido sobre `879ca82` más F0. El hash de los assets de ese baseline coincide con `pre-redesign`.

## Integración de `origin/main`

`origin/main` estaba en `d8762228bf9554ec93584d9d1838b7ea3ad47991`, 36 commits por delante del merge-base `a83fd98`. Se integró con un merge, sin rebase. Hubo 22 conflictos, resueltos archivo por archivo. La arquitectura de `redesign` es la base; de `origin/main` se conservó lo factual:

- **CV 2026.** `CV_HREF` es `/cv/Agustin-Delgado-2026.pdf`. `public/cv/`, `src/i18n/config.js`, `api/cv.js`, `api/cv-data/chunk1…7.js` y `vercel.json` son idénticos a `origin/main`. El PDF pesa 85.362 B. Su blob SHA de git, `89cf399a03200973ef589f4b328da2c610d501c6`, coincide con el que `api/cv.js` verifica, y el payload base64 reconstruido es igual al archivo estático. `vercel.json` reescribe la ruta nueva a `/api/cv` y redirige `/cv/Agustin_Delgado_CV_EN.pdf` a la nueva. Como existe un archivo estático con el nombre nuevo, Vercel probablemente sirva ese archivo y no la función; ambos son el mismo PDF. Esto no se pudo probar fuera de Vercel.
- **Perfil actual.** `src/i18n/messages/profileExperience.js` se aplica como capa sobre el catálogo de UI en `translationsCore.js`: Data Analyst | Healthcare Analytics desde marzo de 2024; Consultorio Barcala de marzo de 2021 a febrero de 2024. Se corrigieron los textos de About que decían «profesional independiente» y «2,5 años». Se agregó «Inglés C2 · EF SET 76/100» al perfil de About.
- **ALETHEIA.** `ALETHEIA_WEB_URL` (sitio público), la acción «Abrir ALETHEIA» en el case study, el enlace en Technical details de la ficha, y el encuadre «investigación guiada por evidencia» con «18 preguntas» en el tagline, la card de Home y el copy del caso. Los datos de `casework/aletheia/data.js` no cambiaron en `origin/main`.
- **Ruta nueva.** `#casework/archive` se agregó como alias de `#projects`. La vista de archivo se descartó junto con el índice de Casework.
- **README.** Base de `redesign` más el rol actual, la sección CV y los enlaces.

Siguen eliminados: Data & BI, Operations, AboutProfile, CaseworkIndex, CaseworkArchive, el Header anterior, `casework/registry.js`, el Atlas y la Guía. `docs/archive/ESCANEO.md` e `ITERATION2_RESULT.md` se borraron, porque `origin/main` los había retirado por obsoletos.

La rama remota `automation/refresh-aletheia-cv` apareció en el fetch y no se integró.

## Arquitectura final

SPA con hash. React 18, Vite 5. Sin framework de UI.

| Ruta | Carga |
| --- | --- |
| `#home`, `#projects`, `#projects/<id>`, `#about`, `#contact` | JavaScript inicial |
| `#projects/<proyecto>/<caso>` y ALETHEIA `/research` | chunk perezoso del caso |

`projects/caseStudies.js` define la ruta y los metadatos. `casework/components.js` solo hace `React.lazy`. El copy de cada caso se registra al evaluar el chunk. El documento es oscuro en todas las rutas. El cuerpo del caso pinta papel en `.ds-case-stage`.

Proyectos públicos: 8 (PROVIDENTIA, Caelum Health Analytics, ALETHEIA, Paradigm, Soma, Tekmérion, LumenVox y ClarusFlow). Hogares y Kairós siguen en el registro con `hidden: true`. DECERNO no está en el registro. El header incluye Inicio/Home; los puntos de corte salen de la medición: menú desde 799 px hacia abajo, nombre desde 800, rol desde 1.000.

Cambios desde F7: la señal DATA ↔ DECISION del Hero (un solo loop ambiental, con CSS), visuales de proyecto interactivos (`usePartFocus`), Project Detail recompuesto (pregunta, método, resultado, decisión, límites, casos, detalles técnicos), About con trayectoria, capacidades y formación como líneas y nodos, Contact editorial, y un único `--site-header-h` medido para los offsets sticky y de scroll. Las secciones ya no reciben foco: lo recibe el `<h2>`.

Los aliases congelados se reescriben con `history.replaceState` a la URL canónica.

## Bundle

gzip nivel 9. Las tablas usan `zlib.gzipSync(buf, { level: 9 })`, como el baseline. El `gzip -9` de línea de comandos da valores casi iguales: JS 98.866 B y CSS 10.712 B.

| | F0 | F6 | F7 | Final |
| --- | ---: | ---: | ---: | ---: |
| JS inicial, gzip-9 | 154.965 B | 98.795 B | 92.088 B | 99.060 B |
| CSS inicial, gzip-9 | 32.300 B | 32.401 B | 8.439 B | 10.717 B |

Final inicial:

| Asset | Raw | gzip-9 |
| --- | ---: | ---: |
| `index-DB-4FpZz.js` (único JS inicial) | 319.543 | 99.060 |
| `index-9-2ac16p.css` (único CSS inicial) | 55.545 | 10.717 |

Gate Home JS ≤ 110.000 B: cumplido. Margen 10.940 B. Sobre F7 el JS inicial sube 6.972 B: los visuales interactivos, About y Project Detail recompuestos, `profileExperience.js` y el `useCssVarHeight`.

Chunks perezosos, gzip-9. Siguen siendo seis casos más el helper, y el entry no contiene su código:

| Chunk | JS | CSS |
| --- | ---: | ---: |
| Engineering Log (no-show) | 18.057 | 2.859 (`engineering-log.css`, compartido) |
| Operational Risk | 11.212 | 336 |
| Demand Forecasting | 8.403 | — |
| Capacity Decision | 8.355 | 379 |
| Policy Decision | 7.532 | — |
| ALETHEIA, incluido `/research` | 16.163 | 3.057 |
| `format` (helper compartido por los casos) | 196 | — |

Suma de todo el JS, gzip-9: 168.978 B. Supera los 154.965 B de F0 por el overhead de partir los chunks y por el código nuevo. No es el costo de la primera visita: F0 descargaba los seis casos en el entry; ahora se descarga el entry y el caso al abrirlo. Suma de todo el CSS, gzip-9: 17.348 B, debajo de los 32.300 B de F0.

## Lighthouse mobile

Mediana de tres corridas, `npm run preview` en `http://localhost:4173`, Lighthouse 12 (la auditoría de F7 usó la 13), Edge headless. Perfil mobile.

| Ruta | Perf | A11y | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| `#home` | 98 | 100 | 1833 ms | 6 ms | 0,016 |
| `#projects` | 94 | 100 | 2506 ms | 0 ms | 0,001 |
| `#projects/providentia` | 98 | 100 | 1836 ms | 8 ms | 0,015 |
| `#about` | 98 | 100 | 1817 ms | 0 ms | 0 |
| `#contact` | 98 | 100 | 1810 ms | 0 ms | 0,005 |
| `#projects/providentia/demand-forecasting` | 97 | 100 | 2243 ms | 0 ms | 0,001 |

Corridas (perf / a11y / LCP ms / TBT ms / CLS):

- Home: 92/100/2810/0/0,016 · 98/100/1830/6/0,016 · 98/100/1833/12/0,016
- Projects: 84/100/3415/0/0,001 · 94/100/2506/0/0,001 · 95/100/2360/0/0,001
- PROVIDENTIA: 98/100/1836/8/0,023 · 98/100/1836/9/0,015 · 96/100/2227/0/0,013
- About: 96/100/2201/0/0 · 98/100/1812/2/0 · 98/100/1817/0/0
- Contact: 98/100/1820/0/0,005 · 98/100/1810/0/0,005 · 98/100/1807/0/0,006
- Demand Forecasting: 97/100/2243/0/0,001 · 98/100/2238/0/0,001 · 97/100/2244/0/0,001

Baseline F0, las tres rutas que se midieron entonces:

| Ruta | Perf | A11y | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| `#home` | 91 | 92 | 2842 ms | 0 ms | 0,005 |
| `#projects` | 86 | 96 | 2711 ms | 0 ms | 0,154 |
| `#casework/demand-forecasting` | 87 | 97 | 2688 ms | 68 ms | 0,132 |

Performance y Accessibility quedan por encima del baseline en las tres. Projects es la ruta más variable: tres corridas dieron 84, 94 y 95, y su LCP mediano (2506 ms) es peor que el de la auditoría de F7 (1737 ms). Una comparación contra el build de F7 en la misma máquina dio scores parecidos pero algo más bajos ahora (96, 96 y 91 frente a 96, 99 y 96); no se identificó una causa.

## Accesibilidad

Lighthouse: 100 en las seis rutas medidas. Una corrección de esta etapa: el nombre accesible del logo y de los puntos de PROVIDENTIA incluye su texto visible.

axe-core 4.10.3 (cero violaciones critical o serious en Home, Projects, PROVIDENTIA, ALETHEIA, Soma, About, Contact y los seis casos) se midió en F7 y no se repitió sobre el estado final. Los warnings moderate de landmarks de los case studies (`landmark-complementary-is-top-level`, `landmark-unique`, en los `<aside class="elog-evidence">`) tampoco se volvieron a medir.

Los controles interactivos de los visuales son botones con nombre, foco por teclado y equivalente táctil por click. `prefers-reduced-motion` quita la señal del Hero y las animaciones de los visuales, y deja el video de Soma en pausa.

## Responsive

Gate: `document.documentElement.scrollWidth === document.documentElement.clientWidth`. Medido con `clientWidth` y no con `innerWidth`: la barra de scroll (15 px) escondía desbordes menores y una auditoría previa los dio por buenos.

Los desbordes eran las líneas de conexión de los nodos (`::before` con `right: -24px`), que salían del grid cuando el contenido pasaba a otra fila: 10 px a 768 en About, Caelum, ALETHEIA y Paradigm, y 4 px a 1024 en esas tres fichas. El arreglo (`99d2067`) usa columnas explícitas y quita el conector del último nodo de cada fila. No hay `overflow-x: hidden`.

| Ancho | Resultado |
| --- | --- |
| 320, 360 | overflow 0 |
| 720, 768, 900 | overflow 0 (`clientWidth` 720, 753 y 885) |
| 1024, 1280 | overflow 0 (`clientWidth` 1009 y 1265) |

Se midieron Home, Projects, About, PROVIDENTIA, Caelum, ALETHEIA, Paradigm, Soma, Tekmérion, Contact, un case study de PROVIDENTIA y el evidence-case de ALETHEIA, en ES y EN. La medición después del merge se hizo en 360, 768, 1024 y 1280.

Las tablas anchas siguen en `.elog-table-wrap` y `.aletheia-compat-scroll`.

## URLs legacy

Probadas en el navegador sobre el build de producción. Cada alias termina en la canónica con `replaceState` y sin `pushState`.

| Alias | Canónica |
| --- | --- |
| `#casework`, `#casework/archive` | `#projects` |
| `#casework/demand-forecasting` | `#projects/providentia/demand-forecasting` |
| `#casework/capacity-decision`, `#casework/policy-decision` | `#projects/providentia/<caso>` |
| `#casework/no-show`, `#casework/operational-risk` | `#projects/paradigm/<caso>` |
| `#casework/aletheia`, `#casework/aletheia/research` | `#projects/aletheia/evidence-case`, `…/research` |
| `#engineering-log` | `#projects/paradigm/no-show` |
| `#data-bi`, `#stack` | `#about/skills` |
| `#operations` | `#about/experience` |
| `#enfoque` | `#about/method` |
| `#formacion` | `#about/education` |
| `#proyectos` | `#projects` |
| `#portada` | `#home` |
| `#contacto` | `#contact` |

Los tests de `legacyHashRoadmap` cubren la matriz. Las rutas desconocidas (`#nonsense`, `#projects/inexistente`) muestran Home y no se normalizan.

## Media y metadata

Las PNG de `public/media` pasaron a WebP calidad 80. Los PNG de evidence packs no se tocaron. Dimensiones en los `<img>` del registry y `width`/`height` 1920×1080 en el video de Soma.

| Archivo | PNG | WebP |
| --- | ---: | ---: |
| kairos overview | 823.524 | 39.746 |
| kairos library | 820.516 | 36.688 |
| representative-forecasts | 849.709 | 266.340 |
| soma poster | 130.531 | 47.164 |
| tekmerion showroom | 99.081 | 48.724 |
| resto de stills de proyecto | 208.373 | 87.580 |

`representative-forecasts.webp` sigue siendo el still más pesado (266 KB). El WebM de Soma no se recodificó (1,5 MB). `preload="metadata"`. Home y Projects no lo piden; se pide en la ficha de Soma.

`og-default.png` se conserva (1200×630, 16.446 B). `index.html` incluye las descripciones de `origin/main` (healthcare analytics) y `twitter:title`, `twitter:description` y `twitter:image`.

## Disponibilidad

La línea pública es «Disponibilidad estimada: ~2 semanas» / «Estimated availability: ~2 weeks», en el strip de contacto de Home y en Contact (`home.contact.availability`). Es la decisión final. Durante el merge se había cambiado a «A conversar» / «To discuss», porque `origin/main` retiró el plazo fijo como no respaldado; se revirtió por decisión explícita. Los textos de perfil no se tocaron.

## Tests

`npm test`: 296 pass, 0 fail. El build de producción pasó antes de la corrida, así que el test de los 110 KB midió este `dist`.

Controles agregados desde F7: `interaction.test.js` (partes interactivas con nombre y foco, nombres de capas traducidos, lecturas de ALETHEIA con los conteos reales, Soma sin rectángulos ni colores sueltos, Contact y About sin cajas, conectores que no salen del grid), el control de foco y offsets (`--site-header-h`, sin outline en secciones ni en `<main>`), la señal del Hero en ida y vuelta, la deriva de los datos de ALETHEIA contra `publication-charts.js`, el límite de lectura de PROVIDENTIA, y los tests de `profileExperience`, el alias `#casework/archive` y `ALETHEIA_WEB_URL` que vienen de la integración.

La paridad ES/EN del diccionario de UI se afirma sobre `uiEs`/`uiEn`. El árbol completo sigue teniendo una diferencia previa: las claves de `operationalRisk.limits.fromEvidence` son oraciones en inglés y solo están en el objeto ES. No se reescribió ese copy.

## Decisiones

- El documento es siempre oscuro. El papel queda en `.ds-case-stage`, no en `<html>`.
- `engineering-log.css` se conserva y se importa desde los módulos de caso.
- `destination-views.css` y `atlas.css` se eliminaron. De `atlas.css` solo se trasladaron reglas con consumidor.
- No se recodificó el WebM. No se reemplazó la imagen Open Graph.
- El CV vigente es el de `origin/main`; no se restauró ningún CV anterior.
- La disponibilidad pública es `~2 semanas`.

## Deuda que queda

- Warnings moderate de landmarks en los asides de evidencia de los casos (medidos en F7, no repetidos).
- axe-core sin repetir sobre el estado final.
- `representative-forecasts.webp` en 266 KB, y el WebM de Soma en 1,5 MB en su ficha.
- CLS de Home 0,016 frente a 0,005 en F0.
- LCP de Projects: mediana 2506 ms, con una corrida en 3415 ms.
- La suma de todos los chunks JS (168.978 B gzip-9) supera el entry monolítico de F0. El costo inicial no.
- Desajuste previo de claves en `operationalRisk.limits.fromEvidence`.
- Datos de perfil inactivos que vienen de `origin/main`: `contact.aboutFacts.availabilityValue` («A conversar» / «To discuss», contradice la línea pública `~2 semanas`) y `home.hero.seeking` / `opportunityLevels` (incluye «Junior / Entry-Level»). La UI actual no los muestra. Sus tests los fijan.
- Rutas desconocidas muestran Home sin normalizar la URL.
- `document.title` está en inglés también con la interfaz en español («Projects», «About», «Contact»). El `<title>` del evidence-case de ALETHEIA no incluye el nombre del caso.
- En EN, la pestaña de About dice «Skills» y el título de la sección «Capabilities». «Full research» de ALETHEIA tiene copy en inglés con la interfaz en español.
- El filtro «Products» quedó oculto, así que Soma no se puede filtrar por categoría.
- Nombres internos «atlas» (clases `atlas-access`, `atlas-sheet-*`, claves `backToAtlas`/`returnToAtlas`) que no son visibles al público.
- Falta `robots.txt` (único hallazgo de Lighthouse en SEO).
- `main` local está en `a83fd98`, por detrás de `origin/main`. La rama remota `automation/refresh-aletheia-cv` no está integrada.
- El comportamiento de `vercel.json` con el archivo estático y la función `api/cv` no se pudo verificar fuera de Vercel.
