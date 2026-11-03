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
| EG9 | Licencias y archivos de las tres fuentes. | F1 | Parcial: ver abajo. |
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

### EG9 — licencias de fuentes (parcial)

| Familia | Licencia | Verificación |
| --- | --- | --- |
| Fraunces | SIL OFL 1.1 © The Fraunces Project Authors | Verificada contra el repositorio original; sin nombre de fuente reservado. |
| Instrument Sans | SIL OFL 1.1 © The Instrument Sans Project Authors | Texto OFL en el proyecto DECERNO (`web/fonts`). La URL original respondió 404; se contrasta al descargar. |
| IBM Plex Mono | SIL OFL 1.1 © IBM Corp. | Texto OFL en el proyecto DECERNO (`web/fonts`). |

Pendiente (F1): obtener los archivos con autorización, incluir el OFL junto a cada uno y medir el peso. No se copia ningún recurso del proyecto DECERNO.

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
