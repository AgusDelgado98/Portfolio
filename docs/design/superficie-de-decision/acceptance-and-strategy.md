# Estrategia de implementación y criterios de aceptación

Versión de referencia: plan v3 aprobado el 2026-11-03, con las decisiones de `decisions.md`. Cada fase se autoriza **de forma independiente**: aprobar una no autoriza la siguiente.

## Estrategia

- **Rama aislada** `design/superficie-de-decision`, desde `main`. Commits locales por fase, con la suite completa en verde. Nada llega a producción.
- **Sin push, PR, merge ni despliegue** sin autorización expresa. No se toca la configuración de la plataforma de despliegue ni el dominio.
- **No se modifica** el CV (`public/cv`, `api/cv*.js`, `CV_HREF`), los proyectos hermanos ni el contenido público de DECERNO.
- **Referencias obligatorias:** cada fase entrega capturas a 390, 768 y 1.440 px junto a su referencia (R1 a R6). Un desvío se aprueba antes de seguir.
- **Evidencia antes que publicación:** una puerta EG abierta bloquea publicar el contenido que depende de ella (ver `evidence-log.md`).
- **Figuras:** componentes SVG de React propios, sin dependencias nuevas. Cada una declara su tipo (`real`, `simulated`, `conceptual`) y no se dibuja sin su insignia. Las figuras conceptuales y simuladas nunca se presentan como resultados.
- **Presupuestos:** JS inicial de Home ≤ 110 KB con gzip nivel 9 (hoy 103.158 bytes; ver `baseline.md`); fuentes críticas ≤ 90 KB y totales ≤ 150 KB en WOFF2.
- **Pruebas:** la suite se mantiene en verde en cada commit. Una prueba que cambia lleva el motivo en el mensaje del commit. Las pruebas que fijan el diseño anterior se actualizan juntas, con criterio, en F2.
- **ES y EN juntos** en cada fase, con prueba de paridad de claves y una tabla ES/EN para revisión del titular.
- **Conservar** rutas y alias, anclas, `CV_HREF`, enlaces profesionales y el comportamiento de foco y desplazamiento. Los ids `stages` actuales no se reutilizan para el lenguaje nuevo; se agrega `journey`.
- **Contenido de DECERNO:** secciones con estado `verified` o `pending` y fuente fijada a un commit; solo se renderizan las verificadas. En la primera versión, solo contenido genérico.
- **Notas de diseño:** viven solo en bocetos. Una prueba (F2 y F11) falla si «NOTA DE DISEÑO», `class="dn"` o «a completar» llegan a `src/`, `public/`, `index.html` o al build.

## Criterios globales de aceptación

| Se preserva | Cómo se verifica |
| --- | --- |
| Portfolio público actual | Rama aislada; sin push ni despliegue. |
| Rutas y enlaces profesionales | Pruebas del router y de alias; `constants/links.js` sin cambios. |
| Descarga del CV | `cv.test.js` en verde; archivos y funciones del CV sin diferencias; los cinco botones apuntan a `CV_HREF`. |
| Analítica y eventos | No existe en el código ni en la página publicada (EG10). No se elimina ni se agrega nada. |
| SEO vigente | `seo.test.js` (canónica única, imagen social de 1200 × 630, robots, mapa del sitio). |
| Accesibilidad | Foco visible, orden de encabezados, objetivos de 44 px o más, teclado y lector de pantalla, `prefers-reduced-motion`. |
| Responsive | Capturas a 390, 768, 1.024 y 1.440 px contra las referencias. |
| Rendimiento | Presupuestos arriba; Lighthouse móvil con mediana de tres, no peor que la línea base. |
| Pruebas | Suite completa en verde (325 al partir). |

## Fases

Dependencias: F0 → F1 y F2 (en paralelo) → F3 → F4, F6, F7 y F8 (en paralelo; F5 espera el componente compartido de F4) → F9 → F10 → F11 → F12.

| Fase | Entrega | Depende de | Referencia | Puertas |
| --- | --- | --- | --- | --- |
| **F0** | Rama, referencias, documentación, línea base. **Completada.** | — | — | EG1, EG2, EG10 |
| **F1** | Tokens con puente a los actuales; fuentes autoalojadas con OFL; escala tipográfica; script de presupuesto. **Completada el 2026-11-03, con el presupuesto crítico de fuentes pendiente** (ver `f1-report.md`). | F0 | R6 | EG9 |
| **F2** | DECERNO oculto en el registro; listas de presentación; campo `journey`; pruebas actualizadas. **Completada el 2026-11-03** (ver `f2-report.md`). Quedaron para fases con consumidor: el esquema de secciones, el de figuras y la copia ES/EN de la jornada (F4). | F0 | — | — |
| **F3** | Cabecera con hilo de progreso; menú de pantalla completa; selector de idioma; marca en el pie. **Completada el 2026-11-03** (ver `f3-report.md`). La costura entre secciones pasa a F4, con la Home. | F1, F2 | R1, R5 | — |
| **F4** | `FigureFrame`, `ResponseSurface`, `StageGlyph`, `FeaturedProjects`; Home completo. | F3 | R1, R5, R6 | EG7, EG13, EG1, EG2 |
| **F5** | Encabezado «Tres casos, tres preguntas»; `ContourMap`; «Otros proyectos» compacto. | F4 | R2, R5 | EG11 |
| **F6** | `ForecastFan` y `QualityMosaic`; fichas de PROVIDENTIA y PARADIGM con contenido real. | F3, primitivas de F4 | R2, R6 | EG4, EG5 |
| **F7** | F7a: estructura y compuerta. F7b: contenido auditado. F7c: activar DECERNO (autorización aparte). | F2, F3 | R3, R5 | EG6 |
| **F8** | `EvolutionRoute`, trayectoria, matriz derivada con fuente por marca, dedicación parcial y DataCamp. | F3 | R4, R5 | EG1, EG2, EG3 |
| **F9** | Título, metadatos, OG, contacto con los roles objetivo, copy final ES/EN. CV sin cambios. | F4 a F8 | — | EG8 |
| **F10** | Compatibilidad de los seis casos públicos bajo la carcasa nueva. Sin rediseño profundo. | F1, F3 | — | — |
| **F11** | Limpieza de componentes legados sin uso, QA global, comparación con R1 a R6. | F4 a F10 | R1 a R6 | — |
| **F12** | PR y vista previa, solo con autorización. | F11 | — | — |

### Criterios de aceptación por fase

- **F1.** El sitio actual se ve con la base nueva sin romperse. Prueba de contraste ampliada (texto ≥ 4,5:1; gráficos ≥ 3:1; el cobre sobre papel no se usa para texto). Prueba de fuentes: archivos y OFL presentes, sin referencias a Google Fonts, dentro del presupuesto. Script de presupuesto en verde.
- **F2.** Suite en verde. DECERNO no aparece en ninguna salida pública. Los ids `stages` no cambian. El orden de presentación es DECERNO, PROVIDENTIA, PARADIGM, con SOMA complementario. Paridad ES/EN. Guarda de posicionamiento («Data Scientist» ausente como cargo; «dedicación parcial» presente en la experiencia; «certificado» ausente junto a DataCamp).
- **F3.** Menú con foco atrapado, Escape y retorno del foco; objetivos de 44 px; descarga del CV intacta; comparación con R5.
- **F4.** JS inicial ≤ 110 KB; Home con tres proyectos y la línea de SOMA, sin carrusel ni proyectos personales; cada figura con su insignia; LCP no peor que la línea base; comparación con R1 y R5.
- **F5.** Los cinco proyectos personales siguen abriendo su ficha desde «Otros proyectos»; sin filtros ni carrusel; comparación con R2.
- **F6.** El abanico no aparece en la ficha de PROVIDENTIA ni sin su leyenda; las cifras de la ficha salen de datos congelados y de sus pruebas; respeta `claims_contract.md`.
- **F7.** Ninguna sección vacía ni pendiente en producción; sin Gate 0, autorizaciones limitadas, Hillstrom ni Caso 01; barra horizontal móvil accesible; comparación con R3 y R5.
- **F8.** Cada marca enlaza a una fuente; sin escala subjetiva; DataCamp sin certificado; comparación con R4.
- **F9.** Un solo canónico; robots y mapa del sitio válidos; títulos y descripciones ES/EN según `decisions.md` (con el ajuste de longitud que se apruebe); roles objetivo de Contacto actualizados.
- **F10.** Sin regresiones de contenido, enlaces ni accesibilidad en los seis casos a 390 y 1.440 px.
- **F11.** Lighthouse y accesibilidad no peores que la línea base remedida; suite completa; sin notas de diseño; revisión ES/EN completa. **Además:** evaluar en condiciones reales (no solo en simulación) el LCP de las páginas de caso, que en laboratorio mostró una diferencia simulada explicada por las fuentes autoalojadas (ver `evidence-log.md`, «Diagnóstico del LCP simulado»). No se retrasan las fuentes para mejorar una puntuación.

## Pruebas nuevas previstas

Contraste de tokens; fuentes; paridad ES/EN; guarda de posicionamiento; registro y `journey` (las etapas «diseñadas» no se muestran como logradas); figuras (huella determinista, insignia, fuente, `aria`, peso); presupuesto de build; compuerta de DECERNO; ausencia de notas de diseño; rutas (incluye que `#projects/decerno` caiga en `#projects` mientras esté oculto); CV y SEO; comprobaciones de accesibilidad; comparación visual con las referencias.

## Cómo se decide cada fase

1. El titular autoriza la fase de forma expresa.
2. Se implementa y se prueba en la rama, con commits locales.
3. Se informa: archivos tocados, pruebas, capturas frente a la referencia, diferencias con el plan y puertas de evidencia pendientes.
4. El titular revisa y autoriza la siguiente.
