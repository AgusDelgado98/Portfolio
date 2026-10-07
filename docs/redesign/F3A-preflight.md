# F3A — Preflight de diseño de la nueva Home (aprobado)

| | |
|---|---|
| **Estado** | Aprobado con ajustes. Reemplaza las alternativas que quedaron descartadas. |
| **Rama** | `redesign` (sobre F2, `853ca77`) |
| **Alcance de F3** | Sistema visual base, nueva Home, visuales de PROVIDENTIA / Caelum / ALETHEIA, datos y tests, copy ES/EN de Home, `hidden: false` de ALETHEIA. |
| **Fuera de F3** | F4 Projects / Project Detail · F5 About · F6 Casework lazy · F7 limpieza de Atlas. |

Lenguaje conceptual congelado: **DATA → EVIDENCE → PREDICTION → DECISION**. `Analytics → Data Science → ML → AI` queda solo como taxonomía de Projects, nunca como narrativa principal.

---

## 1. Hero — copy congelado

| | ES | EN |
|---|---|---|
| Kicker | Agustín Delgado | Agustín Delgado |
| H1 | **Data Analyst** | **Data Analyst** |
| Subtítulo | Uso datos para entender problemas, construir modelos y mejorar decisiones. | I use data to understand problems, build models, and make better decisions. |
| Descripción | SQL, Python y Power BI aplicados a forecasting, analytics engineering y machine learning, con resultados verificables. | SQL, Python and Power BI applied to forecasting, analytics engineering, and machine learning, with verifiable results. |
| CTA primario | Ver proyectos → `#projects` | View projects → `#projects` |
| CTA secundario | Contacto → `#contact` | Contact → `#contact` |
| Links secundarios (desktop) | CV · GitHub · LinkedIn | CV · GitHub · LinkedIn |

**Prohibido en el Hero** (y verificado por test): Junior, Trainee, Entry-Level, Internship, aspiring, "Applied AI" como claim, "primera incorporación formal".

**Seniority / primera incorporación.** La frase "Busco mi primera incorporación formal en un equipo de datos" **se elimina por completo de la Home** y no se reemplaza por otra equivalente. El nivel de las oportunidades buscadas pertenece al CV, a About/Contact cuando corresponda y al proceso de postulación.

## 2. Composición del Hero

- **Desktop (1280):** contenedor de 1200 px, grilla 5/7 (texto ≈ 480 px / visual ≈ 640×400, `aspect-ratio 16/10`). Sin `100vh`; altura natural ≈ 540–580 px. El título y el borde superior de Featured asoman sobre el fold de 720.
- **Jerarquía:** kicker (mono) → H1 (Newsreader, ≈ 72 px) → subtítulo (≈ 22 px) → descripción (muted) → CTAs → links secundarios.
- **768:** una columna; el visual a ancho completo con `aspect-ratio 2/1`. Dos columnas desde 900 px.
- **360:** una columna: kicker, H1, subtítulo, descripción, CTAs, visual, chips de etapa. Desaparecen los links secundarios (CV está en el menú; GitHub/LinkedIn viven en el ContactStrip). **Criterio de aceptación:** a 360×740 se ve el comienzo de Featured Projects.

## 3. Arte central del Hero

Un único SVG `viewBox 640×400`, `aria-hidden`, **sin texto interno en mobile**, con equivalente textual visible (los cuatro chips de etapa y un caption).

| Zona | Representa | Color |
|---|---|---|
| DATA | observaciones crudas (puntos; algunos atenuados) | acero |
| EVIDENCE | no todo dato entra: se agrupa en fuentes validadas y se descarta lo no comparable | verdigris |
| PREDICTION | serie histórica, pronóstico y 3 bandas anidadas PI80 / PI90 / PI95 | latón |
| DECISION | la incertidumbre se traduce en una política: 3 umbrales, PI90 resaltado | terracota |

- **Conceptual, y declarado así.** El ancho relativo de las bandas usa las proporciones verificables de PROVIDENTIA (`mean_width` del lockbox final, 200,69 / 269,87 / 336,74). La forma de la serie es ilustrativa. Caption: *"Ilustración conceptual; bandas proporcionales a PROVIDENTIA (PI80/90/95, lockbox final)."*
- **Estático:** todo el arte. **Un único loop ambiente:** un pulso (`stroke-dashoffset` sobre un solo `<path>`, ≈ 12 s) que recorre la espina DATA → DECISION; se pausa fuera de pantalla.
- **Interacción:** foco/click/hover en un chip de etapa resalta su zona y atenúa las otras. Nada depende de hover: el estado por defecto muestra todo encendido.
- **`prefers-reduced-motion`:** sin pulso y sin transiciones.
- **Sin** planeta, globo, cerebro, robot, partículas, red neuronal genérica, gradientes futuristas, blobs, filtros SVG, Canvas, WebGL ni Three.js.

## 4. Featured Projects

Orden: **PROVIDENTIA · Caelum · ALETHEIA** (`getHomeFeaturedIds()`). Con DECERNO listo: PROVIDENTIA · DECERNO · Caelum. Una card = visual 16:9, categoría, título, una línea, una métrica, stack (≤ 4) y un solo CTA. No es una mini Project Detail.

### PROVIDENTIA
- Categoría: Data Science / ML.
- ES: *Forecasting de primeras consultas ambulatorias, con incertidumbre calibrada y política de capacidad fijada de antemano.*
- Métrica: **WAPE 9,2 %** (ETS, modelo primario, lockbox final) frente a naïve 10,7 %. Fuente: `forecasting_metrics.csv`.
- Stack: Python · pandas · statsmodels · LightGBM.
- **Visual — datos reales:** el trade-off de `policy_tradeoff.csv` (ETS, FINAL_LOCKED_EVALUATION):

  | Política | Buffer medio | Excedencia |
  |---|---|---|
  | PI80 | 100 | 10,9 % |
  | **PI90 (política/referencia congelada)** | 135 | 6,1 % |
  | PI95 | 168 | 3,6 % |

  Caption: ES `Datos: policy_tradeoff.csv · lockbox final` / EN `Data: policy_tradeoff.csv · final lockbox`. **No se dibuja una serie temporal**: el repo no la contiene (solo un PNG).

### Caelum
- Categoría: Analytics & BI.
- ES: *Plataforma analítica gobernada: contratos de datos, dbt y DuckDB, de un paquete validado a marts listos para Power BI.*
- Métrica: **103 tests dbt** · contrato fail-closed.
- Stack: dbt Core · DuckDB · Airflow · Power BI.
- **Visual — arquitectónico/conceptual:** 8 staging → 5 dimensiones → 3 hechos → 2 marts → Power BI. Los conteos son reales; **no es una medición temporal ni un resultado empírico** y el caption lo dice.

### ALETHEIA (visible desde F3: `hidden: false`)
- Categoría: Evidence / Research. Tags: Evidence · Research · Data Analysis. No se presenta como IA.
- ES: *Qué datos públicos argentinos pueden compararse de verdad: fuentes, cambios metodológicos y límites de la evidencia.*
- EN: *Which Argentine public datasets can truly be compared: sources, methodological breaks, and the limits of the evidence.*
- Métrica: **22 fuentes → 16 objetos estadísticos → 8 quiebres documentados.**
- Sin stack ni GitHub inventados (se muestran los tags).
- CTA: **Explorar investigación** / **Explore research** → `#projects/aletheia`.
- **Gate antes de cerrar F3:** verificar que ALETHEIA visible no rompe ningún shim/territory de la UI Atlas interina de Projects.

Fuente única: `src/visual/data/*.js` (con la fuente indicada en un comentario y tests que cruzan con el CSV / `casework/aletheia/data.js` / el copy aprobado).

## 5. PipelineSection

Pieza compacta, no cuatro cards: una barra de 4 pestañas (`tablist`, flechas ← →) y **un único panel** con mini-visual, una línea, proyecto ancla, referencias y un dato. Estado de selección **local**: sin hash ni routing por etapa, sin auto-avance, sin loop. Evidencia de capacidades, no *career timeline*.

| Etapa | Ancla | Secundarios |
|---|---|---|
| DATA | Caelum | ClarusFlow |
| EVIDENCE | ALETHEIA | Tekmérion |
| PREDICTION | PROVIDENTIA | Paradigm · LumenVox |
| DECISION | PROVIDENTIA | — |

Derivado de `PIPELINE_ANCHORS` y `stages` del registry. DECERNO podrá ser el ancla de DECISION cambiando solo esos datos. Mobile: control segmentado de 4 + panel apilado.

## 6. AboutBrief

| | ES | EN |
|---|---|---|
| Título | Sobre mí | About |
| P1 | Vengo de la administración y las operaciones de salud, donde aprendí que los datos importan cuando cambian una decisión. Hoy trabajo con SQL, Python y Power BI en análisis, dashboards y automatización. | I come from administration and healthcare operations, where I learned that data matters when it changes a decision. Today I work with SQL, Python, and Power BI across analysis, dashboards, and automation. |
| P2 | Estoy profundizando en modelado, forecasting, validación y machine learning mediante proyectos auditables, con datos públicos, tests y límites explícitos. | I'm deepening my work in modeling, forecasting, validation, and machine learning through auditable projects with public data, tests, and explicit limits. |
| CTA | Conocer mi trayectoria → `#about` | Explore my background → `#about` |

## 7. ContactStrip

Mínimo. ES: *Buenos Aires · Remoto* — *Disponibilidad estimada: ~2 semanas*. EN: *Buenos Aires · Remote* — *Estimated availability: ~2 weeks*. Acciones: Contacto · Descargar CV · GitHub · LinkedIn (EN: Contact · Download CV · GitHub · LinkedIn). **Sin ningún párrafo de búsqueda laboral.**

## 8. Orden de Home

Hero → Featured Projects → Pipeline → AboutBrief → ContactStrip → Footer.

## 9. Sistema visual y tema

- **Tema:** la Home es oscura mediante `data-surface="dark"` en `<html>` y tokens `--ds-*`. El resto de las vistas conserva temporalmente Atlas claro. **Este salto claro/oscuro es aceptable como estado interno de `redesign`, pero F3 por sí sola no es candidata a producción.** F4/F5 reducen la costura; F7 elimina el tema claro. No se convierten otras vistas antes de tiempo.
- **Dirección:** fondo oscuro, tinta plana, sin blobs/planeta/gradientes decorativos, máximo un loop, colores diferenciados por etapa, SVG significativo.
- **Paleta base** (sujeta a los tests de contraste en implementación):

  | Token | Valor |
  |---|---|
  | bg-0 / bg-1 / bg-2 | `#070B10` / `#0C1219` / `#121A24` |
  | texto / secundario / terciario | `#E6EDF5` / `#A9B7C6` / `#8393A7` |
  | DATA / EVIDENCE / PREDICTION / DECISION | `#7DA7D9` / `#5BBFA7` / `#D9B35F` / `#E4805E` |
  | foco | `#9CC2F0` |

  Texto ≥ 4,5:1 y gráficos ≥ 3:1. Los bordes decorativos son hairlines; los de elementos interactivos usan una variante ≥ 3:1.
- **Forma:** radius 4 / 8 / 12; sin sombras en cards; resplandor solo en el pulso y el nodo de decisión; espaciado en escala de 4 px; contenido 1200, shell 1320.
- **Tipografías existentes** (sin fuentes nuevas): Newsreader, IBM Plex Sans, IBM Plex Mono.

## 10. Qué sobrevive y qué desaparece de Home

- **Sobrevive:** tipografías, header `shell`, ley de foco/scroll de App, skip link, `safe-text-render`, ritmo de 8 px, ancho de 1320.
- **Desaparece:** `hero-atlas-*`, `hero-territories`, panel Atlas, coordenadas, plate meta, numeración decorativa, leyenda, teaser de Casework, "Core Toolkit" como sección, botones con sombra desplazada, territory/index de las cards y toda referencia a la Guided Experience.
- `atlas.css` no se limpia en F3 (F7).

## 11. Gates de performance de F3

- SVG del Hero ≤ 90 elementos y ≤ 6 KB de markup aproximado; **un único loop continuo**.
- 0 imágenes nuevas, 0 fuentes nuevas, 0 dependencias nuevas.
- Objetivo original de JS gzip final: ≤ **159.000 B** (gzip -9). CSS gzip ≤ **33,7 KB**.
- CLS de Home ≤ **0,02**; Lighthouse mobile Performance ≥ **91**; Accessibility ≥ **95**.
- El gate global de F6 **sigue vigente y no se modifica**: JS inicial de la Home ≤ **110 KB gzip -9**.

### Excepción aprobada — gate JS de F3

Medido al cerrar F3: **161.684 B** (gzip -9). Se aprueba explícitamente esa desviación frente al objetivo de 159.000 B (~+2,7 KB).

Motivo: recuperar esos ~2,7 KB implicaría adelantar F6/F7, y la performance real de la Home ya cubre el resto de los gates de esta fase. Lighthouse mobile Home, ya medido: Performance **97** (mediana), Accessibility **100**, CLS **0,0175**, TBT **10 ms**. CSS gzip medido: **33.677 B**, dentro del tope.

Esta excepción es solo del objetivo de F3. No altera, relaja ni reemplaza el gate de F6 (≤ 110 KB gzip -9).

## 12. Responsive

| | 360 | 768 | 1280 |
|---|---|---|---|
| Hero | 1 col; visual sin texto; chips 2×2 | 1 col; visual 2:1 | 5/7 col |
| Featured | 1 col | PROVIDENTIA en 2 col, resto en 1 | 3 columnas |
| Pipeline | segmentado de 4 + panel apilado | idem, panel en 2 col | pestañas + panel horizontal |

Todo lo interactivo es `<a>` o `<button>` con foco visible; nada depende exclusivamente de hover.

## 13. Componentes y archivos de F3

- **Estilos:** `src/styles/{tokens,base,home}.css` (prefijo `ds-`); se elimina `src/home.css`.
- **Visual:** `src/visual/` (primitivas usadas, `HeroFlowVisual`, `ForecastVisual`, `LayersVisual`, `EvidenceGraphVisual`, `StageGlyph`, `data/*.js`).
- **Home:** `src/components/home/{HomeHero,FeaturedProjects,PipelineSection,AboutBrief,ContactStrip}.jsx`; `Home.jsx` solo compone.
- **Soporte:** `useInView`, `src/i18n/messages/home.js`.
- **Edita:** `App.jsx` (`data-surface`), `index.html` (superficie inicial), `projects/registry.js` (ALETHEIA visible, `homeStack`), `ui.js` (claves de Home retiradas), `shell.css` y footer para la superficie oscura, tests.

## 14. Desvíos respecto del PLAN FROZEN v1.1 (registrados)

1. El tema oscuro "a reutilizar" no estaba vigente (Atlas lo sobrescribe): se crean tokens `--ds-*` y se aíslan con `data-surface`.
2. ALETHEIA pasa a visible en F3 (el PLAN decía F4).
3. El visual de PROVIDENTIA es el trade-off real (la serie no existe en el repo).
4. Solo se construyen las primitivas visuales que F3 usa.
5. Los estilos nuevos van en `src/styles/{tokens,base,home}.css`; `layout.css` y `components.css` se difieren.

---

## 15. Desvíos de implementación aprobados al cerrar F3

Quedan aprobados. Los de presentación son el Hero 16:9, el caption acortado en ≤ 719 px, `.brand-role` oculto en ≤ 480 px y las fuentes no bloqueantes (ítems 2–4). La excepción de JS está en la sección 11 y en el ítem 8. Ninguno adelanta F4. El copy desactualizado de Projects no se corrige en F3: queda para F4.

1. **Pipeline:** el panel reutiliza el dibujo del Hero con la etapa seleccionada resaltada (`FlowSvg`), en lugar de cuatro mini-diagramas propios. Menos código y una sola familia visual. No se creó `StageGlyph`.
2. **Hero:** `viewBox 0 20 640 360` (16:9) en lugar de 640×400, para que Featured asome antes. En ≤ 719 px el caption se reduce a "Ilustración conceptual." y el detalle (proporciones de las bandas) aparece desde 720 px.
3. **Header en ≤ 480 px:** se oculta la línea de keywords bajo el nombre (`.brand-role`); envolvía a tres líneas y empujaba el contenido.
4. **Fuentes no bloqueantes** (`index.html`): las mismas familias y pesos de Google Fonts, cargadas con `preload` + `media="print" onload`, con `<noscript>` de respaldo. Cierra el hallazgo "render-blocking fonts" del baseline y es lo que permite cumplir el gate de Performance; no agrega fuentes.
5. **Claves i18n retiradas** de `ui.js`: el bloque `home` completo y el namespace `hero` (ambos sin uso tras reemplazar la Home). Los nombres de etapa (DATA, EVIDENCE, PREDICTION, DECISION) son una constante, no copy.
6. **Registry:** `homeStack` (opcional, ≤ 4 ítems) en PROVIDENTIA y Caelum; ALETHEIA sigue sin stack ni GitHub y la card muestra sus tags.
7. **ALETHEIA sin territorio:** sigue fuera de `TERRITORIES`; la vista Atlas interina simplemente no la dibuja y la vista Cards sí. F4 retira los territorios.
8. **Gate de JS gzip de F3 — excepción aprobada:** objetivo original ≤ 159.000 B; medido **161.684 B** (gzip -9). Ver la sección 11. El gate de F6 (JS inicial Home ≤ 110 KB gzip -9) no se toca.
