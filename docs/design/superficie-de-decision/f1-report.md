# Informe de F1 — fundaciones tipográficas y de tokens

Fecha: 2026-11-03. Rama `design/superficie-de-decision`, sin push. Base: `main` en `868c767`; F0 en `b4ef603`.

**Estado: F1 completada, con una desviación abierta:** el presupuesto de fuentes críticas (objetivo 115 KB) no se cumple. Se midieron 127 KB y el titular lo aceptó de forma provisional; queda **pendiente, no aprobado como cumplido**. No hay regresiones bloqueantes. Una regresión visual menor (banda oscura bajo la cabecera) se detectó y se corrigió dentro de F1.

## Commits locales

| Commit | SHA | Contenido |
| --- | --- | --- |
| 1 | `3349c12cf2465ebad538267666de556395cee376` | Fuentes autoalojadas, licencias, manifiesto, prueba de integridad y registro de fuentes. |
| 2 | `786e415ba3f12d5dd232b23d9046a0081e1c9a80` | Tokens, `fonts.css`, pesos, `index.html`, pruebas de contraste y de fuentes, scripts de presupuesto y de glifos. |
| 3 | (este informe y sus documentos; ver `git log`) | Documentación y mediciones. |

## Archivos

**Nuevos (commit 1):** `src/assets/fonts/` (cinco `.woff2`, `fonts.manifest.json`, `fonts.assets.test.js`); `public/fonts/licenses/` (`OFL-Fraunces.txt`, `OFL-InstrumentSans.txt`, `OFL-IBMPlex.txt`); `docs/design/superficie-de-decision/fonts-register.md` y `tools/font-optimization-study.py`.

**Nuevos (commit 2):** `src/styles/fonts.css`, `src/styles/fonts.test.js`, `src/styles/tokens.test.js`, `scripts/audit-glyphs.mjs`, `scripts/check-budget.mjs`.

**Modificados (commit 2):**

| Archivo | Cambio |
| --- | --- |
| `index.html` | Se quitan los tres enlaces a Google Fonts y los dos `preconnect`. Sin precargas. |
| `src/App.jsx` | Una línea: `import './styles/fonts.css'`. |
| `src/styles/tokens.css` | Superficies, textos y bordes re-mapeados a la paleta nueva; tokens con nombre (`--ds-abyss`, `--ds-ivory`, `--ds-sand`, `--ds-copper`, `--ds-paper`, `--ds-copper-ink`…); `--ds-font-*` a Fraunces, Instrument Sans y Plex Mono con su cara de respaldo; escala tipográfica (definida, no aplicada). Los colores por etapa no cambian. |
| `src/styles.css` | `--font-*` pasan a ser alias de `--ds-font-*`; cuatro reglas de peso 700/800 a 500. |
| `src/styles/shell.css`, `home.css`, `projects.css` | Pesos de título a 500 (cuatro reglas: 600, 600, 550, 550) y, en `shell.css`, un borde con el color de fondo antiguo. |
| `src/styles/base.css` | Dos colores de fondo antiguos escritos a mano alineados con `--ds-bg-0`. |

**Commit 3:** `baseline.md` (Lighthouse), `evidence-log.md`, `acceptance-and-strategy.md`, este informe y `measurements/fonts-measured.json`.

No se tocaron: contenido, i18n, rutas, composición de páginas, CV, SEO, `main`, `package.json` ni proyectos hermanos.

## Decisiones técnicas

1. **Archivos oficiales sin modificar.** Se evaluó optimizarlos (ver más abajo), pero no se incorporó nada: no se introdujo ninguna herramienta en el proyecto y la tipografía aprobada no cambió.
2. **Sin precargas.** Con tres precargas (112 KB) el LCP de Home pasó de 763 a 1.373 ms en Lighthouse: la aplicación se dibuja en el cliente y las fuentes compiten por el ancho de banda con el JavaScript. Sin precargas el LCP queda igual que antes. Una prueba impide agregarlas sin volver a medir.
3. **Caras de respaldo con las métricas de cada fuente** (`size-adjust`, `ascent-override`, `descent-override`). Sin ellas, sin precargas, el CLS subía de 0,016/0,000 a 0,018 en Home y Proyectos; con ellas queda en 0,000.
4. **Pesos.** Fraunces llega a 500; las ocho reglas que pedían más (550 a 800) pasan a 500 para evitar un negrita sintético. Cambia el aspecto de la marca del encabezado, que F3 rehace.
5. **Puente de variables.** Los alias `--font-*` y los tokens `--ds-*` actuales siguen existiendo, de modo que los casos públicos y los visuales heredados adoptan las fuentes nuevas sin cambios.
6. **Plex Mono no se modifica:** su licencia reserva el nombre «Plex».

## Pruebas y build

- `npm test`: **350 de 350** (325 previas y 25 nuevas: 12 de integridad de fuentes, 6 de contraste de tokens y 7 de cableado de fuentes). Verificado después de la última modificación.
- Build de producción correcto (`vite build`, 1,7 s) en una carpeta temporal; `dist/` no se tocó.
- `node scripts/audit-glyphs.mjs --strict`: sin caracteres inesperados.
- No se verificó cada commit por separado con la suite: se verificó el árbol de trabajo completo antes de commitear.

## Presupuestos

| Presupuesto | Límite | Resultado | Estado |
| --- | --- | --- | --- |
| JS inicial (gzip -9) | 103.506 (línea base 103.306 + 200); tope documentado 110.000 | 103.301 | Cumple |
| CSS inicial (gzip -9) | 13.014 (línea base 10.966 + 2.048) | 11.736 | Cumple |
| Fuentes, total | 210.000 | 208.512 | Cumple |
| **Fuentes pedidas en carga en frío (objetivo)** | **115.000** | **128.272 en la red (127.012 de archivo)** | **No cumple, pendiente** |

El script cuenta con la medición real (`--measured`): `node scripts/check-budget.mjs <build> --measured docs/design/superficie-de-decision/measurements/fonts-measured.json` informa `MISS`.

### Desviación del presupuesto crítico

En una carga en frío cualquier ruta pide cuatro archivos: Fraunces normal, Instrument Sans, Plex Mono 400 y Plex Mono 500. **Que el código no precargue nada no reduce lo que realmente se descarga.** Frente a lo que se descargaba antes es una mejora del 38 %, pero no alcanza el objetivo.

| Qué piden las páginas | Antes | Ahora |
| --- | --- | --- |
| Archivos | 4 (Newsreader, Plex Sans, Plex Mono 400 y 500) | 4 (Fraunces, Instrument Sans, Plex Mono 400 y 500) |
| Red (KiB) | 202,6 | 125,3 |
| Cursiva de Fraunces | no existía | no se pide en ninguna de las 36 páginas medidas |

**Optimizaciones posibles** (estudio en `fonts-register.md`; ninguna aplicada):

| Opción | Composición actual | Con la de F4 (cursiva en el titular) | Efecto visual |
| --- | --- | --- | --- |
| A. Subconjunto de los archivos | 118,9 KB | 192,9 KB | Ninguno |
| B. A más pesos 300–400 | 108,5 KB | 170,9 KB | Los 500 pasan a 400 (las páginas actuales usan 500; el diseño aprobado, 300 a 400) |
| C. A más tamaño óptico fijo | 87,0 KB | unos 124,9 KB | Cambia el trazo de Fraunces según el tamaño |

Con la composición actual solo B y C cumplen 115 KB. **Con la composición de F4 ninguna opción compatible con el diseño llega a 115 KB**: harían falta C y probablemente quitar Plex Mono 500. Recomendación: antes de F4, decidir un objetivo crítico distinto y medido para la composición final (por ejemplo, el de la opción B, 171 KB, frente a los 202 KB de hoy) o aceptar la opción C como decisión de diseño.

## Lighthouse (disponible)

Lighthouse 13.6.0, Edge 156, móvil, estrangulamiento simulado, mediana de tres corridas; servidor local, mismas condiciones. «Antes» pide las fuentes a Google por la red real; «después» las sirve el servidor local: es una diferencia de condiciones que favorece al «después» en tiempo de red, pero la métrica simulada aplica el mismo modelo a ambos.

| Página | Serie | Perf | LCP (ms) | TBT (ms) | CLS | KiB |
| --- | --- | --- | --- | --- | --- | --- |
| Home | Antes (`main`) | 100 | 763 | 44 | 0,016 | 305 |
| Home | **Final (sin precargas, con respaldo)** | 100 | **769** | 31 | **0,000** | 241 |
| Home | Intermedia: 3 precargas | 100 | 1.373 | 24 | 0,000 | 241 |
| Home | Intermedia: sin precargas ni respaldo | 100 | 763 | 85 | 0,018 | 241 |
| Proyectos | Antes | 100 | 759 | 10 | 0,000 | 305 |
| Proyectos | **Final** | 100 | **766** | 11 | **0,000** | 241 |
| Proyectos | Intermedia: 3 precargas | 100 | 762 | 13 | 0,000 | 241 |
| Proyectos | Intermedia: sin precargas ni respaldo | 100 | 772 | 14 | 0,018 | 241 |

Accesibilidad, buenas prácticas y SEO: 100 en todas las corridas disponibles, antes y después. Home final: Perf 99, 100, 100 por corrida (antes 100, 92, 100).

**Comparación incompleta:** la serie final se detuvo a pedido del titular tras completar Home y Proyectos (3 corridas cada una). **No hay medición final de la ficha ni del caso.** Solo existe la serie intermedia con precargas (ficha: Perf 100, LCP 762 ms, CLS 0,000; caso: Perf 96, LCP 2.761 ms frente a 2.242 ms antes), que no representa la configuración final y no debe usarse como comparación. Las páginas de ficha y de caso sí se compararon en el recorrido con navegador (abajo): CLS, desbordes y títulos. Conviene repetir Lighthouse de ficha y caso en F2 o F11.

## Recorrido con navegador (carga en frío, 18 rutas × 390 y 1.440 px, antes y después)

Rutas: Home, Proyectos, ocho fichas, Sobre mí, Contacto y seis casos.

| Comprobación | Resultado |
| --- | --- |
| Desborde horizontal de página | 0 de 36, antes y después. Los elementos más anchos que la pantalla (fila de tarjetas de Home, tablas de los casos) son los mismos que antes y están dentro de contenedores desplazables. |
| CLS | 0,000 en 35 de 36; 0,001 en uno (caso de capacidad a 1.440). Antes: 0,000 a 0,002. |
| Altura de página | De −1,9 % a +3,5 %. Mayores: Sobre mí a 390 (+3,5 %) y la ficha de Caelum a 1.440 (+3,5 %). |
| Títulos con un número de líneas distinto | 13 combinaciones ruta/ancho; casi todos +1 línea (por ejemplo «Proyectos vinculados a mi trabajo» a 390, «Uso en mi trabajo» en las fichas), y dos con −1. **Ningún título cortado.** |
| Fuente del cuerpo | Instrument Sans en todas las páginas. |

Revisión visual directa de las hojas comparativas: Home a 1.440 y 390 px, un caso (ALETHEIA a 390 px) y la cabecera tras la corrección. El resto se verificó solo con las métricas de arriba; las hojas están en la carpeta de trabajo, no en el repositorio.

## Regresiones visuales

| Hallazgo | Gravedad | Estado |
| --- | --- | --- |
| Banda oscura bajo la cabecera: el fondo de la cabecera tenía escrito a mano el color anterior (`rgba(7, 11, 16, 0.94)`) | Menor | **Corregida** (tres valores en `base.css` y `shell.css`, alineados con `--ds-bg-0`). Confirmada con una captura de Home. |
| Superficies más verdosas y texto marfil en lugar de blanco azulado; botón primario crema | Esperado | Efecto buscado del cambio de tokens |
| Títulos con Fraunces: más líneas en algunos (ver arriba) | Menor | Sin corrección; F3 y siguientes rehacen esas pantallas |
| Marca del encabezado más liviana (pesos 700/800 a 500) | Menor | La rehace F3 |
| `→ ← ↔ ↗ ≠ ≤ ≈ ∪ ↳ Δ` siguen con la fuente del sistema | Sin cambio respecto de antes | Documentado; decidir en F4 si las flechas pasan a SVG |

No se detectaron regresiones de accesibilidad: las puntuaciones medidas se mantienen en 100 y la prueba de contraste de tokens pasa en las tres superficies oscuras.

## Pendientes para las próximas fases

1. **Antes de F4:** decidir el camino del presupuesto crítico (opciones A, B o C, u otro objetivo medido).
2. **F2:** repetir Lighthouse de ficha y caso con la configuración final; agregar la prueba de que no llegan notas de diseño.
3. **F3:** rehacer cabecera, marca y menú (hoy conservan reglas heredadas); `--ds-focus` y el foco sobre papel.
4. **F4:** definir si las flechas y la Δ pasan a SVG; aplicar la escala tipográfica (hoy solo definida); medir el efecto de la cursiva.
5. **F10:** revisar los casos con el rediseño visual previsto; hoy solo adoptan fuentes y tokens.
6. Compatibilidad de `size-adjust` y `ascent-override` verificada solo en Edge (motor Chromium). Firefox los soporta; Safari no se comprobó.
7. No se agregó el script de presupuesto a `package.json`: se ejecuta con `node scripts/check-budget.mjs`.
