# F8 — Sobre mí (R4 / R5)

**Estado: F8 completada.** La página `#about` sigue R4 (escritorio) y R5 (móvil): hero editorial oscuro con EvolutionRoute, costura, trayectoria en tres áreas, matriz de evidencia y cierre de método. 414 pruebas, build y presupuestos en verde. DECERNO no aparece. F7 sigue bloqueada por EG6; no se avanza a F7 ni F9.

## 1. Qué cambió

| Pieza | Detalle |
| --- | --- |
| Título | «Del análisis de datos a la ciencia de datos aplicada.» |
| Hero | Dedicación parcial, base operativa, Tecnicatura + DataCamp (sin certificado). |
| EvolutionRoute | SVG estático (`evolution-route.svg`); etiquetas HTML; solo PARADIGM y PROVIDENTIA. |
| Trayectoria | Práctica · Formación · Dirección; pestañas en &lt;800 px. |
| Matriz | Experiencia · PARADIGM · PROVIDENTIA; 4 filas; aclaraciones ML; sin causal ni «Decisión bajo restricciones». |
| Carga | About + `about.css` en chunk diferido (lazy), para no inflar el CSS/JS inicial. |

## 2. Evidencia (EG1–EG3)

- **EG1:** «dedicación parcial» / «partial dedication» en hero y meta del rol.
- **EG2:** DataCamp como formación continua; sin «certificado» junto a DataCamp.
- **EG3:** marcas solo con evidencia publicada; fila causal omitida mientras no hay evidencia pública.

## 3. Pruebas y capturas

- Suite: **414 / 414**.
- Navegador (`f8/capture.mjs`): **26 / 26** a 1.440 y 390 px; EN OK; sin overflow; sin DECERNO.
- Capturas: `f8/about-1440.png`, `f8/about-390.png`, `f8/about-1440-en.png`; referencia `f8/R4-reference.png`.

## 4. Presupuestos (inicial)

| | Medido | Límite | Margen |
| --- | ---: | ---: | ---: |
| JS gzip | 103.880 | 104.906 (tolerancia) / 110.000 duro | +1.026 |
| CSS gzip | 12.138 | 13.014 | +876 |
| Figuras gzip | ~75,5 KB | 80.000 | OK |

No se subieron tolerancias. About diferido reduce el CSS inicial respecto de F6.

## 5. Fuera de alcance

Sin push, sin deploy, sin `main`, sin CV, sin proyectos hermanos. **F7 no ejecutada.** F9 no iniciada.
