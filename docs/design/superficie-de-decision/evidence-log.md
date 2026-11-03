# Registro de evidencia

Una puerta (EG) bloquea la **publicación** de lo que depende de ella, no la construcción de la estructura. Se cierra cuando la fuente está revisada y anotada aquí con fecha y con quién la confirmó. Estado al 2026-11-03.

| Puerta | Qué se verifica | Bloquea | Estado |
| --- | --- | --- | --- |
| EG1 | Experiencia: contrato (monotributo), dedicación parcial, mayormente remoto; sin presentarla como otra relación laboral. | F8, F9 | **Confirmada por el titular.** Registrada abajo. |
| EG2 | DataCamp «en curso», sin certificado; Tecnicatura «en curso». | F8 | **Confirmada por el titular.** Registrada abajo. |
| EG3 | Cada marca de «Competencias demostradas» remite a una fuente real. | F8 | Reglas y aclaraciones cerradas (2026-11-03); **falta la revisión final de cada marca antes de F8.** |
| EG4 | Ficha de PROVIDENTIA: métodos, cifras y fuentes; sin mezclar el abanico conceptual. | F6 | Pendiente. Fuente principal: `claims_contract.md`. |
| EG5 | Ficha de PARADIGM: datos sintéticos, capacidad predictiva limitada, comparación con reglas fijas. | F6 | Pendiente. |
| EG6 | DECERNO: por sección, fuente, commit y autorización de divulgación. | F7b, F7c | **Bloqueada.** Decisión: solo contenido genérico; lo específico necesita auditoría de divulgación y autorización independiente. |
| EG7 | SOMA: redacción aprobada, sin enlaces nuevos a la demo. | F4, F5 | Sin cambios respecto de lo aprobado. |
| EG8 | Posicionamiento sin «Data Scientist» como cargo; coherente con la experiencia. | F9 | Textos de referencia aprobados (`decisions.md`, sección 12); falta la guarda y la revisión de longitud. |
| EG9 | Licencias y archivos de las tres fuentes. | F1 | **Cerrada en F1** (ver abajo). |
| EG10 | Analítica o seguimiento. | F0 | **Inventario hecho; no se encontró.** Ver abajo. |
| EG11 | Otros proyectos: copy existente, sin afirmaciones nuevas. | F5 | Sin cambios de contenido previstos. |
| EG12 | Textos en inglés de cada fase. | cierre de cada fase | Continuo. |
| EG13 | Cada figura con su tipo, su insignia y, si es real, su fuente. | F4 a F8 | Se verifica por fase. |

## Entradas

### EG1 y EG2 — confirmadas por el titular (2026-11-03)

Texto recibido: el titular continúa trabajando como analista de datos en un consultorio, con dedicación parcial y bajo una modalidad contractual; complementa su Tecnicatura en Ciencia de Datos con formación continua en DataCamp. Pidió no presentar cursos en progreso como certificados ni la modalidad contractual como otra relación laboral.

Estado del repositorio al respecto: `src/i18n/messages/profileExperience.js` dice «Contrato (Monotributo) · Mayormente remoto», sin «dedicación parcial»; `src/i18n/messages/ui.js` lista Coderhouse (completado), IBM Generative AI Engineering (completado, septiembre de 2026) y la Tecnicatura (en curso) en el Instituto Superior Santo Domingo, sin DataCamp. Se actualizan en F8.

### EG10 — analítica y seguimiento (inventario de solo lectura, 2026-11-03)

Hecho: no se asume que haya analítica externa.

| Comprobación | Resultado |
| --- | --- |
| Búsqueda de «umami» en todos los archivos versionados y no ignorados | Sin coincidencias |
| Búsqueda de «umami» en el historial de todas las ramas (`git log --all -S`) | Sin coincidencias |
| Dependencias de `package.json` | Solo `react` y `react-dom` |
| Etiquetas, eventos o llamadas de seguimiento en `src/` | Ninguna. Solo `hashchange`, foco y un `IntersectionObserver` de aparición. |
| `.env*`, `.vercel/`, CLI de la plataforma | No hay archivos locales ni CLI |
| HTML y JS publicados en `portfolio-me-f104.vercel.app` | Sin scripts de terceros ni cadenas de Umami; el JS publicado es idéntico al del build local |
| `/_vercel/insights/script.js` | 404 (Web Analytics no está activada) |
| `/_vercel/speed-insights/script.js` | 200, pero la página publicada **no lo carga**; no hay recolección desde el HTML servido |
| Acceso al panel de la plataforma | No disponible: no se puede confirmar si hay algo activado solo en el panel |

Conclusión: **no hay analítica ni seguimiento de eventos en el código ni en la página publicada.** No se eliminó ni se agregó nada. Queda como tarea separada la instrumentación (Umami Cloud u otro) si el titular decide hacerla.

Observación sobre el despliegue: el dominio canónico responde hoy **HTTP 200 sin autenticación** (índice del 31 de octubre). La auditoría del 30 de octubre lo había encontrado detrás del inicio de sesión de la plataforma; la protección cambió fuera del repositorio. Conviene que el titular lo tenga presente: el sitio actual está público.

### EG9 — licencias y archivos de las fuentes (**cerrada en F1, 2026-11-03**)

| Familia | Licencia | Verificación |
| --- | --- | --- |
| Fraunces | SIL OFL 1.1 © The Fraunces Project Authors | Texto OFL descargado de `undercasetype/Fraunces`; sin nombre de fuente reservado. |
| Instrument Sans | SIL OFL 1.1 © The Instrument Sans Project Authors | Texto OFL descargado de `Instrument/instrument-sans` (rama `master`; mi primer intento usó `main` y dio 404). Archivo idéntico, byte por byte, a la copia de DECERNO. Sin nombre reservado. |
| IBM Plex Mono | SIL OFL 1.1 © IBM Corp. | Texto OFL descargado de `IBM/plex`. **Declara el nombre reservado «Plex»:** sus archivos no se modifican sin renombrar. Archivo de 400 idéntico, byte por byte, a la copia de DECERNO. |

Los cinco archivos se descargaron desde Google Fonts, con tamaño y SHA-256 registrados en `src/assets/fonts/fonts.manifest.json` y verificados por prueba. Detalle en `fonts-register.md`. No se copió ningún recurso del proyecto DECERNO.

### F1 — cierre (2026-11-03)

- **Fuentes:** autoalojadas y verificadas (EG9 cerrada). Informe completo en `f1-report.md`.
- **Presupuesto crítico de fuentes:** **pendiente, no cumplido.** Medido en frío: 127.012 bytes de archivo (128.272 en la red) frente al objetivo de 115.000. El titular aceptó la desviación de forma provisional; la decisión de cómo cerrarla queda para antes de F4 (opciones en `fonts-register.md` y `f1-report.md`).
- **EG13 (figuras):** sin cambios; sigue verificándose por fase.

### EG3 — matriz de competencias: evidencia reunida

Regla: sin evidencia verificable, no hay marca. Fuentes revisadas el 2026-11-03.

| Competencia | Marca propuesta | Evidencia |
| --- | --- | --- |
| Análisis y reporting | Experiencia · PARADIGM | Puesto: análisis con SQL y Excel de presencialidad, turnos y uso de obras sociales para decisiones operativas (`profileExperience.js`). PARADIGM: etiqueta «Analysis · Data quality · Reporting», Power BI y Streamlit (`projects.js`, `registry.js`). |
| Calidad de datos | Experiencia · PARADIGM | Puesto: mantiene, valida y actualiza datos de pacientes con foco en consistencia y trazabilidad. PARADIGM: limpieza y chequeos de fuga en su paquete de evidencia (README, cuaderno). |
| Forecasting y series temporales | PROVIDENTIA | Modelos de referencia, ETS (principal), SARIMA y LightGBM; evaluación final bloqueada; cobertura de intervalos (`forecasting_metrics.csv`, `data.test.js`). |
| Machine Learning aplicado | PARADIGM · PROVIDENTIA, ambos con aclaración (decisión del 2026-11-03) | PARADIGM: regresión logística elegida por PR-AUC de validación frente a bosque aleatorio y línea base de clase mayoritaria; comparación con reglas fijas en prueba. **Aclaración obligatoria:** evaluaciones con datos 100 % sintéticos y señal predictiva moderada (ROC-AUC de prueba ≈ 0,65). PROVIDENTIA: LightGBM implementado y evaluado en desarrollo y en la evaluación final. **Aclaración obligatoria:** LightGBM es un modelo de sensibilidad; el modelo principal es estadístico (ETS). |
| Inferencia causal y experimentación | DECERNO como «en desarrollo» | Protocolos y código en el repositorio de DECERNO; sin resultados publicados y con la divulgación específica en auditoría (EG6). |

Puntos que estaban abiertos, resueltos el 2026-11-03:

1. **PROVIDENTIA en «Machine Learning aplicado»:** se mantiene, **con la aclaración** de que LightGBM se evaluó como modelo de sensibilidad y de que ETS es el modelo principal.
2. **«Decisión bajo restricciones»:** **no se usa como competencia demostrada.** El contrato de afirmaciones de PROVIDENTIA (`claims_contract.md`) prohíbe, entre otras, «capacidad real del hospital», «probabilidad de saturación», «capacidad óptima» y «ahorro monetario», y exige conservar sus límites en cualquier página del portfolio. Si hace falta mencionarlo, solo como **simulación de políticas de capacidad**, sin atribuir optimización real.
3. **PARADIGM en «Machine Learning aplicado»:** se mantiene, aclarando datos sintéticos y señal predictiva moderada.

La matriz queda con cinco filas candidatas (análisis y reporting, calidad de datos, forecasting y series temporales, machine learning aplicado, inferencia causal y experimentación). **Sigue pendiente la revisión final de cada marca antes de F8**, y sin evidencia suficiente se omite.

### EG6 — DECERNO (decisión del 2026-11-03)

Sin cambios en el repositorio de DECERNO ni en su contenido público. Se leyó en modo lectura el 3 de noviembre; su árbol de trabajo tenía cambios sin commitear (protocolo HTE), así que no se fija ningún commit hasta la auditoría. Contenido permitido en la primera versión: propósito, preguntas, principios metodológicos, salvaguardas y limitaciones generales. Excluido hasta una auditoría de divulgación y una autorización independiente: Gate 0, autorizaciones limitadas, Hillstrom y Caso 01.

### EG8 — textos de referencia

Ver `decisions.md`, sección 12. Verificar longitud y coherencia ES/EN en F9; la guarda de posicionamiento prohíbe «Data Scientist» como cargo.

### F2 — cierre (2026-11-03)

- **EG6 (DECERNO):** sigue **bloqueada**. DECERNO quedó registrado como proyecto **retenido** (`publication: 'withheld'`), solo estructura, sin texto en ningún idioma, y 16 pruebas más 2 de notas de diseño impiden que aparezca en la interfaz, las rutas, el sitemap o los metadatos. No se publicó Gate 0, Hillstrom, el Caso 01 ni autorizaciones limitadas. Para publicarlo hace falta cerrar EG6 y editar esas pruebas a propósito.
- **`journey`:** los cuatro pasos de DECERNO figuran como `designed`; ninguno `demonstrated`. Los pasos demostrados de PROVIDENTIA y PARADIGM citan archivos del repositorio cuya existencia verifica una prueba. Se confirma la regla del titular: PROVIDENTIA «decidir» es **simulación** de políticas de capacidad.
- **Rendimiento:** la muestra de Lighthouse de ficha y caso mostró una diferencia en la página de caso (Perf 96 frente a 99; LCP simulado +524 ms) originada en F1. Fue diagnosticada después (ver la entrada siguiente): es un artefacto de la simulación, no una regresión de experiencia demostrada.

### Diagnóstico del LCP simulado en páginas de caso (2026-11-03, sin cambios al repositorio)

Página medida: `#projects/providentia/demand-forecasting`. Lighthouse 13.6.0, móvil, simulado; tres corridas por configuración, intercaladas.

| Configuración | LCP simulado (ms) | LCP observado (ms) |
| --- | --- | --- |
| A. Antes de F1 (Google Fonts) | 2.239 | 223 |
| B. Actual (fuentes autoalojadas) | 2.836 | 258 |
| C. Actual sin fuentes web (copia de trabajo fuera del repositorio) | 2.096 | 231 |

Conclusiones registradas:

1. **La diferencia del LCP simulado es reproducible.**
2. **Las fuentes autoalojadas explican el comportamiento de Lighthouse.** Sus peticiones empiezan (~130–150 ms) antes del instante en que se observa el LCP (~250 ms); la simulación cuenta esas peticiones (~125 KiB) y suma ≈ 0,6 s. Con Google Fonts empezaban después (~233 ms) y quedaban fuera de la simulación en 2 de 3 corridas; cuando entraron, el LCP simulado de la línea base también fue alto (4.182 ms). Sin fuentes web (C), el simulado baja a 2.096 ms.
3. **El LCP observado en laboratorio muestra una diferencia pequeña** (≈ +35 ms entre A y B).
4. **No hay evidencia suficiente de una regresión importante de experiencia de usuario.**
5. **El comportamiento en condiciones reales queda pendiente de evaluar en F11.**

Decisión: **no se modifican las fuentes ni se retrasa artificialmente su carga** para mejorar una puntuación; sería forzar la métrica de laboratorio. No se hacen más investigaciones de Lighthouse por ahora.

### F3 — cierre (2026-11-03)

- **EG6 (DECERNO):** sigue **bloqueada**. La cabecera y el menú no lo muestran: la lista de proyectos del menú sale de las listas de presentación, que solo contienen proyectos publicados, y una prueba impide nombrar un proyecto retenido en la cabecera, el menú o su comportamiento. Se verificó también en el navegador (ni texto ni enlaces). Al publicarse, aparecerá solo, sin reconstruir la navegación.
- **Navegación:** las rutas, los alias, las anclas, el enlace de salto, `CV_HREF` y la medición de `--site-header-h` se conservan. 38 comprobaciones en navegador real (`f3/browser-checks.json`).
- **Presupuesto de JavaScript:** 104.772 bytes; la tolerancia del script se re-basó a 1.600 bytes acumulados (tope de 110.000 sin cambios). Quedan 5,2 KB para F4 a F10: decidir antes de F4 cómo se cargan las figuras.
- **Sin verificar:** iOS Safari real y lector de pantalla; se evalúan en F11.

### F4 — cierre (2026-11-03)

- **EG1 y EG2:** la Home dice «Data Analyst con dedicación parcial en una red de consultorios médicos», «Tecnicatura en Ciencia de Datos (en curso)» y «formación continua en DataCamp». Una prueba prohíbe «certificado» y «Data Scientist» como cargo en la copia de la Home.
- **EG6 (DECERNO):** sigue **bloqueada**. La Home no lo muestra y no deja huecos; no hay texto, figura ni activo suyo en `src` ni en `public/figures` (una prueba lo verifica). Cuando se publique, ocupará el lugar principal por posición.
- **EG7 (SOMA):** la línea complementaria usa la redacción aprobada: uso profesional, demostración pública solo con datos ficticios.
- **EG13 (figuras):** cada figura que no es un resultado dice que es conceptual (superficie: «figura conceptual, datos simulados»; pronóstico y mosaico: «Figura conceptual»). Una prueba lo exige para toda figura de proyecto.
- **Presupuesto de JavaScript:** 104.094 bytes (F3: 104.772); la tolerancia del script **no se tocó**. La Home elimina el flujo interactivo del hero y las tarjetas anteriores.
- **Fuentes:** la Home carga ahora la itálica de Fraunces (titular y frase del proyecto principal): los cinco archivos suman 208.512 bytes. Ver la entrada siguiente.

### Excepción de fuentes críticas — verificación acotada (2026-11-03)

Autorizada por el titular: excepción documentada al objetivo de 115 KB críticos, con el límite total de 210 KB vigente. Antes de cerrarla se midió la Home móvil, sin repetir la batería de Lighthouse.

**Cómo:** Edge, móvil de 390 × 844 a 2×, red «Slow 4G» (1,6 Mbit/s, 150 ms de latencia), CPU 4 veces más lenta, caché vacía, servidor local con compresión brotli como una CDN. Tres cargas en frío intercaladas por versión y una con capturas de pantalla. Línea base: `main` (868c767), con las fuentes de Google. Datos en `f4/fonts-exception/mediciones.json`; scripts en la misma carpeta. No es Lighthouse y no usa retrasos de fuentes.

| | Línea base (`main`) | F4 |
| --- | --- | --- |
| LCP (ms; 3 cargas) | 1.612 · 1.616 · 1.576 (media 1.601) | 1.796 · 1.668 · 1.652 (media 1.705) |
| Elemento LCP | párrafo del hero | imagen de la superficie |
| FCP (ms) | 1.576 – 1.616 | 1.532 – 1.796 |
| CLS | 0,0001 | 0,0029 |
| Tareas largas > 50 ms (suma) | 76 – 455 ms | 145 – 679 ms (rangos solapados; ruido de la CPU limitada) |
| Bytes en la red, total | 302.411 | 347.269 |
| Bytes de fuentes | 193.175 | 209.527 |

**Solicitudes de fuentes (F4):** cinco, todas propias, empiezan entre 1,15 y 1,17 s (cuando el JavaScript ya dibujó la página y el navegador descubre qué caras usa) y terminan entre 1,70 s (Plex Mono 500) y 2,45 s (Fraunces itálica, la última); 209.527 bytes en la red. En la línea base eran cuatro solicitudes a la CDN de Google (193.175 bytes), con el mismo patrón de inicio (~1,1 s) y fin hasta 2,3 s.

**Bytes descargados frente a bloqueo del renderizado.** Lo único que bloquea el renderizado es el CSS (F4: 11.815 bytes; línea base: 10.511). Las **fuentes no bloquean**: el estado de bloqueo de cada una es «no bloquea» y el primer pintado ocurre antes de que lleguen. El camino que sí gobierna el primer pintado es documento + CSS + JavaScript (F4: 1,2 + 11,8 + 96,4 KB; línea base: 1,3 + 10,5 + 95,5 KB), porque la página se dibuja en el cliente. El LCP no depende de la red de la imagen: la imagen compacta (15,7 KB) termina a 1,36 s y se pinta hacia 1,65–1,80 s, limitada por la ejecución del JavaScript con la CPU 4× más lenta. Las fuentes (209 KB de los 347 KB) se descargan después del primer pintado y no lo retrasan.

**`font-display: swap` y cambio visual.** El texto aparece de inmediato con las fuentes de respaldo de métricas ajustadas y cambia al cargar: Instrument Sans a ~2,0 s, Fraunces y su itálica a ~2,4 s. El cambio **perceptible** es en el titular, que pasa de un respaldo más pesado a Fraunces 300, más fino (`f4/fonts-exception/swap-frames.png`); las líneas, los saltos y las posiciones no cambian: dos desplazamientos de texto que suman un CLS de 0,003, muy por debajo de 0,1. Entre el primer pintado y las fuentes finales el 3 % de los píxeles difería a ~2,0 s y menos del 1 % a ~2,6 s.

**Conclusión.** Sin regresión importante: el LCP sube unos 100 ms (≈ 6 %) con una cola de fuentes de ~2,5 s que no bloquea nada, el CLS es mínimo y el único cambio visible es el de peso del titular. **Excepción cerrada provisionalmente.** Queda para F11 (y para antes de publicar): repetir la medición en condiciones reales y, si hace falta, mejorar cómo se descubren las fuentes y la imagen del hero **sin cambiar la tipografía**.
