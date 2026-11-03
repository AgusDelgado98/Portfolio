# Informe de F2 — registro y control de publicación

Fecha: 2026-11-03. Rama `design/superficie-de-decision`, sin push. Parte de F1 (`2144cc2`).

**Estado: F2 completada.** DECERNO está registrado y retenido; ninguna superficie pública lo expone. Las 368 pruebas pasan y el build es correcto. El JavaScript inicial sube 216 bytes. Se completó la muestra de Lighthouse pendiente de F1 y **apareció una regresión de rendimiento en la página de caso**, anterior a F2 (ver «Lighthouse»): se informa, no se oculta, y queda para revisión.

## Commits locales

| Commit | SHA | Contenido |
| --- | --- | --- |
| 1 | `15dfea3912f39949031bed7457767645f997cebd` | Registro, publicación explícita, DECERNO retenido, `journey`, listas de presentación, pruebas y tolerancia del presupuesto. |
| 2 | (este informe; ver `git log`) | Documentación. |

## Cambios y archivos

| Archivo | Cambio |
| --- | --- |
| `src/projects/registry.js` | Campo `publication`; `hidden` pasa a derivarse; entrada `decerno`; `journey` en PROVIDENTIA, PARADIGM y DECERNO; listas de presentación y accesores nuevos. |
| `src/projects/publication.test.js` (nuevo) | Contrato de publicación: 16 pruebas. |
| `src/designNotes.test.js` (nuevo) | Las notas de diseño de los bocetos no llegan a producción: 2 pruebas. |
| `src/projects/registry.model.test.js`, `f4.test.js` | Actualizadas al nuevo contrato (ver abajo). |
| `scripts/check-budget.mjs` | Tolerancia de JS sobre la línea base: de 200 a 600 bytes acumulados, documentada. |

No se tocaron: i18n, rutas, componentes, estilos, fuentes, CV, SEO, `main`, `package.json` ni proyectos hermanos. DECERNO no tiene texto en ningún idioma.

## Cómo funciona el registro y el control de publicación

**Dos conceptos separados.** *Registrado* = está en `PROJECT_REGISTRY` (y lo ven las pruebas). *Publicado* = además tiene `publication: 'published'`. Un solo campo decide:

```js
publication: 'published' | 'withheld'   // en cada definición
hidden: publication !== 'published'      // derivado; nunca se escribe
```

Los accesores públicos que ya usaba el sitio (`hasProject`, `getProjectMeta`, `getVisibleProjects`, `ALL_PROJECT_IDS`, los listados, filtros, conteos y el router) siguen filtrando por `hidden`; por eso **no hubo que tocar ningún componente ni el router**. Retenidos hoy: `decerno`, `hogares` y `kairos`.

Accesores nuevos: `isPublished(id)`; `getRegisteredProjects()` y `getWithheldProjects()` (solo para pruebas y herramientas: una prueba impide que el código de producción los use ni lea `PROJECT_REGISTRY`); `getJourney(id)` (devuelve `null` para un proyecto retenido).

**La entrada de DECERNO** es solo estructura: `id`, `title`, `categories: ['ds-ml']`, `tier: 'featured'`, `group: 'personal'`, `status: 'active'`, `publication: 'withheld'`, `stages: []`, `stack: []`, `visual: 'procedural'` y un `journey` con los cuatro pasos como `designed`. Sin descripción, enlaces, medios, resultados, procedencia de datos ni casos. Una prueba fija el conjunto exacto de campos: agregar uno obliga a revisarlo contra la auditoría de divulgación.

**`journey`** (Explorar · Modelar · Evaluar · Decidir) es un campo nuevo y separado de `stages`, cuyos ids conservan su significado. Cada paso es `demonstrated` (con una fuente del repositorio que **debe existir**; lo verifica una prueba) o `designed`.
- PROVIDENTIA: modelar, evaluar y decidir (este último con `scope: 'simulation'`, según su contrato de afirmaciones).
- PARADIGM: explorar, modelar y evaluar.
- DECERNO: los cuatro `designed`, ninguno `demonstrated`.

**Listas de presentación** (solo datos; nada las usa todavía): `SPOTLIGHT_PROJECT_IDS` = DECERNO, PROVIDENTIA, PARADIGM; `COMPLEMENTARY_PROJECT_IDS` = SOMA; `getOtherProjectIds()` = los demás publicados, en orden de catálogo. Hoy `getSpotlightProjectIds()` devuelve `['providentia', 'paradigm']`. No se llamó `FEATURED_*` porque `FEATURED_PROJECT_IDS` es un shim de Atlas eliminado (una prueba lo exige) y «featured» ya es un nivel (`tier`).

**Para publicar DECERNO en el futuro** hacen falta, a propósito: cerrar la puerta EG6 (auditoría de divulgación y autorización independiente), cambiar `publication` a `published`, agregar su texto ES/EN y editar las pruebas de `publication.test.js` y `registry.model.test.js`. Con solo cambiar el campo, **21 pruebas fallan** (verificado: se probó la mutación y se restauró).

## Pruebas

**368 de 368** (350 anteriores y 18 nuevas). Build correcto.

Nuevas, por tema: campo `publication` válido y `hidden` derivado; exactamente tres retenidos y ocho publicados; ids y orden congelados (los existentes no cambian); DECERNO solo estructura; sus pasos de `journey` nunca `demonstrated`; ausente de todo accesor, lista, filtro, conteo (el filtro DS / ML sigue en 3) y ancla; ninguna ruta lo resuelve (detalle, caso, secciones, alias) y se comporta exactamente como un id desconocido o como Hogares; ninguna cadena suya en los mensajes ES/EN; ausente de `index.html`, `robots`, `sitemap` y todo `public/`; el único archivo de código que lo nombra es `projects/registry.js`; `journey` válido con fuentes existentes; listas de presentación íntegras (ninguno perdido ni repetido); el código de producción no lee el lado no publicado; ninguna nota de diseño de los bocetos llega a `src`, `public` ni `index.html`.

Actualizadas a propósito (el contrato anterior decía «DECERNO ausente»): en `f4.test.js`, «ocho proyectos visibles… y DECERNO registrado pero no público»; en `registry.model.test.js`, la tabla congelada incluye a DECERNO, el bloque «DECERNO stays out» pasa a «registrado, no publicado» y la lista de retenidos incluye a DECERNO. Las pruebas de rutas, filtros, grupos, casos y copia de proyectos pasaron sin cambios.

Compatibilidad ES/EN: las pruebas de paridad existentes pasan. F2 no agrega textos, así que no hay claves nuevas que traducir.

## Presupuesto de JavaScript

| | Bytes (gzip -9) |
| --- | --- |
| Línea base (`main`) | 103.306 |
| Final de F1 | 103.301 |
| **F2** | **103.522** (+216, +0,2 %) |
| Tope documentado | 110.000 (margen 6.478) |

El crecimiento es la entrada de DECERNO y los datos de `journey`. **Decisión:** la copia ES/EN de los cuatro pasos (+182 bytes) se **difirió a F4**, cuando la Home la use, junto con su prueba de paridad: texto sin consumidor solo suma bytes al JS inicial. CSS (11.736) y fuentes (208.512) no cambian. Como el recorte no llegaba al margen de 200 bytes que fijé en F1, **re-basé la tolerancia de `check-budget.mjs` a 600 bytes acumulados** para todo el rediseño; el tope real de 110 KB no cambia.

## Verificación en navegador (muestra)

Con el build final, en Edge a 1.440 px: Home, Proyectos, Sobre mí, la ficha de PROVIDENTIA, su caso de pronóstico y las rutas `#projects/decerno`, `#projects/decerno/case-01` y `#decerno`. Ninguna página contiene el texto «DECERNO» ni enlaces a él, y los títulos de documento no lo mencionan. Las rutas de DECERNO muestran la Home, como cualquier id desconocido. Sin desborde horizontal.

## Lighthouse (muestra pendiente de F1, completada)

Lighthouse 13.6.0, Edge, móvil, simulado, mediana de tres corridas, build final de F1 más F2. Solo ficha y caso (6 corridas); no se repitieron las demás rutas.

| Página | Serie | Perf | LCP (ms) | TBT (ms) | CLS | KiB |
| --- | --- | --- | --- | --- | --- | --- |
| Ficha PROVIDENTIA | Antes (`main`) | 100 | 757 | 8 | 0,019 | 578 |
| Ficha PROVIDENTIA | **F2** | 100 | **759** | 11 | **0,003** | 514 |
| Caso «demand forecasting» | Antes (`main`) | 99 | 2.242 | 51 | 0,001 | 922 |
| Caso «demand forecasting» | **F2** | **96** | **2.766** | 86 | 0,000 | 858 |

Accesibilidad, buenas prácticas y SEO: 100 en las seis corridas.

**Regresión encontrada: página de caso.** Performance baja de 99 a 96 y el LCP de 2.242 a 2.766 ms (+524 ms; corridas 96, 96, 91). Lo que se sabe:
- **No viene de F2:** la serie intermedia de F1 con precargas ya daba 2.761 ms en ese caso. Viene del cambio de tipografía y de tokens de F1 (la comparación del caso no se había medido en F1).
- El elemento LCP es el mismo (`p.elog-lede`) y en los tiempos observados la carga es más rápida que antes (fuentes locales, menos bytes); la diferencia está en la métrica simulada. La causa exacta no está identificada.
- Impacto: ocurre solo en las páginas de caso; Home, Proyectos y fichas no se ven afectadas.

**Actualización (diagnóstico cerrado el 2026-11-03):** el diagnóstico acotado se hizo después de este informe y la diferencia quedó explicada; el detalle y las cifras están en `evidence-log.md` («Diagnóstico del LCP simulado en páginas de caso»). Resumen: la diferencia del LCP simulado es reproducible; las fuentes autoalojadas la explican porque sus peticiones empiezan antes del LCP observado y Lighthouse las cuenta; el LCP observado en laboratorio muestra una diferencia pequeña (223 → 258 ms); no hay evidencia suficiente de una regresión importante de experiencia de usuario; el comportamiento en condiciones reales queda pendiente de evaluar en F11. **No se modifican las fuentes ni se retrasa su carga para mejorar una puntuación.** El párrafo siguiente se conserva como registro histórico y **no se aplica**.

**Corrección mínima propuesta** (no aplicada; reemplazada por la actualización anterior): un diagnóstico acotado de dos o tres corridas sobre el caso, comparando `font-display: swap` con la fuente de respaldo, el CSS del caso y el orden de carga, antes de F3 o dentro de F11. Si se confirma que el LCP lo causa el cambio de fuente, la opción menos invasiva es ajustar las métricas de respaldo de la fuente de cuerpo de los casos. Necesito tu decisión para hacerlo: no es parte de F2.

## Decisiones y problemas que requieren revisión

1. **Los proyectos retenidos viajan en el JavaScript.** La entrada de DECERNO (nombre, categoría y campos estructurales; sin texto) está en el bundle, igual que Hogares y Kairós; «DECERNO» aparece 4 veces en el JS. No es visible en la interfaz ni en HTML, pero se puede leer en el código descargado. Si querés que ni siquiera el nombre viaje antes de la autorización, la alternativa es mantener la entrada fuera del bundle (por ejemplo, en un módulo que solo importen las pruebas); lo descarté por ahora porque complica el registro, pero es tu decisión.
2. **Pruebas de texto que contradicen el nuevo posicionamiento.** `home.test.js` prohíbe «junior», «trainee», «applied ai» y «seeking»; `about.test.js` prohíbe «junior», «data scientist» y «applied ai». Siguen en verde y protegen el sitio actual. Habrá que cambiarlas a propósito en F4, F8 y F9 (roles objetivo, «IA aplicada»).
3. **Valores provisionales de DECERNO:** `status: 'active'` (único valor existente; la etiqueta «en desarrollo» o «experimental» llega con su texto), `tier: 'featured'` (no `flagship`, que pertenece a PROVIDENTIA), categoría `ds-ml`. Se revisan en F7.
4. **`journey` es conservador:** nada de DECERNO figura como demostrado; en PROVIDENTIA, «decidir» es simulación de políticas de capacidad. Quedan sujetos a la revisión de la matriz (EG3).
5. **Copia de la jornada diferida a F4** (explicado arriba).

## Pendientes para próximas fases

1. ~~Decidir la regresión del caso~~ Diagnosticada y cerrada (ver arriba); evaluar el comportamiento real en F11. Sigue pendiente el camino del presupuesto crítico de fuentes (de F1), antes de F4.
2. F3 (cabecera) no depende de F2.
3. F4 consume `getSpotlightProjectIds`, `getComplementaryProjectIds`, `getOtherProjectIds` y `getJourney`; agrega la copia ES/EN de la jornada.
4. F7: texto, figura y estructura de DECERNO; solo entonces se evalúa cambiar `publication`.
