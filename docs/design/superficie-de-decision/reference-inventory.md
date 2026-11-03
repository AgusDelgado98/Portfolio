# Inventario de referencias visuales

Imágenes en `reference/`. Se generaron con `source/` (HTML renderizado con Edge, escala 1,5). Las huellas son SHA-256.

| Id | Archivo | Píxeles | Bytes | SHA-256 | Muestra | Fases |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | `R1-home.png` | 2160 × 3242 | 980.536 | `27d2af55748d2e59be55f2cb1d6dea2bc9cdee7efee9e9af8023acd2e84887a7` | Home en escritorio | F4 |
| R2 | `R2-proyectos.png` | 2160 × 3234 | 639.876 | `5168216225829ef5fde0431a0711bf04814dc874017963f6679b0024635ec6fc` | Proyectos | F5 |
| R3 | `R3-decerno.png` | 2160 × 5330 | 540.752 | `65b9003fb3ffa362d71bd5eab52ca8aad0e7c988e30d1c1bed87dba5b32b01a2` | Página de DECERNO (estructura y cabecera) | F7 |
| R4 | `R4-sobre-mi.png` | 2160 × 3346 | 451.515 | `e139b1224005cfa2f8e7cd29ba7d92e7dd8aa849b63e8368d5c770adbdde4509` | Sobre mí | F8 |
| R5 | `R5-movil.png` | 3600 × 1755 | 761.243 | `2a7abe68dd09353f238343998cb2368306b0e29121e359003ad17bedfbc983b6` | Móvil, cinco vistas (Home, Proyectos, DECERNO, Sobre mí, menú) | F3, F4, F5, F7, F8 |
| R6 | `R6-familia-de-figuras.png` | 2160 × 1960 | 494.421 | `34b00ce1f26ca44a81ec7397e70acf775853f4d31866041c2fd5262a07518822` | Familia de seis figuras y sus reglas | F4, F6, F7, F8 |

Peso total: 3,87 MB. Escritorio: 1.440 px de ancho CSS; móvil: pantallas de 390 × 844 px.

## Correspondencia con los archivos fuente

| Referencia | Fuente en `source/` |
| --- | --- |
| R1 | `home.html` |
| R2 | `projects.html` |
| R3 | `decerno.html` |
| R4 | `about.html` |
| R5 | `mobile.html` |
| R6 | `family.html` |
| Estilos y figuras (todas) | `shared.css`, `figures.js` |

## Qué es real, simulado o conceptual en cada figura

| Figura | Tipo | Aparece en |
| --- | --- | --- |
| Superficie de respuesta | simulada | R1, R5, R6 |
| Mapa de contornos | simulada | R1, R2, R5, R6 |
| Resultados potenciales y efecto | conceptual | R3, R5, R6 |
| Abanico de pronóstico | conceptual | R2, R6 |
| Mosaico de calidad de datos | conceptual | R2, R6 |
| Ruta de evolución | conceptual | R4, R5, R6 |

Ninguna figura de las referencias contiene datos reales de ningún proyecto.

## Diferencias entre las imágenes y el texto de registro

Las imágenes quedan como se aprobaron; estas diferencias se corrigen en la implementación según `decisions.md`.

| Referencia | Lo que muestra | Lo que prevalece |
| --- | --- | --- |
| R1, R5 | Subtítulo «Uso datos para entender, predecir y decidir, y digo con claridad qué tan firme es cada conclusión.» | «…y explico cuánta evidencia respalda cada conclusión.» |
| R4, R5 | Práctica: «Red de consultorios · desde mar 2024» sin modalidad | Se agrega «contrato (monotributo), dedicación parcial, mayormente remoto». |
| R4 | Formación con DataCamp sin aclaración | «Formación continua en curso», sin certificado. |
| R4 | Fila «Decisión bajo restricciones» | **Se elimina** de la matriz (decisión del 2026-11-03). Solo se mencionaría como «simulación de políticas de capacidad». La fila de Machine learning aplicado lleva aclaraciones (PROVIDENTIA: LightGBM como sensibilidad, ETS principal; PARADIGM: datos sintéticos, señal moderada). |
| R3, R4 | Etiquetas «NOTA DE DISEÑO» y recuadros punteados | No se implementan. |
| R3 | Secciones Metodología, Experimentación, Resultados y Limitaciones como estructura reservada | En la primera versión solo contenido genérico; sin experimentación ni resultados (decisión 6). |
| Todas | Títulos SEO y descripciones no aparecen | Los de `decisions.md`, sección 12. |

## Tipografías y paleta de las referencias

- Fraunces (títulos), Instrument Sans (interfaz), IBM Plex Mono (leyendas). Los bocetos las cargan desde Google Fonts; la implementación las autoaloja.
- Paleta: abismo `#0A151A`, abismo 2 `#071015`, petróleo `#2B5563`, bruma `#86A9B3`, marfil `#F1EBDD`, papel `#F3EEE2`, arena `#E7D2AC`, cobre `#D6A266`. El cobre solo para umbral, región de acción y decisión. Sobre papel: texto `#14232A`, secundario `#4F6066`, cobre oscuro `#8A5A22`.
