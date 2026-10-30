# PLAN FROZEN — Rediseño del portfolio

| | |
|---|---|
| **Estado** | CONGELADO — versión 1.1, con la enmienda 1.2 (2026-10-30) |
| **Aprobado** | 2026-10-07 |
| **Alcance** | Rediseño de arquitectura, navegación y sistema visual. No reescribe los casos de Casework. |
| **Implementación** | No iniciada. F0 arranca solo con instrucción explícita. |

Cualquier cambio a este documento después de congelado requiere aprobación explícita y se registra en la sección 16.

**Cambios de v1.0 a v1.1** (las dos modificaciones pedidas al aprobar):

1. **Aliases legacy:** siguen funcionando, pero la URL se normaliza silenciosamente a la ruta canónica con `history.replaceState` (sin nueva entrada de historial). Ver sección 5.
2. **ALETHEIA:** categoría interna honesta `evidence-research`, no `analytics-bi`. No genera filtro visible mientras tenga un solo proyecto. Ver sección 10.

**Enmienda 1.2 (2026-10-30, aprobada por el titular):** el portfolio separa los proyectos vinculados al trabajo de los personales.

1. **Clasificación:** el registry añade `group` (`work` | `personal`), `usage` (`professional` | null) y `dataProvenance` (`synthetic` | `public` | `fictitious` | null). PARADIGM, PROVIDENTIA y SOMA son `work`, en ese orden; el resto es `personal`.
2. **`status` deja de decir `production`:** el uso profesional es una clasificación (`usage`), no un estado técnico de despliegue. `status` solo admite `active`. Ningún texto público describe a SOMA como «Producción».
3. **Decisión 12 sustituida:** la Home muestra «Proyectos vinculados a mi trabajo» (PARADIGM · PROVIDENTIA · SOMA) y «Proyectos personales» (Caelum · ALETHEIA). La decisión 1 (Paradigm sale de la Home) queda revertida.
4. **DATA → EVIDENCE → PREDICTION → DECISION** se explica dentro del Hero interactivo; la sección «De los datos a la decisión» y su dibujo repetido desaparecen.
5. **Las métricas de los casos públicos** (datos sintéticos, públicos o ficticios) se rotulan como tales y no se atribuyen al lugar de trabajo.

---

## 1. Objetivo y principios

Simplificar la experiencia, hacerla más visual e interactiva, y entendible en pocos segundos, manteniendo identidad propia.

- **Identidad profesional:** Data Analyst. La transición hacia Data Science / ML se demuestra con proyectos y evidencia, nunca con sobrepromesa en el título.
- **Lenguaje conceptual principal:** `DATA → EVIDENCE → PREDICTION → DECISION`. Las categorías del catálogo son una taxonomía aparte.
- **Visuales:** SVG y CSS, derivados de datos o evidencia real del proyecto siempre que sea razonable. Los ilustrativos se identifican explícitamente. Sin Canvas, WebGL ni dependencias nuevas.
- **Casos de Casework:** se conservan sus componentes y evidence packs. Solo cambian rutas y links de navegación.
- **Mobile-first** en todo el CSS nuevo.

## 2. Baseline (medido antes de F0)

| Métrica | Valor |
|---|---|
| JS | 573 KB raw, 155 KB gzip (un solo bundle, sin code-splitting) |
| CSS | 184 KB raw, 33 KB gzip (`atlas.css` 4.895 líneas, `styles.css` 3.245) |
| Tests | 80 en verde; `npm test` falla por el script (Node 22 no acepta directorios) |
| Componentes sin imports | `Hero.jsx`, `Contact.jsx`, `Stack.jsx`, `AtlasProgress.jsx` |
| Router | Hash propio (`resolveAppRoute`), inyección `hasCaseworkCase` |
| Metadatos | Sin `og:image` ni metadatos por página |

Los números de Lighthouse se registran en F0 (`docs/redesign/baseline.md`) y fijan los pisos de F6 y F7.

## 3. Arquitectura definitiva

```
Home → Projects → Project Detail → Case Study (dentro del proyecto)
       About
       Contact
```

Header en desktop: `Projects · About · Contact · CV · ES/EN`. El logo "AD" lleva a Home.

Vistas del router: `home`, `projects`, `project-detail`, `project-case`, `about`, `contact`, `unknown` (renderiza Home, como hoy). Desaparecen como vistas: `data-bi`, `operations`, `casework-index`, `casework-detail`. Esas URLs viven solo como aliases (sección 5).

## 4. Rutas canónicas

| Canónica | Vista |
|---|---|
| `#home` | Home |
| `#projects` | Índice con filtros (estado local, sin URL en esta versión) |
| `#projects/<id>` | Detalle de proyecto |
| `#projects/<id>/<case>` | Case study; `#projects/aletheia/evidence-case/research` para la investigación completa |
| `#about` | About |
| `#about/<section>` | About con scroll a la sección. `section` ∈ `skills`, `experience`, `education`, `method`. No es otra vista |
| `#contact` | Contact |

**Slugs de casos (congelados):**

| Proyecto | Casos |
|---|---|
| `paradigm` | `no-show`, `operational-risk` |
| `providentia` | `demand-forecasting`, `capacity-decision`, `policy-decision` |
| `aletheia` | `evidence-case` (con sección `research`) |

**Reglas de fallback:**

- Slug o id desconocido: Home (`unknown`), como hoy.
- Proyecto válido con caso inválido: detalle de ese proyecto.
- Proyecto con `hidden: true`: tratado como inexistente.
- Sección de About desconocida: `#about` sin scroll.

**Cambio de diseño:** los datos de casos viven en `projects/caseStudies.js` (datos planos, sin JSX). El resolver los importa directamente y deja de necesitar la inyección `hasCaseworkCase`. El mapa de componentes lazy vive aparte (`casework/components.js`).

## 5. Aliases legacy y normalización de URL

### 5.1 Tabla de aliases

Todos siguen funcionando indefinidamente.

| Alias | Canónica final |
|---|---|
| `#portada` | `#home` |
| `#proyectos` | `#projects` |
| `#casework` | `#projects` |
| `#casework/no-show` | `#projects/paradigm/no-show` |
| `#engineering-log` y `#engineering-log/*` | `#projects/paradigm/no-show` |
| `#casework/operational-risk` | `#projects/paradigm/operational-risk` |
| `#casework/demand-forecasting` | `#projects/providentia/demand-forecasting` |
| `#casework/capacity-decision` | `#projects/providentia/capacity-decision` |
| `#casework/policy-decision` | `#projects/providentia/policy-decision` |
| `#casework/aletheia` | `#projects/aletheia/evidence-case` |
| `#casework/aletheia/research` | `#projects/aletheia/evidence-case/research` |
| `#data-bi`, `#stack` | `#about/skills` |
| `#operations` | `#about/experience` |
| `#enfoque` | `#about/method` |
| `#formacion` | `#about/education` |
| `#contacto` | `#contact` |

### 5.2 Normalización silenciosa (decisión v1.1)

Cuando la URL de entrada es un alias:

1. El resolver devuelve la vista correcta, `canonicalHash` y `legacyHash`.
2. Se llama `history.replaceState(history.state, '', pathname + search + canonicalHash)`.
3. La URL final es la canónica. **No se agrega entrada al historial.**
4. `replaceState` no dispara `hashchange`, así que App establece la ruta resuelta directamente.

Ejemplo: `#casework/no-show` resuelve correctamente y la URL final es `#projects/paradigm/no-show`.

**Aplica al cargar la página y también ante un `hashchange` posterior** (por ejemplo, un link legacy pegado o clickeado en la misma pestaña).

**Qué NO se normaliza:**

- La URL raíz vacía y `#` (la raíz limpia no se reescribe).
- Hashes ya canónicos.
- Hashes desconocidos (caen en Home como fallback; no son aliases).
- `#main-content` (skip-link, no es una ruta).

**Implementación:** función pura `getNormalizedHash(route, currentHash)` en `router/normalizeHash.js` (retorna la canónica o `null`), testeable sin DOM. App solo aplica el resultado.

**Propagación:** la aplicación nunca genera links legacy. Un test verifica que ningún archivo bajo `src/` contenga literales de hashes legacy fuera de `router/` y de los tests.

**Documentación a actualizar en F2:** los comentarios de `resolveAppRoute.js`, `legacyHashRoadmap.js`, `App.jsx` y los tests actuales afirman que los aliases "nunca se reescriben". Ese contrato queda reemplazado por esta sección.

## 6. Se conservan

- **Infraestructura:** `i18n/` (contexto, config, tests de paridad), skip-link y manejo de foco de `App.jsx`, reveal con `IntersectionObserver`, `Footer`.
- **Datos y copy:** `projects/registry.js` (evoluciona), `i18n/messages/projects.js`, `projects/mergeProjectCopy.js`.
- **Router:** `resolveAppRoute`, `legacyHashRoadmap` y `documentTitle`, con sus tests extendidos.
- **Casework:** los 6 componentes (`EngineeringLog`, `OperationalRisk`, `DemandForecasting`, `CapacityDecision`, `PolicyDecision`, `Aletheia`), sus `data.js`, CSS e i18n, y todo `public/casework`, `public/engineering-log`, `public/media`. Solo se editan sus links de navegación (sección 14, F2).
- **Reutilizados:** `ProjectEvidenceGallery`, `SomaDemoVideo`, `ContactChannels`, `AboutProfile`, `LearningRecord`, `Approach`, `StackGroups` (los cuatro últimos pasan a About).

## 7. Desaparecen

| Qué | Fase |
|---|---|
| `Hero.jsx`, `Contact.jsx`, `Stack.jsx`, `AtlasProgress.jsx` | F0 |
| `guide/**`, `GuideInvitation.jsx`, `i18n/messages/guide.js` y su test | F2 |
| `Header.jsx` (reemplazado por `layout/SiteHeader.jsx`) | F2 |
| `home.css`, panel Atlas, coordenadas | F3 |
| `ProjectsCards.jsx`, `ProjectsAtlas.jsx`, `projects-view.css`, `TERRITORIES`, `NODE_PROFILES` | F4 |
| `DataBI.jsx`, `Operations.jsx` | F5 |
| `CaseworkIndex.jsx`, `casework-index.css` | F6 |
| `atlas.css`, claves i18n de Atlas / Territories / Guide / Operations / DataBI | F7 |

## 8. Componentes nuevos

- **`src/components/layout/`:** `SiteHeader`, `MobileNav`, `PageHeader`, `Section`, `Breadcrumb`, `LinkButton`, `Chip`, `StatusBadge`.
- **`src/components/home/`:** `HomeHero`, `FeaturedProjects`, `PipelineSection`, `AboutBrief`, `ContactStrip`.
- **`src/components/projects/`:** `FilterBar`, `ProjectGrid`, `ProjectCard` (reescrita), `ProjectCardCompact`, `ProjectHero`, `DetailSection`, `SectionNav`, `TechnicalDetails`, `CaseStudyList`, `CaseShell` (breadcrumb y volver), `ProjectCaseView`.
- **`src/visual/`:**
  - Primitivas: `VisualCanvas`, `Node`, `Edge`, `Series`, `Band`, `Bars`, `Axis`, `Glow`.
  - Hooks: `useInView`, `useReducedMotion`.
  - Visuales: `ForecastVisual`, `EvidenceGraphVisual`, `RiskThresholdVisual`, `LayersVisual`, `RulesVsMlVisual`, `ProceduralVisual`. `UpliftVisual` se construye cuando DECERNO esté listo.
  - Datos: `src/visual/data/*.js`, snapshots chicos con la fuente indicada en un comentario.
- **`src/styles/`:** `tokens.css`, `base.css`, `layout.css`, `components.css` (prefijo de clases `ds-`).
- **Router y casos:** `router/normalizeHash.js`, `projects/categories.js`, `projects/caseStudies.js`, `casework/components.js`.

## 9. Estructura final del registry

```js
{
  id, title,
  categories: ['ds-ml', 'analytics-bi'], // [0] = primaria; el filtro cuenta todas
  tags: ['Evidence', 'Research'],        // etiquetas visibles; no filtran
  tier: 'flagship' | 'featured' | 'standard' | 'compact',
  status: 'active',                      // enmienda 1.2: solo `active`; el uso profesional va en `usage`
  group: 'work' | 'personal',            // enmienda 1.2
  usage: 'professional' | null,          // enmienda 1.2: uso declarado, nunca un estado de despliegue
  dataProvenance: 'synthetic' | 'public' | 'fictitious' | null, // de la demostración pública
  hidden: false,                         // DECERNO nace con hidden: true
  stages: ['prediction', 'decision'],    // pasos de DATA→DECISION que demuestra
  visual: 'forecast',                    // clave del visual, o 'procedural'
  accent,                                // token, no hex
  stack, githubUrl, projectUrl, privateRepo, hasLiveDemo, hasDemoVideo,
  resultsSectionKey, evidenceVisuals,
  caseStudies: [{ slug, number, legacySlug, i18nKey }],
}
```

**Constantes auxiliares:**

- `HOME_FEATURED_IDS`: array ordenado y separado, filtrado por `hasProject` y `!hidden`.
- `PIPELINE_ANCHORS`: ancla explícita por etapa. Hoy: `data → caelum`, `evidence → aletheia`, `prediction → providentia`, `decision → providentia`. Con DECERNO, `decision → decerno`. Los proyectos adicionales de una etapa se derivan de `stages` como enlaces secundarios (Paradigm en `prediction`).
- `CATEGORIES` y `MIN_PROJECTS_FOR_FILTER = 2` en `projects/categories.js`.

**Regla de visibilidad de filtros (sin lógica especial por categoría):** un filtro se muestra solo si tiene `MIN_PROJECTS_FOR_FILTER` o más proyectos visibles (no `hidden`). "All" siempre se muestra. Esta única regla mantiene ocultos hoy `applied-ai` y `evidence-research`.

**DECERNO:** se suma como una entrada nueva, su copy ES/EN, su visual y cambiar `hidden`. No requiere cambios de código de UI. Hasta entonces no aparece en ningún listado, ruta, filtro, conteo, título ni pipeline.

## 10. Categorías

**Taxonomía** (clave interna → label cuando el filtro es visible):

| Clave | Label | Filtro hoy |
|---|---|---|
| `analytics-bi` | Analytics & BI | Visible |
| `ds-ml` | Data Science / ML | Visible |
| `products` | Products & Engineering | Visible (categoría real) |
| `applied-ai` | Applied AI | Oculto (1 proyecto: Tekmérion, secundaria) |
| `evidence-research` | Evidence & Research | Oculto (1 proyecto: ALETHEIA) |

`evidence-research` es una categoría interna honesta (decisión v1.1). Mientras tenga un solo proyecto no genera filtro: ALETHEIA aparece bajo `All`, en la Home y en la etapa Evidence del pipeline. Si otra investigación se suma, el mismo `MIN_PROJECTS_FOR_FILTER` activa el filtro sin tocar código.

**Asignación:**

| Proyecto | Categorías (primaria primero) | Tags visibles | Tier | Etapas | Visual |
|---|---|---|---|---|---|
| PROVIDENTIA | `ds-ml` | | flagship | prediction, decision | forecast + incertidumbre |
| Caelum | `analytics-bi` | | featured | data | capas de pipeline |
| ALETHEIA | `evidence-research` | Evidence · Research · Data Analysis | featured | evidence | fuentes → evidencia → conclusión |
| Paradigm | `ds-ml`, `analytics-bi` | | featured | prediction | riesgo / probabilidad / umbral |
| Soma | `products` | | featured | | procedural |
| Tekmérion | `analytics-bi`, `applied-ai` | | standard | evidence | reglas vs. ML |
| LumenVox | `ds-ml` | | standard | prediction | procedural |
| ClarusFlow | `analytics-bi` | | standard | data | procedural |
| Hogares | `products` | | compact | | procedural |
| Kairós | `products` | | compact | | procedural |
| DECERNO (futuro, `hidden: true`) | `ds-ml` | | featured | prediction, decision | uplift / efectos causales |

**Filtros visibles hoy:** All, Analytics & BI (4: Caelum, ClarusFlow, Tekmérion, Paradigm), DS / ML (3: PROVIDENTIA, Paradigm, LumenVox), Products & Engineering (3: Soma, Hogares, Kairós). Con DECERNO, DS / ML pasa a 4.

Soma conserva presencia fuerte (tier featured, con video; clasificada como `usage: 'professional'`, no como `production`). Hogares y Kairós usan cards compactas y no se mezclan con las otras categorías.

## 11. Home

**Secuencia:** hero visual → 3 proyectos destacados → pipeline interactivo `DATA → EVIDENCE → PREDICTION → DECISION` → About breve → contacto con disponibilidad (conserva "~2 semanas").

| | Destacados (orden) |
|---|---|
| **Hoy (antes de DECERNO)** | PROVIDENTIA · Caelum · ALETHEIA |
| **Con DECERNO** | PROVIDENTIA · DECERNO · Caelum |

Paradigm sale de la Home (decisión aprobada). Sigue en tier featured en Projects y aparece como enlace secundario en la etapa Prediction del pipeline. Cuando DECERNO entre, ALETHEIA sale de las tarjetas pero permanece como ancla de la etapa Evidence. DECERNO entra solo si alcanza el nivel de PROVIDENTIA.

Para no repetir las tarjetas, cada etapa del pipeline muestra un mini-visual y una línea de texto, no tarjetas.

**Requisito previo a F3:** el copy del hero (H1, subfrase, CTAs) se aprueba antes de construir. El H1 mantiene "Data Analyst"; un test lo verifica.

## 12. Sistema visual base

- **Paleta:** se reutilizan los tokens oscuros actuales (`--bg-0 #020608`, `--text #e8f4ff`). Cada etapa del pipeline tiene un color como rol (data, evidence, prediction, decision) y cada proyecto hereda el de su etapa dominante. Los valores finales se fijan en F3 con un script de contraste: texto ≥ 4,5:1, gráficos ≥ 3:1. El acento `#37677a` actual no se usa para texto.
- **Tipografía:** Newsreader (display), IBM Plex Sans, IBM Plex Mono. Sin cambios.
- **Primitivas:** SVG con `viewBox`. Glows con gradientes radiales estáticos; nunca `filter: blur` ni `drop-shadow` en muchos elementos.
- **Movimiento, tres niveles:**
  1. Estático. Es el único nivel con `prefers-reduced-motion`.
  2. Entrada de una sola vez (solo `opacity` y `transform`).
  3. Ambiente: como máximo un loop continuo en el hero, pausado fuera de viewport y con la pestaña oculta.
- **Presupuesto:** hero SVG ≲ 20 KB y ≤ 80 elementos animados.
- **Visuales ligados a datos:**

| Proyecto | Fuente de datos | Situación |
|---|---|---|
| ALETHEIA | `casework/aletheia/data.js` (estructurado) | Ligado a datos |
| Paradigm | Dataset (12.008 filas), `final_metrics.json`, `feature_importance.json` | Ligado a datos; se pre-agrega offline a un snapshot |
| PROVIDENTIA | `forecasting_metrics.csv`, `development_vs_final.csv`; la serie representativa es solo un PNG | Se decide en la auditoría de F3: métricas ligadas, curva ilustrativa si no hay serie |
| Caelum | Estructura de capas documentada | Ligado a la estructura real |
| Tekmérion | Resultado reglas vs. ML | Ligado al resultado publicado |

  Los snapshots son archivos chicos en `src/visual/data/`; no se parsean CSV en runtime. Todo visual no ligado a datos lleva el caption "ilustrativo".
- **Visuales procedurales:** una variante determinista por categoría, derivada del `id`, para los proyectos sin visual propio.

## 13. Estrategia responsive

- **Breakpoints:** 360, 640, 960 y 1200; CSS nuevo mobile-first; contenedor máximo ~1160 px.
- **Header:** en desktop, `Projects · About · Contact · CV · ES/EN`. En mobile, el valor por defecto es un menú con Projects, About, Contact, CV y ES/EN, y barra reducida a logo, idioma y botón Menú. La decisión final se toma midiendo en F2 a 320, 360, 390, 414, 600 y 720 px. Si el layout inline entra sin desbordar desde 480 px, se baja el breakpoint.
- **Home mobile:** hero simplificado (≈40% de los nodos, estático después del primer frame); pipeline como stepper vertical; tarjetas apiladas.
- **Filtros:** chips con wrap (sin scroll horizontal oculto), grupo con `aria-pressed`, cantidad de resultados anunciada en una región `aria-live`.
- **Detalle de proyecto:** `SectionNav` como fila de anclas; `scroll-margin-top` para que el header sticky no tape el foco; Technical Details en `<details>`.
- **Sin hover:** nada depende de hover. Todo lo interactivo es `<a>` o `<button>` con foco visible. El hero visual lleva `aria-hidden` y un equivalente textual.

## 14. Fases, archivos y criterios de aceptación

**Estrategia de ramas:** rama `redesign` sobre `main`, tag `pre-redesign` en `main` para rollback, un commit o PR por fase, cada fase desplegable por sí sola.

**Criterios comunes a todas las fases:** `npm test` y `npm run build` en verde; paridad ES/EN; sin errores de consola; revisión por teclado de lo tocado; capturas a 360 / 768 / 1280; ningún claim nuevo sin aprobación.

### F0 — Saneamiento

**Archivos:**

- `package.json`: script `node --test "src/**/*.test.js"`.
- Borrar `src/components/{Hero,Contact,Stack,AtlasProgress}.jsx`.
- `index.html`: `og:image`, `og:url`.
- Nuevo `public/og/og-default.png`.
- Nuevo `docs/redesign/baseline.md` (peso y Lighthouse mobile de Home, Projects y un caso).
- Decisión pendiente: mover `ESCANEO.md` e `ITERATION2_RESULT.md` (tracked, describen una arquitectura obsoleta) a `_archive`.

**Aceptación:**

- `npm test` ejecuta los 80+ tests.
- Sin cambio visual.
- Baseline registrado.

### F1 — Registry

**Archivos:**

- `projects/registry.js`: nueva forma, con shims temporales (`TERRITORIES`, `NODE_PROFILES`, `FEATURED_*`, `getCaseworkSlugsForProject`) hasta F4.
- Nuevos `projects/categories.js` y `projects/caseStudies.js`.
- `projects/mergeProjectCopy.js`.
- `i18n/messages/projects.js`: entrada de ALETHEIA ES/EN (copy derivado de `i18n/messages/aletheia.js`, sin claims nuevos) y labels de categorías.
- `constants/links.js`: hashes de casos al nuevo canónico más constantes `LEGACY_*`.
- `casework/registry.js`: agrega `projectId` y `slug`.
- `projects/registry.test.js`: reescritura.
- Nuevo `projects/caseStudies.test.js`.

**Notas:**

- ALETHEIA entra con `hidden: true` para no alterar la UI actual hasta F4.
- ALETHEIA aparece hoy rotulada "Data & BI" en `casework/aletheia/data.js` (`primaryArea`), en `public/casework/aletheia/evidence-pack/{README.md,portfolio_manifest.json}`, en `i18n/messages/casework.js` (tags) y en comentarios. `primaryArea` y el manifest espejan el repo de investigación y **no se editan**. La taxonomía del portfolio vive en el registry. Los tags de `casework.js` se ajustan en F6 cuando el índice desaparece.

**Aceptación:**

- Todo proyecto visible tiene categorías válidas.
- Cada `caseStudy` apunta a un componente real.
- Con los datos actuales, `applied-ai` y `evidence-research` no generan filtro por umbral.
- Un proyecto `hidden` no aparece en ningún listado.
- La app se ve igual que antes de la fase.

### F2 — Shell y router

**Archivos:**

- `App.jsx`: rutas lazy, scroll-top centralizado, normalización de URL (sección 5.2), sin Guide.
- `main.jsx`: sin `GuideProvider`.
- `router/resolveAppRoute.js`, `legacyHashRoadmap.js`, `documentTitle.js` y sus tests.
- Nuevo `router/normalizeHash.js` y su test.
- Nuevos `components/layout/SiteHeader.jsx` y `MobileNav.jsx`.
- `Footer.jsx`.
- Borrar `src/guide/**`, `GuideInvitation.jsx`, `i18n/messages/guide.js` y su test; ajustar `i18n/translations.js`.
- `Home.jsx`: versión interina sin Guide (orden default; el panel Atlas sigue hasta F3).
- `ProjectsIndex.jsx`: quitar el aside de Casework.
- `ProjectDetail.jsx`: links a casos con hash canónico.
- Los 6 componentes de caso: **solo links de navegación**. `#home`, `CASEWORK_HASH` y `#data-bi` pasan a `#projects/<id>`; se elimina `onExit`. Los self-links de etapa cambian de valor por constante, sin tocar JSX. En ALETHEIA, `backToDataBi` pasa a volver al proyecto (clave i18n y copy), y `listPublicActionHrefs` y su test (`aletheia.test.js`) se retargetean.

**Interinos hasta F5:** `DataBI` y `Operations` siguen renderizándose bajo sus aliases (que normalizan a su destino final solo cuando exista en F5). Header sin links a ellos.

**Aceptación:**

- La matriz completa de aliases (sección 5.1) pasa como test unitario, incluidos `canonicalHash` y `legacyHash`.
- En navegador: cada alias resuelve la vista correcta, la URL final es la canónica, `history.length` no cambia y Back vuelve a la página previa (no al alias).
- La URL raíz vacía no se reescribe.
- Ningún literal de hash legacy en `src/` fuera de `router/` y los tests.
- Back/Forward funcionan entre rutas canónicas.
- Header desktop cumple lo pedido; la decisión mobile queda medida y documentada en este plan (sección 16).

### F3 — Sistema visual y Home

**Archivos:**

- Nuevos `src/styles/*.css`, `src/visual/**`, `src/components/home/*`.
- `Home.jsx` reescrita.
- Borrar `home.css`.
- `i18n/messages/ui.js`: claves `home.*` nuevas.
- Test de copy del H1.

**Previo:** aprobación del copy del hero. Auditoría de datos por proyecto (visual ligado o ilustrativo).

**Aceptación:**

- Contraste verificado con script (≥ 4,5:1 texto, ≥ 3:1 gráficos).
- Un único loop ambiente; todo estático con `prefers-reduced-motion`.
- Test de los 5 segundos: quién sos, qué hacés y una prueba, visibles al cargar.
- Sin `filter: blur` en la Home.
- Performance dentro del presupuesto, medida contra el baseline.
- El hero visual es `aria-hidden` con equivalente textual.
- Cada visual no ligado a datos lleva el caption "ilustrativo".

### F4 — Projects y Project Detail

**Archivos:**

- `ProjectsIndex.jsx`, `ProjectCard.jsx`, `ProjectDetail.jsx` reescritos.
- Nuevos componentes de `components/projects/`.
- Borrar `ProjectsCards.jsx`, `ProjectsAtlas.jsx`, `projects-view.css`.
- `projects.js`: campos opcionales `data` y `decision`, solo donde ya existe contenido real.
- ALETHEIA pasa a `hidden: false`; se eliminan los shims.
- Tests de filtros y de visibilidad de secciones (funciones puras).

**Aceptación:**

- Los 10 proyectos visibles.
- Filtros visibles: All, Analytics & BI, DS / ML, Products & Engineering. `applied-ai` y `evidence-research` sin filtro.
- ALETHEIA aparece bajo `All` con sus tags.
- Soma con presencia fuerte; Hogares y Kairós compactos.
- El detalle muestra solo secciones con contenido, con nota "Alcance y límites".
- Technical Details es `<details>`.
- DECERNO no aparece en ninguna parte.

### F5 — About y Contact

**Archivos:**

- `About.jsx` reescrita: `skills`, `experience`, `education`, `method`.
- `ContactView.jsx` restilada.
- Borrar `DataBI.jsx` y `Operations.jsx`.
- Migrar `dataBi.*` y `operations.*` a `about.*`.
- `i18n/messages/ui.test.js` retargeteado, conservando los guards: disponibilidad "~2 semanas / ~2 weeks" (nunca "inmediata"), sin "colaboración remota" en el rol administrativo, sin claims `.pbix` ni `PDI-7`.
- Los aliases `#data-bi`, `#stack`, `#operations`, `#enfoque` y `#formacion` normalizan a su `#about/<section>`.

**Aceptación:**

- Cada alias abre la sección correcta de About con scroll.
- No se pierde contenido factual.
- Los guards de copy siguen pasando.

### F6 — Case studies y lazy loading

**Archivos:**

- Nuevos `casework/components.js` (lazy) y `CaseShell` con breadcrumb.
- `casework/registry.js` reducido.
- Borrar `CaseworkIndex.jsx`, `casework-index.css` y la parte del índice de `i18n/messages/casework.js`.
- `Suspense` con skeleton de alto fijo.
- Ajustar los tags de ALETHEIA en `casework.js` (ver nota de F1).

**Aceptación:**

- JS inicial por debajo del baseline (155 KB gzip); el objetivo numérico se fija tras medir el baseline de F0.
- Los 6 casos cargan por demanda.
- Sin CLS al cargar un chunk.
- Breadcrumb a su proyecto en cada caso.

### F7 — Limpieza, performance y accesibilidad

**Archivos:**

- Auditoría de clases usadas (script de scratch, no se commitea).
- Extraer a `case-shared.css` mínimo lo que los casos aún usen de `atlas.css` (`.atlas-access` y similares); luego borrar `atlas.css`.
- Limpiar claves i18n muertas con paridad verificada.
- Convertir los PNG de `public/media` a WebP con `width` y `height`.
- Revisar peso y `preload` del `.webm` de Soma.
- Actualizar `README.md`.

**Aceptación:**

- Lighthouse mobile igual o mejor que el baseline en Performance y Accessibility; el piso exacto se fija en F0.
- axe sin violaciones serias.
- Pasada completa de teclado y de `prefers-reduced-motion` en todas las rutas.
- Matriz de URLs legacy sin regresiones.
- CSS total por debajo del baseline.

## 15. Fuera de alcance

- Reescribir o rediseñar el contenido de los casos de Casework.
- Rutas por path o prerender (se mantiene el hash).
- Sincronizar el filtro de Projects con la URL.
- Publicar DECERNO (se agrega cuando se marque como listo).
- Nuevas dependencias de runtime.

## 16. Registro de decisiones

| # | Decisión | Estado |
|---|---|---|
| 1 | Paradigm sale de la Home | Aprobada · **revertida por la enmienda 1.2** |
| 2 | Aliases legacy conservados y normalizados con `history.replaceState` | Aprobada con modificación (v1.1) |
| 3 | ALETHEIA en categoría interna `evidence-research`, sin filtro mientras tenga un proyecto | Aprobada con modificación (v1.1) |
| 4 | Tekmérion: `analytics-bi` primaria, `applied-ai` secundaria | Aprobada |
| 5 | Subrutas `#about/<section>` | Aprobada |
| 6 | Filtro de Projects en estado local, sin URL | Aprobada |
| 7 | ALETHEIA `hidden` durante F1 | Aprobada |
| 8 | Header mobile decidido por medición real en F2 | Aprobada (resultado: pendiente de F2) |
| 9 | DECERNO completamente oculto hasta que se marque como listo | Aprobada |
| 10 | Lenguaje principal `DATA → EVIDENCE → PREDICTION → DECISION` | Aprobada |
| 11 | Products & Engineering como categoría real | Aprobada |
| 12 | ~~Home: PROVIDENTIA · Caelum · ALETHEIA~~ → **Enmienda 1.2:** Home en dos grupos: vinculados al trabajo (PARADIGM · PROVIDENTIA · SOMA) y personales (Caelum · ALETHEIA). DECERNO, si se habilita, entra solo como personal y con rótulo experimental | Aprobada (enmienda 1.2) |
| 13 | Visuales ligados a evidencia real; ilustrativos identificados | Aprobada |
| 14 | `React.lazy` para los casos; sistema visual SVG sin Canvas/WebGL ni dependencias | Aprobada |
| 15 | Mobile-first y fases F0–F7 con sus criterios | Aprobada |

**Pendientes de decisión durante la implementación** (no bloquean el congelado):

- Archivar `ESCANEO.md` e `ITERATION2_RESULT.md` (F0).
- Copy del hero de la Home (antes de F3).
- Formato y diseño del `og:image` (F0).
- Resultado de la medición del header mobile (F2): se registra aquí.
