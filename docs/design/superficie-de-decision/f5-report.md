# Informe de F5 — página de Proyectos

Fecha: 2026-11-03. Rama `design/superficie-de-decision`, sin push. Parte del cierre de F4 (`61a3f50`).

**Estado: F5 completada.** La página `#projects` sigue R2 y R5 en estructura editorial: hero «Tres casos, tres preguntas», costura, placas de proyectos publicados y «Otros proyectos» compacto. ContourMap está generado y listo; no se monta mientras el proyecto principal permanece retenido. 403 pruebas pasan, build correcto, presupuesto JS/CSS dentro de límites. DECERNO no aparece.

## Commits locales

Ver `git log` en la rama; este informe cierra la fase.

## 1. Qué se implementó

| Pieza | Qué hace |
| --- | --- |
| `ProjectsHero` | Eyebrow, titular «Tres casos, tres *preguntas*.», tres preguntas de marco (sin nombrar proyectos). |
| `Seam` | Reutilizada de F4. |
| `ProjectsSpotlight` | Placa + filas + SOMA, mismo orden de presentación que Home (publicado solamente). |
| `OtherProjects` | Lista compacta de los cinco personales (`getOtherProjectIds`), copy existente (EG11), sin filtros ni carrusel. |
| `ContourFigure` | Componente listo con etiquetas HTML ES/EN; no importado por el spotlight mientras ningún proyecto publicado use ContourMap. |
| ContourMap SVG | `public/figures/contour-map.svg` (700×600), geometría sola, deterministic, 12,6 KB gzip. |

Se retiraron de la página de índice los filtros y el catálogo en grid (`FilterBar` / `ProjectGrid` dejan de usarse aquí; los archivos quedan para limpieza en F11).

## 2. Diferencias con R2 / R5

| Diferencia | Motivo |
| --- | --- |
| **Placa principal: PROVIDENTIA con ForecastFan, no ContourMap/DECERNO.** | DECERNO retenido (EG6). Misma regla que F4 en Home. ContourMap existe y `ContourFigure` está listo. |
| **Sin campos Pregunta / Estructura / Estado de la placa DECERNO.** | Contenido no autorizado. F6 enriquecará PROVIDENTIA/PARADIGM. |
| **«Otros proyectos» debajo de SOMA.** | R2 no lo muestra; `decisions.md` y el plan F5 lo exigen. Cinco fichas con copy ya publicado. |
| **«CV» en la barra.** | Decisión tras F3. |
| **Título de Paradigm/Soma en registro con capitalización mixta; CSS en mayúsculas.** | Igual que Home. |

## 3. Pruebas y build

- **403 / 403** (396 + 7 de `f5.test.js`).
- **Navegador** (`f5/capture.mjs`): **22 / 22** a 1.440 y 390 px; EN OK; sin overflow; sin DECERNO; cinco otros proyectos con `#projects/…`; sin filtros; objetivos táctiles ≥ 44 px.
- **Build** correcto.

## 4. Presupuestos (gzip -9)

| | Bytes | Límite |
| --- | --- | --- |
| JS inicial | **103.688** (−406 vs F4 104.094) | 110.000 (script sin tocar tolerancia) |
| CSS inicial | **12.879** | 13.014 |
| Figuras totales | **76.132** (ContourMap 12.613) | 80.000 |
| Fuentes | 208.512 | 210.000 |

## 5. Capturas

En `docs/design/superficie-de-decision/f5/`: `projects-1440.png`, `projects-390.png`, `projects-1440-en.png`, `browser-checks.json`.

## 6. Siguiente

No se avanza a F6. F6 puede agruparse con trabajo de fichas PROVIDENTIA/PARADIGM (EG4, EG5) cuando se autorice; ContourMap se monta al publicar el proyecto principal (autorización aparte, EG6).
