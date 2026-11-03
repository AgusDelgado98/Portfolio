# Decisiones cerradas

Fecha de las decisiones: 2026-11-03. Quien decide: el titular del portfolio.

## 1. Proyectos y estructura

- La Home destaca **solo DECERNO, PROVIDENTIA y PARADIGM**, en ese orden. SOMA es trabajo complementario.
- Los otros proyectos personales se conservan en una sección o página secundaria compacta de `#projects`. Sin catálogo extenso ni carrusel que compita con los tres principales.
- **No se elimina ningún proyecto, copy, caso ni asset del repositorio.**
- Este orden reemplaza al de la Etapa 0 de octubre (PARADIGM → PROVIDENTIA → SOMA).

## 2. Posicionamiento y SEO

- Autorizada la actualización de título, metadatos, Open Graph y contenido hacia **Data Science, Machine Learning e inteligencia artificial aplicada**.
- No se presenta como Data Scientist con experiencia laboral formal en ese puesto. La experiencia actual sigue siendo Data Analyst.
- **El CV oficial no se modifica** durante esta implementación. Su alineación se revisa más adelante.

## 3. Hechos confirmados por el titular

- Trabaja como analista de datos en un consultorio, **con dedicación parcial y bajo una modalidad contractual** (contrato por monotributo, mayormente remoto).
- Complementa la Tecnicatura en Ciencia de Datos con **formación continua en DataCamp**.
- Reglas: no presentar cursos en progreso como certificados obtenidos; no presentar la modalidad contractual como otra relación laboral.
- Que estos datos no figuren en el repositorio no los hace incorrectos. Se registran en `evidence-log.md` (EG1 y EG2).

## 4. Lenguaje y navegación

- Aprobado el lenguaje visual y narrativo **Explorar · Modelar · Evaluar · Decidir**.
- Se conservan identificadores internos, enlaces y eventos existentes cuando sea técnicamente compatible, y se audita su significado antes de reutilizarlos. Resultado de la auditoría: los ids `stages` actuales no se reutilizan; se agrega el campo `journey`.

## 5. PROVIDENTIA

- El abanico de pronóstico es, por ahora, una **figura conceptual identificada como tal**.
- La ficha se basa en métodos, resultados y fuentes reales verificadas. La figura ilustrativa no se confunde con una predicción del proyecto.

## 6. DECERNO

- Es el proyecto principal, presentado según su **estado real**: investigación aplicada en desarrollo.
- En la primera versión pública solo se explican su propósito, las preguntas que aborda, principios metodológicos, salvaguardas y limitaciones generales.
- **No se publican** detalles de Gate 0, autorizaciones limitadas, Hillstrom ni Caso 01 hasta completar una **auditoría de divulgación**. No se presentan capacidades no demostradas ni información interna innecesaria.
- Todo contenido específico de DECERNO necesita autorización independiente.
- Sin resultados no autorizados, métricas inventadas, experimentos de ejemplo ni recursos sujetos a licencia sin auditoría previa.

## 7. Tipografías

- Aprobado el autoalojamiento (Fraunces, Instrument Sans, IBM Plex Mono), con verificación de licencias y presupuesto de rendimiento.

## 8. Casos públicos existentes

- Su rediseño profundo va en una **PR posterior**. En esta etapa solo se garantiza compatibilidad; DECERNO tiene su propia estructura sin forzar la migración de los casos anteriores.

## 9. Idiomas

- Español e inglés se desarrollan y validan juntos en cada fase.

## 10. Analítica y seguimiento

- No se asume que exista analítica externa. Se evaluó Umami Cloud (eventos y origen) sin confirmación de que esté activa.
- En esta etapa no se eliminan mecanismos existentes ni se agrega ningún proveedor. La instrumentación es una **tarea separada** si se confirma que falta.

## 11. Roles objetivo (Contacto)

1. Junior Data Scientist / Data Science Trainee.
2. Junior Machine Learning / Applied ML, cuando los requisitos sean compatibles con la experiencia.
3. Data Analyst / Junior Data Analyst.
4. BI Analyst / Junior BI Analyst.

La identidad prioriza Data Science, Machine Learning e IA aplicada sin eliminar las oportunidades en análisis de datos y BI.

## 12. Textos editoriales aprobados como referencia

| Elemento | Español | English |
| --- | --- | --- |
| Título SEO | Agustín Delgado \| Data Science, Machine Learning y Analítica Aplicada (69 caracteres) | Agustín Delgado \| Data Science, Machine Learning & Applied Analytics (68) |
| Descripción | Portfolio de Agustín Delgado. Proyectos de ciencia de datos, análisis predictivo y machine learning, con foco en evaluación de evidencia y decisiones. (150) | Agustín Delgado's portfolio. Data science, predictive analytics and machine learning projects focused on evaluating evidence and informing decisions. (149) |
| Titular del hero | Datos, evidencia y decisiones. | (a redactar en F2 y validar) |
| Subtítulo | Uso datos para entender, predecir y decidir, y explico cuánta evidencia respalda cada conclusión. | (a redactar en F2 y validar) |

Se puede ajustar longitud y puntuación de los metadatos por SEO, manteniendo sentido y coherencia ES/EN. Los títulos de 68 y 69 caracteres superan lo que suelen mostrar los buscadores (alrededor de 60); decidir el recorte en F9.

## 13. Matriz «Competencias demostradas»

Estructura simplificada aprobada, con estas reglas:

- **Análisis y reporting:** experiencia profesional y PARADIGM, cuando existan evidencias concretas.
- **Calidad de datos:** experiencia y proyectos verificables.
- **Forecasting y series temporales:** PROVIDENTIA.
- **Machine Learning aplicado:** solo en proyectos donde se pueda demostrar implementación y evaluación reales.
- **Inferencia causal y experimentación:** DECERNO, identificado como desarrollo o investigación, sin presentarlo como capacidad validada por resultados concluyentes.
- No es una escala subjetiva de habilidades. Cada marca necesita una referencia verificable y pasa por **revisión final antes de F8**. Sin evidencia suficiente, se omite.

### 13 bis. Decisiones sobre la matriz (2026-11-03, tras la revisión de evidencia)

- **Machine Learning aplicado, PROVIDENTIA:** puede respaldarlo, **indicando que LightGBM se evaluó como modelo de sensibilidad y que ETS es el modelo principal.**
- **Machine Learning aplicado, PARADIGM:** puede respaldarlo, **aclarando que sus evaluaciones usan datos sintéticos y que la señal predictiva es moderada.**
- **«Decisión bajo restricciones» no se usa como competencia demostrada.** Si hace falta mencionarlo, se habla específicamente de **simulación de políticas de capacidad**, sin atribuir optimización real ni afirmar capacidad hospitalaria real, saturación, capacidad óptima ni ahorros (ver `claims_contract.md` de PROVIDENTIA).
- La matriz queda, por ahora, con cinco filas candidatas: análisis y reporting; calidad de datos; forecasting y series temporales; machine learning aplicado; e inferencia causal y experimentación (DECERNO, como desarrollo o investigación). Cada marca sigue sujeta a la revisión final antes de F8.

## 14. Alcance autorizado de F0 y límites

Autorizado: comprobar `main` y la limpieza del árbol; crear la rama local `design/superficie-de-decision`; incorporar las referencias y la documentación; registrar inventario, punto de partida y dependencias; documentar criterios de aceptación y estrategia.

**No autorizado:** F1 ni fases posteriores; push; despliegues; cambios en producción; modificar el CV, los proyectos hermanos o el contenido público de DECERNO; sobrescribir modificaciones preexistentes.

## 15. Cierre de F0 y preparación de F1 (2026-11-03)

- Autorizado cerrar F0 con **un commit exclusivamente local** (sin push, sin tocar `main`, sin desplegar).
- Para F1 se **autoriza la descarga de las fuentes necesarias desde sus orígenes oficiales y de Lighthouse** para mediciones, verificando licencias, integridad y tamaño.
- **F1 no se inicia** hasta entregar el cierre de F0 y su alcance exacto, y recibir la autorización de comienzo.
- Objetivo permanente: implementar el diseño aprobado con fidelidad, conservando accesibilidad, rendimiento, SEO y compatibilidad con el portfolio publicado.

## 16. Decisiones confirmadas tras F1 a F3 (2026-11-03)

- **Fuentes autoalojadas y rendimiento.** El presupuesto crítico de fuentes (127 KB frente al objetivo de 115 KB) queda **documentado como pendiente y no bloquea el avance visual**. La diferencia de LCP simulado en las páginas de caso quedó diagnosticada (ver `evidence-log.md`): no se modifican las fuentes ni se retrasa su carga para mejorar una puntuación; el comportamiento en condiciones reales se evalúa en F11.
- **F3 aceptada técnicamente.** La revisión visual de las capturas es previa a autorizar F4.
- **«CV» en la barra de escritorio: se mantiene**, aunque R1 no lo tenga. Es una función importante para el objetivo laboral del portfolio y no hace falta seguir R1 literalmente si eso quita acceso al currículum. Debe seguir **visualmente discreto**, integrado en el sistema tipográfico y sin competir con la navegación principal. En móvil se conserva «Descargar CV» dentro del menú de pantalla completa.
- **Presupuesto de JavaScript: el límite de 110 KB es fijo.** No se sigue aumentando automáticamente la tolerancia del script de presupuesto. Cualquier incremento importante debe justificarse con una **reducción equivalente** o con una **estrategia de carga diferida**.
- **Figuras (F4): preferencia inicial por figuras SVG como recursos independientes**, sin bibliotecas de visualización pesadas.
- **Margen móvil de 22 px:** queda aprobado como referencia del boceto, siempre que se adapte correctamente a distintos anchos de pantalla.
- **No se inicia F4** hasta que el titular lo autorice después de revisar F3.

## 17. Excepción documentada al objetivo de fuentes críticas (2026-11-03)

- **Presupuesto total de fuentes: cumplido.** 208.512 bytes frente al límite de 210.000, que sigue vigente.
- **Objetivo de 115 KB de fuentes críticas: no cumplido.** La Home carga las cinco fuentes (Fraunces normal e itálica, Instrument Sans y dos pesos de IBM Plex Mono), todas usadas en la composición editorial aprobada.
- **Se acepta provisionalmente una excepción** a ese objetivo. No se elimina la itálica de Fraunces, no se cambia la tipografía ni se altera la composición para alcanzar los 115 KB, y no se incorporan herramientas, dependencias ni procesos complejos de optimización en esta etapa.
- **Verificación acotada (hecha el 2026-11-03):** carga en frío de la Home móvil con red lenta y CPU limitada, frente a la línea base de `main`. LCP unos 100 ms mayor, CLS de 0,003, fuentes sin bloquear el renderizado y un cambio tipográfico perceptible pero sin movimiento de la composición. Se consideró aceptable (detalle en `evidence-log.md` y `f4-report.md`). No se retrasaron las fuentes para mejorar una puntuación.
- **Optimización posterior (F11):** debe **mantener la tipografía y la identidad editorial aprobadas**; solo se admiten medidas que no cambien lo que se ve (por ejemplo, subconjuntos de los caracteres usados o cómo se descubre y prioriza la carga), nunca sustituir fuentes o quitar la itálica.
- **La excepción queda sujeta a reevaluación antes de publicar**, con medición en condiciones reales.
