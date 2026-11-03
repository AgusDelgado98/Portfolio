# F10 — Coherencia de casos y fichas existentes

**Estado: F10 completada (alcance de compatibilidad).** Los seis casos públicos cargan bajo CaseShell con papel `--ds-paper`, chrome editorial sin caja bordeada, tipografía Superficie y sin regresión de contenido. Rediseño profundo de interiores de caso: **diferido** a PR independiente (decisions.md §8). DECERNO no aparece. F7 no ejecutada. F11/F12 no iniciadas.

## 1. Revisión visual integrada (antes)

Capturas en `f10/review/` (1440 y 390): Home, Proyectos, Sobre mí, Contacto, ficha PROVIDENTIA, caso demand-forecasting (+ EN).

| Superficie | Continuidad |
| --- | --- |
| Home → Proyectos → Sobre mí → Contacto | Coherente: oscuro → marfil, Fraunces/Instrument, footer F9. |
| Ficha PROVIDENTIA | Ya en identidad oscura `ds-detail`; alineada con Proyectos. |
| Casos públicos | Ruptura: chrome tipo tarjeta + papel `#e9e5da` distinto de `--ds-paper`; acentos Atlas. |
| Móvil 390 | Tablas anchas con scroll horizontal (esperado; no rediseño de columnas). |

## 2. Ajustes F10 (mínimos)

- `case-shell.css`: chrome sin borde/caja; stage en `--ds-paper` / `--ds-paper-text`; acento interactivo hacia copper-ink; wraps de tablas reforzados.
- `projects.css` (detalle): `min-width: 0` / `max-width: 100%` para el ritmo de columna.
- Sin cambios de copy, métricas, datasets, rutas ni casos.

**Fuera de alcance (documentado):** reconstrucción tipográfica/layout de pasos, chips, grids y gráficos internos de los seis casos → PR posterior.

## 3. Validación

- Suite: **423 / 423**
- Navegador post: **62 / 62** (6 casos × 1440/390 + ficha)
- Build OK

## 4. Presupuestos

| | Medido | Límite | Margen |
| --- | ---: | ---: | ---: |
| JS gzip | 104.126 | 104.906 | +780 |
| CSS gzip | 12.258 | 13.014 | +756 |

Tolerancias sin tocar. Excepción tipográfica vigente hasta F11.

## 5. Capturas

- Antes: `f10/review/*`
- Después: `f10/after/*` (casos representativos + detail)

## 6. Pendientes auditoría final (F11+)

- Scroll horizontal interno de tablas en móvil (accesible vía `overflow-x: auto`).
- LCP real de páginas de caso (excepción fuentes).
- Limpieza de restos Atlas en CSS de casos (F11).
