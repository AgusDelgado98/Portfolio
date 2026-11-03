# Informe de F4 — la nueva Home

Fecha: 2026-11-03. Rama `design/superficie-de-decision`, sin push. Parte del cierre de F3 (`bea5a36`).

**Estado: F4 completada.** La Home sigue R1 y R5 en escritorio, en anchos intermedios y en móvil. Las 393 pruebas pasan, el build es correcto y las 80 comprobaciones en navegador pasan. El JavaScript inicial **baja** 680 bytes respecto de F3 (104.092 B) y el CSS prácticamente no cambia (12.331 B); la tolerancia del script de presupuesto no se tocó. DECERNO no aparece ni deja huecos. La Home carga la itálica de Fraunces y los cinco archivos de fuentes (208.512 B): el total cumple, el objetivo crítico de 115 KB no, y el titular autorizó una **excepción provisional** tras una verificación con red y CPU limitadas (ver sección 8).

## Commits locales

| Commit | SHA | Contenido |
| --- | --- | --- |
| 1 | `651f527a02d4f0ca70eba6d02ba9632d254cee06` | Generador de figuras y los seis SVG estáticos. |
| 2 | `8005b6505eeb54318113ce8889ff24a641db3e35` | La Home, la retirada de lo que dejó de usarse, textos ES/EN, estilos y pruebas. |
| 3 | (este informe; ver `git log`) | Informe, capturas y comprobaciones de F4. |

## 1. Componentes implementados

| Pieza | Qué hace |
| --- | --- |
| `HomeHero` | Eyebrow, titular «Datos, evidencia y decisiones.» (solo «decisiones» en itálica de arena), subtítulo aprobado, «Ver proyectos» y «Sobre mí», la figura y la secuencia. En móvil la figura queda entre el titular y el subtítulo; el orden del DOM es titular, texto, figura. |
| `HeroFigure` | Superficie de respuesta estimada (figura 1). Un solo `<img>` con `<picture>`: el dibujo grande con líneas guía y etiquetas HTML desde 1.180 px; debajo, el dibujo compacto con insignias numeradas y la misma lista de etiquetas como leyenda en 2 × 2. Sin carga diferida, con prioridad alta y con sus dimensiones. |
| Secuencia (en `HomeHero`) | Explorar → Modelar → Evaluar → Decidir con glifos de un sprite SVG. Usa los ids `journey` del registro, **no** los ids antiguos DATA, EVIDENCE, PREDICTION y DECISION (una prueba lo exige). |
| `Seam` | La costura de curvas de nivel entre el fondo oscuro y el marfil (`seam.svg`). Estática, decorativa, oculta a tecnologías de asistencia. |
| `ProfileBlock` | «Perfil»: titular y tres filas (Base, Formación, Dirección) con los hechos confirmados. |
| `FeaturedProjects` | «Proyectos seleccionados», numerados. El primer proyecto publicado ocupa el **lugar principal** (placa oscura), los siguientes son filas editoriales y el complementario cierra en una línea. Cada figura lleva su nota «Figura conceptual». |
| `figureMeta.js` (generado) | Posición porcentual de las etiquetas de cada figura. |
| `tools/figures/build-figures.mjs` | Generador determinista de las figuras (ver sección 2). |

Se **retiraron**, por quedar sin uso: el flujo interactivo del hero (`HeroFlowVisual`), `StageDetail`, `stages.js`, `stageFacts.js`, las tarjetas y secciones anteriores (`WorkProjects`, `PersonalProjects`, `AboutBrief`, `HomeProjectCard`), el hook `useInView` y las reglas heredadas de la cabecera en `styles.css` que F3 ya sobrescribía. La página de Proyectos y sus tarjetas **no se tocaron** (siguen siendo de F5): se comprobó que los primeros 900 px de Proyectos, Sobre mí y un caso público son idénticos, píxel a píxel, a las capturas de F3, y que las tarjetas de Proyectos se ven completas.

## 2. Sistema de figuras

- **Recursos independientes, no JavaScript.** Seis archivos en `public/figures`: superficie grande, superficie compacta, abanico de pronóstico, mosaico de calidad de datos, costura y sprite de glifos. Los genera `node tools/figures/build-figures.mjs`, portando el código de los bocetos aprobados con sus mismas superficies, semillas y paleta.
- **Solo geometría.** Ninguna figura contiene texto: las etiquetas son HTML y usan las fuentes de la página y el idioma activo (un SVG cargado con `<img>` no ve las fuentes del sitio). Una prueba prohíbe `<text>`, scripts, imágenes, filtros y referencias externas.
- **Peso.** Superficie grande 147 KB (31,0 KB con gzip); compacta 75 KB (15,8 KB); abanico 7,8 KB; mosaico 2,1 KB; costura 3,6 KB; glifos 1,5 KB. Las celdas contiguas con el mismo estilo se fusionan en un solo trazado, lo que bajó la superficie grande de ~500 KB estimados a 147 KB. Cada dispositivo pide **solo** el dibujo que muestra (verificado: la grande a 1.180 px o más; la compacta debajo) y las figuras de proyecto cargan de forma diferida porque están bajo el pliegue.
- **Determinismo.** Una prueba regenera todo y lo compara con los archivos del repositorio: si alguien edita un SVG a mano o cambia el generador sin regenerar, falla.
- **Conceptuales identificadas.** «FIG. 1 — Superficie de respuesta estimada · figura conceptual, datos simulados»; «Figura conceptual · serie ilustrativa» (PROVIDENTIA); «Figura conceptual · calidad de datos ilustrativa» (PARADIGM). Ninguna se presenta como resultado real.
- **No se generó ni se incluyó la figura de DECERNO** (el mapa de contornos del boceto): no hay ningún activo suyo en `public`.

## 3. Diferencias con R1 y su justificación

| Diferencia | Motivo |
| --- | --- |
| **El proyecto principal es PROVIDENTIA, no DECERNO.** | DECERNO sigue retenido. La placa y las filas dependen de la posición en la lista publicada: cuando DECERNO se publique ocupará la placa y PROVIDENTIA pasará a la fila 02, sin reconstruir el diseño. Hoy el contador dice «01 — 02». |
| **Sin los campos «Pregunta» y «Estado» de la placa.** | Son de DECERNO y su texto no está autorizado. La placa muestra pregunta, descripción, etiquetas, origen de los datos y el botón. |
| **Subtítulo: «explico cuánta evidencia respalda cada conclusión».** R1 decía «digo con claridad qué tan firme es cada conclusión». | R1 es del boceto; el texto editorial aprobado en `decisions.md` (sección 12) es el que se implementó. |
| **Pie de la figura 1 dice «figura conceptual, datos simulados».** R1: «datos simulados». | Regla de identificación de figuras conceptuales. |
| **«CV» en la barra** (aprobado tras F3). | R1 no lo tiene; se mantiene por decisión del titular. |
| **Perfil: filas en una columna de 440 px** (R1: 470) y «Data Analyst con dedicación parcial en una red de consultorios médicos» en lugar de «Analista de datos part-time en un consultorio». | El titular salta a tres líneas como en R1; y la redacción sigue la experiencia ya publicada (red de consultorios) y la dedicación parcial confirmada. |
| **Se agrega «Ver todos los proyectos →» y se conserva la franja de contacto y el pie anteriores.** | R1 termina en la placa. Los demás proyectos viven en Proyectos y el contacto sigue accesible; el rediseño de contacto y pie queda para F9. |
| **Móvil: la superficie se ve entera.** R5 la recorta por los bordes. | Recortar dejaba el dibujo cortado con un borde duro; se ajustó para que quepa. La figura grande y la compacta son dibujos distintos. |
| **Móvil: leyenda con número y título.** | R5 la muestra así; la nota de cada etiqueta queda solo para lectores de pantalla en móvil. |
| **Entre 600 y 1.179 px la figura se limita a 640 px y se centra.** | Sin ese tope, a 1.024 px la compacta ocupaba todo el ancho. |
| **Entre 800 y 999 px la placa y las filas se apilan** (figura arriba, texto debajo). | Las dos columnas dejaban la figura demasiado pequeña con las etiquetas amontonadas. |
| **Sin movimiento.** | R1 es estático; la Home no define transiciones ni animaciones (una prueba lo exige), por lo que no necesita variante de movimiento reducido. |

## 4. Pruebas y build

- **Pruebas: 393 de 393** (383 anteriores; se reescribieron `home.test.js` y se ajustaron dos pruebas existentes que fijaban la Home anterior: el orden de secciones en `architecture.test.js` y el botón de CV del hero en `cv.test.js`).
- **Nuevas guardas:** copia ES aprobada y EN con la misma estructura; el titular dividido; posicionamiento (sin «Data Scientist» como cargo, sin «certificado» ni nivel junior); hechos del perfil; secuencia con los ids `journey` y un glifo cada uno; **la copia de la Home solo existe para proyectos publicados y ningún componente, texto ni figura nombra a un proyecto retenido**; figuras idénticas al generador, sin texto ni referencias externas y dentro de presupuesto; imagen visible sin carga diferida; márgenes y bandas de ancho completo; la Home no anima nada; objetivos táctiles; anillos de foco sobre oscuro y sobre marfil; contraste del texto sobre marfil.
- **Navegador real** (Edge; script y resultados en `f4/browser-checks.mjs` y `.json`): **80 de 80**. Ocho anchos (1.440, 1.280, 1.180, 1.024, 820, 600, 390 y 360 px): sin scroll horizontal, nada sobresale, las figuras cargan, titular en Fraunces, DECERNO ausente de texto y enlaces, sin errores en consola, solo se pide el dibujo que corresponde. A 1.180 px o más, las etiquetas de la figura quedan dentro de la ventana y no tapan el titular ni el subtítulo. A 1.440 px el titular mide 99,8 px (R1: 100). A 390 px el encabezado, el titular, el perfil y los proyectos comparten el margen de 22 px. Todos los enlaces miden 44 px o más a 1.440 y 390 px. El titular cabe a 360 y 320 px. Recorrido con teclado, anillos de foco (azul sobre oscuro, oscuro sobre marfil), enlaces a ficha, proyectos, trayectoria, contacto y CV, y la Home completa en inglés. Además, las 38 comprobaciones de la cabecera de F3 vuelven a pasar con este build.
- **Medición local (no es Lighthouse):** el elemento LCP es la imagen de la superficie (184–364 ms, sin limitación de red) y el CLS es de 0 a 0,006. Se corrigió un salto de 0,012 a 1.440 px: el titular se partía en tres líneas con la fuente de respaldo y volvía a dos al cargar Fraunces; ahora el bloque tiene ancho suficiente y cada línea no se parte.

## 5. Presupuestos

| | Bytes (gzip -9) | Límite |
| --- | --- | --- |
| JS inicial — F3 | 104.772 | — |
| **JS inicial — F4** | **104.092** (−680) | 110.000 (margen 5.908; tolerancia del script sin cambios) |
| CSS inicial — F3 → **F4** | 12.234 → **12.331** (+97) | 13.014 |
| Fuentes, total | 208.512 (sin cambios; **cumple**) | 210.000 |
| Fuentes críticas (objetivo) | 208.512 | 115.000 — **no cumplido; excepción provisional** (`decisions.md`, sección 17) |
| Figuras (fuera del paquete): grande + compacta + 4 pequeñas | solo se pide lo que se muestra; ≤ 31 KB a 1.180 px o más, ≤ 16 KB debajo | — |

El crecimiento del CSS de la Home se compensó eliminando las reglas heredadas del hero, las tarjetas, el detalle de etapas y la cabecera anterior (de 17 KB a 2,6 KB de reglas conservadas solo las que aún usan Proyectos y Contacto).

## 6. Problemas y decisiones que necesito

1. **Fuentes críticas: excepción provisional aceptada (2026-11-03).** La Home carga los cinco archivos (208.512 B); el total de 210 KB se cumple y el objetivo crítico de 115 KB no. El titular autorizó la excepción, sin quitar la itálica ni cambiar la tipografía, y se verificó con red y CPU limitadas (sección 8). La optimización adicional queda para F11 y debe mantener la tipografía; la excepción se reevalúa antes de publicar.
2. **La imagen del hero se descubre cuando corre el JavaScript** (la app se dibuja en el cliente). No la precargué: en F1 las precargas de fuentes empeoraron el LCP simulado y no quise repetir el experimento sin medirlo. Es la primera optimización a probar en F11 si la medición real lo pide.
3. **Textos en inglés escritos por mí, para tu revisión** (tabla abajo). Los de español son los aprobados o los del boceto.
4. **Pie y franja de contacto sin rediseñar:** el pie conserva la línea «Data Analyst · SQL · Power BI · Excel · Python» y la franja de contacto es la anterior. Siguen siendo verdaderos, pero no reflejan el posicionamiento nuevo; quedan para F9.
5. **Reglas heredadas todavía presentes en otros archivos** (p. ej. `case-shell.css` o estilos de tarjetas que F5 reemplaza): se limpian en F11.
6. **No verificado:** iOS Safari real, lector de pantalla, y Lighthouse (no corrí la batería, según lo indicado: no apareció una regresión que lo justificara, el JS bajó y el CSS no creció).

## 7. Capturas (en `docs/design/superficie-de-decision/f4/`)

Comparaciones con los bocetos: `compare-hero-1440.png` (R1 frente a lo implementado), `compare-sections-1440.png` (perfil y proyecto principal) y `compare-hero-390.png` (R5, vista 1, frente a lo implementado).

Páginas completas: `home-1440.png`, `home-1280.png`, `home-1024.png` (ancho intermedio), `home-820.png`, `home-600.png`, `home-390.png`, `home-360.png`; en inglés: `home-1440-en.png` y `home-390-en.png`.

## 8. Verificación de la excepción de fuentes (2026-11-03)

Detalle y cifras en `evidence-log.md` («Excepción de fuentes críticas»). Medición en Edge móvil con red Slow 4G, CPU 4× más lenta y caché vacía; tres cargas en frío intercaladas, frente a `main`. Datos y scripts en `f4/fonts-exception/`.

- **LCP:** 1.601 ms de media en la línea base y 1.705 ms en F4 (+104 ms, ≈ 6 %); el elemento LCP pasa a ser la imagen de la superficie.
- **CLS:** 0,0029 (línea base 0,0001), por dos desplazamientos de texto al cambiar de fuente.
- **Solicitudes de fuentes:** cinco, propias, 209.527 B en la red, de 1,15 a 2,45 s; en la línea base, cuatro a la CDN de Google (193.175 B).
- **Bytes frente a bloqueo:** solo el CSS (11,8 KB) bloquea el renderizado; las fuentes no. El primer pintado depende de documento + CSS + JS (~110 KB), igual que en la línea base; las fuentes (209 KB de 347 KB) llegan después.
- **Cambio visual por `swap`:** el titular pasa de un respaldo más pesado a Fraunces 300, más fino, a ~2,4 s; la composición no se mueve (`f4/fonts-exception/swap-frames.png`).
- **Resultado:** sin regresión importante; excepción cerrada provisionalmente. No se retrasaron fuentes ni se cambió código.

## 9. Git

- Rama `design/superficie-de-decision` (desde `main` @ `868c767`), solo local; sin push, sin PR, sin despliegue, `main` intacta, `publication` y rutas sin cambios.
- Commits de F4: `651f527a02d4f0ca70eba6d02ba9632d254cee06`, `8005b6505eeb54318113ce8889ff24a641db3e35` y el de este informe.
- No se avanza a F5.

## Textos nuevos para revisión ES / EN

| Clave | Español | English |
| --- | --- | --- |
| Eyebrow | Data Science · Machine Learning · IA aplicada | Data Science · Machine Learning · Applied AI |
| Titular | Datos, evidencia y *decisiones*. | Data, evidence and *decisions*. |
| Subtítulo | Uso datos para entender, predecir y decidir, y explico cuánta evidencia respalda cada conclusión. | I use data to understand, predict and decide, and I explain how much evidence supports each conclusion. |
| Acciones | Ver proyectos · Sobre mí | View projects · About me |
| Pie de figura 1 | FIG. 1 — Superficie de respuesta estimada · figura conceptual, datos simulados | FIG. 1 — Estimated response surface · conceptual figure, simulated data |
| Etiquetas | Observaciones / Datos simulados · Superficie estimada / Respuesta del modelo · Incertidumbre / Mayor donde hay menos datos · Umbral de decisión / Región que justifica actuar | Observations / Simulated data · Estimated surface / Model response · Uncertainty / Greater where there is less data · Decision threshold / Region that justifies acting |
| Pasos | Explorar: Estructura, calidad y patrones en los datos. · Modelar: Hipótesis y modelos que se pueden contrastar. · Evaluar: Incertidumbre y validez antes que el resultado. · Decidir: Conclusiones que sostienen una decisión. | Explore: Structure, quality and patterns in the data. · Model: Hypotheses and models that can be tested. · Evaluate: Uncertainty and validity before the result. · Decide: Conclusions that support a decision. |
| Perfil — titular | Llego a la ciencia de datos desde una base de análisis de datos aplicada. | I come to data science from a foundation in applied data analysis. |
| Perfil — Base | Data Analyst con dedicación parcial en una red de consultorios médicos: análisis, calidad de datos y reporting para decisiones operativas. | Part-time Data Analyst at a network of medical practices: analysis, data quality and reporting for operational decisions. |
| Perfil — Formación | Tecnicatura en Ciencia de Datos (en curso) y formación continua en DataCamp. | Higher technical degree in Data Science (in progress) and continuing education on DataCamp. |
| Perfil — Dirección | Modelado predictivo, inferencia causal, experimentación y machine learning aplicado. | Predictive modeling, causal inference, experimentation and applied machine learning. |
| PROVIDENTIA | ¿Qué va a pasar? Forecasting y modelado predictivo sobre series temporales, con la incertidumbre del pronóstico a la vista. · Series temporales, Pronóstico · Datos públicos (StatsWales) | What will happen? Forecasting and predictive modeling of time series, with the forecast uncertainty in plain view. · Time series, Forecast · Data: public (StatsWales) |
| PARADIGM | ¿Qué muestran los datos? Análisis de datos, BI e inteligencia operativa: la base profesional de la que parte la transición. · Base profesional · Datos sintéticos en el caso público | What do the data show? Data analysis, BI and operational intelligence: the professional base the transition starts from. · Professional base · Data: synthetic in the public case |
| SOMA | Plataforma de gestión clínica y operativa · Uso profesional · demostración pública solo con datos ficticios | Clinical and operational management platform · Professional use · public demonstration with fictitious data only |
