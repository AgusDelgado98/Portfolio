# Auditoría final — F7

Medido el 2026-10-08 sobre la rama `redesign`. F0–F6 están en git. F7 está en el árbol de trabajo y no tiene commit.

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
| F7 | sin commit | cleanup, case shell, overflow, media, docs |

El baseline de peso y Lighthouse está en `docs/redesign/baseline.md`, medido sobre `879ca82` más F0. El hash de los assets de ese baseline coincide con `pre-redesign`.

## Arquitectura final

SPA con hash. React 18, Vite 5. Sin framework de UI.

| Ruta | Carga |
| --- | --- |
| `#home`, `#projects`, `#projects/<id>`, `#about`, `#contact` | JavaScript inicial |
| `#projects/<proyecto>/<caso>` y ALETHEIA `/research` | chunk perezoso del caso |

`projects/caseStudies.js` define la ruta y los metadatos. `casework/components.js` solo hace `React.lazy`. El copy de cada caso se registra al evaluar el chunk. El documento es oscuro en todas las rutas. El cuerpo del caso pinta papel en `.ds-case-stage`. CaseShell es el puente oscuro (breadcrumb, vuelta, fallback estable).

Los aliases congelados se reescriben con `history.replaceState` a la URL canónica. No se agregó producto, ni proyectos, ni navegación nueva.

## Bundle

gzip nivel 9 con `zlib.gzipSync(buf, { level: 9 })`. No es el gzip que imprime Vite.

F0 era un solo JS y un solo CSS: el entry cargaba todos los casos. F6 sacó los casos del entry. F7 no vuelve a partir Home, Projects, fichas, About ni Contact.

| | F0 | F6 | F7 |
| --- | ---: | ---: | ---: |
| JS inicial, gzip-9 | 154.965 B | 98.795 B | 92.088 B |
| CSS inicial, gzip-9 | 32.300 B | 32.401 B | 8.439 B |

F7 inicial:

| Asset | Raw | gzip-9 |
| --- | ---: | ---: |
| `index-DvgdKN77.js` (único JS inicial) | 295.717 | 92.088 |
| `index-ByMFMouA.css` (único CSS inicial) | 41.801 | 8.439 |

Gate Home JS ≤ 110.000 B: cumplido. Margen 17.912 B.

Chunks perezosos, gzip-9:

| Chunk | JS | CSS |
| --- | ---: | ---: |
| Engineering Log (no-show) | 18.057 | 2.859 (`engineering-log.css`, compartido) |
| Operational Risk | 11.211 | 336 |
| Demand Forecasting | 8.402 | — |
| Capacity Decision | 8.353 | 379 |
| Policy Decision | 7.532 | — |
| ALETHEIA, incluido `/research` | 16.081 | 3.057 |
| `format` (helper compartido por los casos) | 196 | — |

Suma de todo el JS, gzip-9: 161.920 B. Supera los 154.965 B de F0 por el overhead de partir los chunks. Esa suma no es el costo de la primera visita: F0 descargaba los seis casos en el entry; F7 descarga 92.088 B y el caso recién al abrirlo.

Suma de todo el CSS, gzip-9: 15.070 B. Queda debajo de los 32.300 B de F0, también si se cuentan los CSS de los casos.

## Lighthouse mobile

Misma metodología que el baseline: `npm run preview` en `http://localhost:4173`, Lighthouse 13, Edge headless, `CHROME_PATH`, tres corridas, mediana. Perfil mobile.

| Ruta | Perf | A11y | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| `#home` | 98 | 100 | 1838 ms | 12 ms | 0,016 |
| `#projects` | 99 | 100 | 1737 ms | 12 ms | 0 |
| `#projects/providentia` | 99 | 100 | 1696 ms | 21 ms | 0,019 |
| `#about` | 100 | 100 | 1423 ms | 0 ms | 0 |
| `#contact` | 100 | 100 | 1362 ms | 0 ms | 0,005 |
| `#projects/providentia/demand-forecasting` | 99 | 100 | 2105 ms | 6 ms | 0,001 |

Baseline F0, las tres rutas que se midieron entonces:

| Ruta | Perf | A11y | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| `#home` | 91 | 92 | 2842 ms | 0 ms | 0,005 |
| `#projects` | 86 | 96 | 2711 ms | 0 ms | 0,154 |
| `#casework/demand-forecasting` | 87 | 97 | 2688 ms | 68 ms | 0,132 |

Performance y Accessibility quedan por encima del baseline en las tres. En Home, CLS sube de 0,005 a 0,016 y TBT de 0 a 12 ms. El score de Performance igual sube de 91 a 98. En Projects el CLS de 0,154 baja a 0. En el caso, CLS baja de 0,132 a 0,001 y TBT de 68 ms a 6 ms.

Corridas (perf / a11y / LCP ms / TBT ms / CLS):

- Home: 96/100/2291/9/0.016 · 99/100/1730/12/0.016 · 98/100/1838/16/0.017
- Projects: 99/100/1837/20/0 · 99/100/1737/9/0 · 99/100/1730/12/0
- PROVIDENTIA: 99/100/1696/35/0.019 · 99/100/1728/21/0.036 · 99/100/1693/15/0.019
- About: 100/100/1423/0/0 · 100/100/1364/2/0 · 99/100/1666/0/0
- Contact: 98/100/1814/0/0.005 · 100/100/1361/0/0.005 · 100/100/1362/0/0.005
- Demand Forecasting: 99/100/2105/41/0.001 · 98/100/2257/6/0.001 · 99/100/2099/4/0.001

## Accesibilidad

axe-core 4.10.3 en el documento, viewport 360. Cero violaciones critical o serious en Home, Projects, PROVIDENTIA, ALETHEIA, Soma, About, Contact y los seis casos.

Quedan warnings moderate, solo en case studies:

- `landmark-complementary-is-top-level`: los `<aside class="elog-evidence">` viven dentro del artículo.
- `landmark-unique`: varios de esos asides no tienen nombre accesible distinto.

No se cambiaron a `div`. Son notas de evidencia del caso, no un landmark de página. El scroll horizontal de la tabla de compatibilidad de ALETHEIA y los `<pre class="elog-code">` sí se corrigieron: el bloque de código hace wrap, y el contenedor de la tabla es `role="region"` con `tabIndex={0}` y nombre.

También comprobado: skip link a `#main-content`, títulos sin “Atlas”, “Engineering Log” ni “Casework” como identidad global, `prefers-reduced-motion` deja el video de Soma en pausa y sin autoplay, y las fuentes siguen con preload no bloqueante, `display=swap` y `<noscript>`.

## Responsive

`document.documentElement.scrollWidth === clientWidth` en Home, Projects, ficha PROVIDENTIA, ficha ALETHEIA, ficha Soma, About, Contact y los seis casos.

| Ancho pedido | Resultado |
| --- | --- |
| 320, 360, 390 | overflow 0, `clientWidth` igual al ancho pedido |
| 768 | overflow 0 |
| 1024, 1280, 1600 | overflow 0. `clientWidth` fue 1009, 1265 y 1585 porque la barra de scroll vertical resta al viewport emulado |

No hay `overflow-x: hidden` en `body`. Las tablas anchas siguen en `.elog-table-wrap` y `.aletheia-compat-scroll`.

El overflow de Demand Forecasting (antes 8 px a 360, y más en otros casos) venía de columnas de grid en `auto`: se medían al max-content (`68ch`, una tarjeta, un `<li>`) y desbordaban el artículo. La corrección es `minmax(0, 1fr)` en `.elog-stage-body`, las listas y el colapso a una columna, más `overflow-wrap` en evidencia y código. En ALETHEIA, las etiquetas de eje al 0 % y al 100 % ya no se centran fuera del gráfico.

## URLs legacy

Probadas en el navegador. Cada alias termina en la canónica. `normalizeHash.js` usa `replaceState`. Los tests de `legacyHashRoadmap` cubren la matriz.

| Alias | Canónica |
| --- | --- |
| `#casework` | `#projects` |
| `#casework/demand-forecasting` | `#projects/providentia/demand-forecasting` |
| `#engineering-log` | `#projects/paradigm/no-show` |
| `#data-bi`, `#stack` | `#about/skills` |
| `#operations` | `#about/experience` |
| `#enfoque` | `#about/method` |
| `#formacion` | `#about/education` |
| `#proyectos` | `#projects` |
| `#portada` | `#home` |
| `#contacto` | `#contact` |

Los otros aliases de caso (`capacity-decision`, `policy-decision`, `no-show`, `operational-risk`, `aletheia`) siguen derivados de `caseStudies.js`. No se eliminó compatibilidad.

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

`og-default.png` se conserva. Es 1200×630, 16.446 B, fondo oscuro, “Data Analyst” y las cuatro herramientas. Coincide con la identidad actual. Se agregaron `twitter:title`, `twitter:description` y `twitter:image` apuntando a la misma imagen.

## Tests

`npm test`: 276 pass, 0 fail. El build de producción pasó antes de la corrida, así que el test de los 110 KB midió este `dist`.

Nuevos controles: `atlas.css` y `destination-views.css` ausentes, pantallas retiradas ausentes, stills en WebP con los charts de evidencia en PNG, README sin el Atlas, y JS inicial ≤ 110 KB cuando existe `dist` (se omite si no se construyó).

La paridad ES/EN del diccionario de UI se afirma sobre `uiEs`/`uiEn`. El árbol completo sigue teniendo una diferencia previa: las claves de `operationalRisk.limits.fromEvidence` son oraciones en inglés y solo están en el objeto ES. No se reescribió ese copy.

## Decisiones

- El documento es siempre oscuro. El papel queda en `.ds-case-stage`, no en `<html>`.
- `engineering-log.css` se conserva y se importa desde los módulos de caso. Sigue habiendo consumidores de `.elog-*`.
- `destination-views.css` se eliminó: no tenía consumidores.
- De `atlas.css` solo se trasladaron reglas con consumidor: tokens de papel y `.atlas-access` al case shell, galería y demo a `project-media.css`, cromo de header y footer a `shell.css`.
- No se recodificó el WebM. No se reemplazó la imagen Open Graph.

## Deuda que queda

- Warnings moderate de landmarks en los asides de evidencia de los casos.
- `representative-forecasts.webp` en 266 KB, y el WebM de Soma en 1,5 MB en su ficha.
- CLS de Home 0,016 frente a 0,005 en F0. El score de Performance es más alto.
- La suma de todos los chunks JS (161.920 B gzip-9) supera el entry monolítico de F0. El costo inicial no.
- Desajuste previo de claves en `operationalRisk.limits.fromEvidence`.
