# Punto de partida (F0)

Medido el 2026-11-03 sobre `main` en `868c767` («Merge PR #1: rediseño definitivo del portfolio», 2026-10-30), antes de crear la rama. Todo se midió sin modificar el repositorio: las pruebas no escriben nada y el build se generó en una carpeta temporal fuera del proyecto.

## Git

| Dato | Valor |
| --- | --- |
| Rama base | `main` = `origin/main` = `868c76726706b12ff8a4cb519c52b2af6348d232` (0 adelantadas, 0 atrasadas) |
| Árbol de trabajo | Limpio. Sin cambios preexistentes, sin stash. |
| Ignorados presentes | `_archive/`, `_review-aletheia*/` (control de calidad local), `dist/`, `node_modules/`. No se tocaron. |
| Otras ramas locales | `design/portfolio-refinement-v01` y `redesign`, ambas ya incluidas en `main`. No se tocaron. |
| Rama de trabajo | `design/superficie-de-decision`, local, creada desde `main`. Sin push. |
| Fin de línea | `core.autocrlf=input`; sin `.gitattributes`. Los archivos nuevos van con LF. |

## Entorno

Node 22.23.2, npm 10.9.8, Vite 5.4.21, React 18.3.1. Dependencias de ejecución: solo `react` y `react-dom`. Sin analítica, sin librerías de gráficos ni de interfaz.

## Pruebas

`npm test` (`node --test "src/**/*.test.js"`): **325 pruebas, 325 pasan, 0 fallan**, en 1,35 s. 23 archivos de prueba. (El documento de línea base de octubre registraba 164; la suite creció con el rediseño.)

## Build y presupuesto

Build con `vite build` hacia una carpeta temporal. Tamaños con `gzip -9`.

| Archivo | Bytes | gzip -9 |
| --- | --- | --- |
| `index-D_IMKLky.js` (JS inicial) | 336.706 | **103.158** |
| `index-DSf8unIR.css` (CSS inicial) | 57.053 | 10.944 |
| `Aletheia-*.js` | 67.640 | 16.092 |
| `EngineeringLog-*.js` | 62.121 | 17.988 |
| `OperationalRisk-*.js` | 37.847 | 11.198 |
| `CapacityDecision-*.js` | 28.762 | 8.341 |
| `DemandForecasting-*.js` | 27.649 | 8.402 |
| `PolicyDecision-*.js` | 25.350 | 7.526 |
| CSS de casos (4 archivos) | 30.002 | 6.648 |
| `index.html` | 3.390 | 1.200 |

**Presupuesto de Home:** el JS inicial debe quedar en 110 KB o menos con gzip nivel 9 (README). Hoy ocupa 103.158 bytes. **Margen: 6.842 bytes (si 110 KB = 110.000) o 9.482 bytes (si 110 KiB).** Es poco para sumar figuras y componentes: cada fase de interfaz debe compensar con código legado retirado o con carga perezosa. Las fuentes no cuentan en este total, pero tienen su propio presupuesto (F1).

**El sitio publicado coincide con este build:** `https://portfolio-me-f104.vercel.app/` sirve `index-D_IMKLky.js` y su contenido es idéntico, byte por byte (SHA-256), al generado localmente.

## Lighthouse

Medido el 2026-11-03 al inicio de F1, sobre este mismo `main` (`868c767`) servido con `vite preview` en `127.0.0.1`. Lighthouse 13.6.0 (`npx`, fuera del proyecto), Edge 156 sin interfaz, móvil, estrangulamiento simulado por defecto, **mediana de tres corridas** por página. Las fuentes de Google Fonts se pidieron por la red real; el resto, al servidor local.

| Página | Perf | A11y | Best Pr. | SEO | FCP = LCP (ms) | TBT (ms) | CLS | Transferido (KiB) | Fuentes pedidas (KiB) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `#home` | 100 | 100 | 100 | 100 | 763 | 44 | 0,016 | 305 | 188,7 (4 archivos) |
| `#projects` | 100 | 100 | 100 | 100 | 759 | 10 | 0,000 | 305 | 188,7 |
| `#projects/providentia` | 100 | 100 | 100 | 100 | 757 | 8 | 0,019 | 578 | 188,7 |
| caso `demand-forecasting` | 99 | 100 | 100 | 100 | 2.242 (LCP) | 51 | 0,001 | 922 | 188,7 |

Puntuaciones de Performance por corrida: Home 100 / 92 / 100, Proyectos 100 ×3, ficha 100 ×3, caso 99 / 99 / 86. La variación entre corridas es real: se compara siempre la mediana. Referencia anterior (7 de octubre, antes del rediseño, otra configuración): Home 91, Proyectos 86, caso 87.

**Fuentes que pide hoy el navegador en frío (todas las rutas):** Newsreader (≈ 129 KiB), IBM Plex Sans (≈ 45 KiB), IBM Plex Mono 400 y 500 (≈ 14 KiB cada una): 202,6 KiB en la red según el recorrido con el protocolo de depuración.

## Inventario del repositorio

- 230 archivos versionados; 135 en `src/` (23 de pruebas). `docs/` 88 KB, `public/` 10,7 MB (casos y medios). Paquete de Git: 10,9 MiB antes de sumar estas referencias (3,87 MB de imágenes).
- Estructura: `src/components` (Home, Proyectos, Ficha, Sobre mí, Contacto, casos), `src/projects` (registro, casos, categorías), `src/router`, `src/i18n` (ES/EN en el cliente), `src/visual` (visuales y sus datos reales), `src/casework`, `src/styles` (3.571 líneas) más `styles.css` y `engineering-log.css`.
- Rutas por hash con una sola URL canónica. Alias antiguos resueltos por `router/legacyHashRoadmap.js`.
- CV: `public/cv/` y `api/cv*.js`, descarga desde `CV_HREF`. No se toca.

## Lo que las pruebas actuales fijan y habrá que actualizar a propósito (en F2 y después)

- `registry.model.test.js` y `f4.test.js`: DECERNO ausente del registro y de los listados.
- `home.test.js`: el h1 es «Data Analyst» en ambos idiomas; las descripciones del hero; las tarjetas leen el registro.
- `about.test.js`, `profileExperience.test.js`, `workProjects.copy.test.js`: perfil, orden y copy.
- `seo.test.js` (canónica, imagen social de 1200 × 630, robots, mapa del sitio) y `cv.test.js` deben seguir en verde sin cambios de significado.

## Dependencias técnicas para las fases siguientes

| Necesidad | Fase | Estado |
| --- | --- | --- |
| Archivos WOFF2 de Fraunces, Instrument Sans e IBM Plex Mono y su OFL | F1 | A obtener con autorización (origen, nombre y tamaño). Sin dependencias de npm nuevas previstas. |
| Reemplazo de Google Fonts (`index.html` precarga y hoja de estilos) | F1 | Pendiente. |
| Script de presupuesto (JS inicial con gzip -9, CSS y fuentes) | F1 | A escribir. |
| Script de precálculo de figuras (`scripts/build-figures.mjs`) | F4 | A escribir. |
| Edge para capturas de comparación visual | F4 a F11 | Disponible en el equipo. |
| Lighthouse | F1 y F11 | Requiere descarga; a autorizar. |
| Fijar un commit de DECERNO como fuente | F7b | Su árbol de trabajo tiene cambios sin commitear; no se usa hasta la auditoría. |
