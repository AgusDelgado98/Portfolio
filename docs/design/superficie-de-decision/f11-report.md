# F11 — Auditoría final de publicación

**Resultado general: APTO CON OBSERVACIONES.**

El portfolio en `design/superficie-de-decision` está listo para F12 (PR / vista previa) con riesgo aceptable. No se reabrieron decisiones estéticas. F7 (DECERNO) no se ejecutó. No hay push ni despliegue.

## 1. Problemas encontrados y corregidos

| Hallazgo | Severidad | Corrección |
| --- | --- | --- |
| Tabs de trayectoria en About: `aria-pressed` + `role="tab"` (LH `aria-allowed-attr`) | Bloqueante a11y | Se elimina `aria-pressed` en tabs; queda `aria-selected` |
| Marcas vacías de la matriz: `aria-label` en `<span>` sin rol (LH `aria-prohibited-attr`) | Bloqueante a11y | `role="img"` en marcas vacías |
| Contraste 4,33 < 4,5 en `th` de filas `.is-selected` (casos / elog) | Importante | Color `#6f481c` en `engineering-log.css` |
| Componentes muertos `FilterBar` / `ProjectGrid` / `ProjectCard` + CSS de tarjeta | Limpieza F11 | Eliminados; hover de figuras retarget a `.ds-proj-visual` |
| Prefetch About | Mejora acotada | `import('../About.jsx')` en hover/focus del enlace Sobre mí (desktop + menú) |

Tras el arreglo, Lighthouse About y caso público: **Accessibility 100** (mediana de 3 corridas). Contraste del caso: score 1.

## 2. Problemas pendientes por severidad

### Bloqueantes
Ninguno pendiente para publicar con el alcance F11.

### Importantes no bloqueantes
1. **CLS alto en `#about` en frío (laboratorio ~0,92–0,96).** Causa: About es lazy (JS + CSS diferidos) para respetar el presupuesto CSS del entry. El prefetch en hover mitiga navegación interna; un deep-link frío a `#about` sigue pintando sin hoja y luego reaplica layout. No se inlinó `about.css` en el entry (superaría la tolerancia CSS). Mejora posterior: esqueleto de altura reservada o subset crítico sin tocar la composición.
2. **Excepción de fuentes críticas (objetivo 115 KB).** Total de archivos 208.512 B (límite 210 KB OK). La evidencia F4 + el diagnóstico de LCP simulado (`evidence-log.md`) se mantienen: no se cambia tipografía. Reevaluación F11: **mantener la excepción** hasta un subsetting que no altere la cara publicada.
3. **LCP simulado de Lighthouse** (~2,9–3,2 s en la muestra) sigue inflado respecto del pintado observado en laboratorio (diagnóstico F3/F4: cola de fuentes autoalojadas en la simulación). No es dato de usuarios reales.
4. **Sin analítica.** Ausente a propósito en F11; registrar como mejora futura (no introducir ahora).

### Mejoras posteriores
- Subsetting / descubrimiento de fuentes sin cambiar tipografía.
- Esqueleto o CSS crítico mínimo para About (CLS).
- Rediseño profundo de interiores de caso (ya diferido en F10 / decisions.md §8).
- Verificación en Safari iOS real y con lector de pantalla real.
- Field data (CrUX / RUM) tras publicar.

## 3. Pruebas y build

| Comprobación | Resultado |
| --- | --- |
| Suite `npm test` | **423 / 423** pass |
| `npm run build` | OK |
| Presupuesto `check-budget.mjs` | PASS (ver §5) |
| Auditoría Edge CDP `f11/audit.mjs` | **130 / 130** (320 / 390 / 768 / 1440; tablas con `overflow-x: auto`; Escape cierra menú; DECERNO retenido; SEO / CV / GitHub / LinkedIn / contacto) |
| Lighthouse muestra (Home, Proyectos, About, caso) | 3 corridas/página; re-batería justificada solo About + caso tras fixes a11y |

**No verificado en F11:** Safari iOS real; VoiceOver / NVDA / JAWS; métricas de campo de usuarios.

## 4. Presupuestos (build final F11)

| Métrica | Valor | Límite | Margen |
| --- | --- | --- | --- |
| JS inicial gzip -9 | 104.207 | 104.906 (tol. baseline+1600; tope duro 110.000) | +699 |
| CSS inicial gzip -9 | 12.041 | 13.014 | +973 |
| Fuentes (archivos) | 208.512 | 210.000 | +1.488 |
| Fuentes críticas (objetivo) | excepción vigente | 115.000 target | MISS documentado |

Tolerancias **no** ampliadas. Tipografía **no** modificada para forzar 115 KB.

## 5. Rendimiento y accesibilidad

### Lighthouse (laboratorio, simulado — no RUM)

Mediana de 3 corridas, móvil, Edge vía `CHROME_PATH`, `vite`/`serve` local.

| Página | Perf | A11y | BP | SEO | LCP ms | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 92 | 100 | 100 | 100 | 3245 | 0,014 |
| Proyectos | 95 | 100 | 100 | 100 | 2987 | 0,002 |
| About (post-fix) | ~71 | **100** | 100 | 100 | ~2659 | **~0,96** |
| Caso demand-forecasting (post-fix) | ~94 | **100** | 100 | 100 | ~2805 | 0 |

Línea base F1 (mismo protocolo, Google Fonts): Home Perf 100 / LCP ~763. La subida del LCP **simulado** es la ya diagnosticada con fuentes autoalojadas; no se interpreta como regresión de experiencia de usuario sin datos de campo.

### Observado vs simulado
- Simulado: valores de la tabla anterior.
- Observado (CDP sin throttle, `f11/observed-metrics.json`): FCP Home ~250–340 ms; CLS 0 en la sonda; entradas LCP incompletas en SPA headless — **no sustituye** la medición F4 con red limitada (`f4/fonts-exception/mediciones.json`), que sigue siendo la evidencia de excepción tipográfica.
- Diferencia simulada ↔ observada en casos: ver `evidence-log.md` (≈ +0,6 s atribuibles a la cola de fuentes en la simulación).

### Accesibilidad / responsive (Edge emulado)
- Teclado / Escape menú móvil: OK.
- Sin overflow horizontal de página en 320–1440.
- Tablas de casos: scroll horizontal con `tabIndex={0}` en el wrap.
- `prefers-reduced-motion`: sin animaciones `infinite`.
- Foco: outlines presentes en controles auditados.

## 6. Contenido, SEO, DECERNO

- Posicionamiento Data Science / ML / Analítica aplicada en título, meta y OG: OK.
- Canonical + `sitemap.xml` (solo `/`) + `robots.txt`: OK; sin DECERNO.
- Ruta `#projects/decerno`: cae a Home; sin shell de caso ni copy DECERNO.
- Figuras conceptuales y métricas existentes: intactas (sin tocar CV).
- Paridad ES/EN cubierta por la suite; no se alteró copy aprobada.

**DECERNO:** proyecto retenido. EG6 bloqueada. Ausente de rutas públicas, listados, navegación y metadatos. F7 no iniciada.

## 7. Commits y Git

Rama: `design/superficie-de-decision`. Commits locales de F11 (sin push). Ver `git log` / estado al cierre.

## 8. Recomendación F12

**Autorizar F12** (PR + vista previa) con el veredicto APTO CON OBSERVACIONES.

Antes o justo después de publicar, priorizar: (1) esqueleto/CLS de About en deep-link, (2) subsetting de fuentes sin cambiar tipografía, (3) smoke en Safari iOS + un lector de pantalla, (4) analítica mínima si se desea medición de campo. No reabrir el rediseño visual. No ejecutar F7 hasta autorización explícita.
