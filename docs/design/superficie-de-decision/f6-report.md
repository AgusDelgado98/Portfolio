# Informe de F6 — fichas PROVIDENTIA y PARADIGM

Fecha: 2026-11-03. Rama `design/superficie-de-decision`, sin push. Parte del cierre de F5 (`8721828`).

**Estado: F6 completada.** ForecastFan y QualityMosaic son componentes compartidos con leyenda conceptual obligatoria. Las placas de Proyectos muestran hechos verificables (WAPE congelado; ETS principal / LightGBM sensibilidad; datos sintéticos y señal moderada en PARADIGM). El titular del hero se adapta a «Dos casos, dos preguntas» mientras solo hay dos proyectos spotlight publicados. 410 pruebas, build y presupuestos en verde. DECERNO no aparece. No se avanza a F7.

## 1. Qué se implementó

| Pieza | Qué hace |
| --- | --- |
| `ForecastFan` / `QualityMosaic` | Componentes React sobre los SVG estáticos de F4; exigen `note` + etiquetas (EG13). |
| `spotlightFigures` / `spotlightFacts` | Mapa compartido Home/Proyectos; hechos con WAPE desde `FINAL_WAPE`. |
| `ProjectsSpotlight` | Placas enriquecidas con Método / Resultado o Límite / Alcance. |
| `ProjectsHero` | Título y preguntas según proyectos spotlight publicados (2 hoy → 3 al publicar el principal). |
| Copy ficha PROVIDENTIA | Método: ETS principal, LightGBM sensibilidad (ES/EN). |
| Home `FeaturedProjects` | Usa los mismos componentes de figura (sin duplicar SVG markup). |

El abanico **no** se monta en Project Detail: la ficha de detalle sigue con evidencia real (`ProjectVisual` + packs); el fan queda en listados, siempre con leyenda «figura conceptual · no es un pronóstico del caso».

## 2. Diferencias con R2

| Diferencia | Motivo |
| --- | --- |
| «Dos casos, dos preguntas» y solo dos preguntas | Solo dos spotlight publicados; adaptable a tres sin cambiar el concepto. |
| Placa PROVIDENTIA (no DECERNO) + hechos reales | EG6; EG4. |
| Tags PARADIGM ampliados (calidad / ML) | EG5 / decisiones §13. |
| Leyenda del fan más explícita | Separar figura conceptual de evidencia congelada. |

## 3. Pruebas y build

- **410 / 410**
- Navegador F6: **20 / 20** (`f6/browser-checks.json`)
- Build OK

## 4. Presupuestos (gzip -9)

| | Bytes | Límite | Margen |
| --- | ---: | ---: | ---: |
| JS | **104.458** | 110.000 (script 104.906) | +448 |
| CSS | **12.952** | 13.014 | +62 |
| Figuras | sin activos nuevos | 80.000 | — |

Sin subir tolerancias. CSS al límite: se reutilizaron `.home-data` / `.home-pfig`.

## 5. Capturas

`f6/projects-1440.png`, `projects-390.png`, `projects-1440-en.png`

## 6. F8

**Sí: F8 (Sobre mí) puede implementarse de inmediato de forma independiente.** Depende de F3 (hecho) y EG1–EG3; no depende de F7. F7 sigue bloqueada por EG6.
