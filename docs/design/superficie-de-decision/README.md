# Superficie de decisión — dirección visual del portfolio

Estado: **F0 completada el 2026-11-03** (preparación). No hay implementación. La rama de trabajo es `design/superficie-de-decision`, creada desde `main` (`868c767`).

Esta carpeta guarda lo necesario para desarrollar el rediseño sin depender de nada externo: los bocetos aprobados, su código fuente, las decisiones, el punto de partida medido, el registro de evidencia y los criterios de aceptación.

## Qué contiene

| Archivo | Contenido |
| --- | --- |
| [`decisions.md`](decisions.md) | Decisiones cerradas del 2026-11-03, con su texto editorial aprobado. |
| [`reference-inventory.md`](reference-inventory.md) | Las seis referencias visuales (R1 a R6): huella, tamaño, qué muestran y qué fase las usa. |
| [`baseline.md`](baseline.md) | Punto de partida: pruebas, build, presupuesto, inventario del repositorio y dependencias. |
| [`evidence-log.md`](evidence-log.md) | Puertas de evidencia EG1 a EG13, hallazgos y estado. |
| [`acceptance-and-strategy.md`](acceptance-and-strategy.md) | Estrategia de implementación, fases F0 a F12, pruebas y criterios de aceptación. |
| `reference/` | Las imágenes aprobadas (R1 a R6). |
| `source/` | Código HTML, CSS y JS con el que se generaron (solo bocetos). |

## Cómo usar las referencias

- Son el criterio visual obligatorio: cada fase se compara con la referencia que le corresponde (ver `reference-inventory.md`) a 390, 768 y 1.440 px. Un desvío se aprueba antes de seguir.
- Los textos de las imágenes pueden ser anteriores a los textos aprobados. **Prevalece lo escrito en `decisions.md`.**
- R3 y R4 llevan etiquetas azules «NOTA DE DISEÑO» y recuadros punteados. Son anotaciones del boceto: **no se implementan**.

## Reglas para el código de esta carpeta

- `source/` es solo de referencia. Nada de `src/`, `public/` ni del build debe importarlo.
- Contiene a propósito cadenas como «NOTA DE DISEÑO» y enlaces a Google Fonts. Cualquier prueba que rechace esas cadenas (previsto en F2 y F11) debe revisar solamente `src/`, `public/`, `index.html` y el resultado del build, **no `docs/`**.
- Las figuras de `source/figures.js` son la especificación geométrica de la familia de figuras; la versión de producción se reescribe como componentes de React (F4, F6, F7, F8).

## Volver a generar las imágenes

Requiere Microsoft Edge. `source/render.ps1` captura una página con Edge sin interfaz:

```powershell
./render.ps1 -name home -w 1440 -h 2300 -scale 1.5
```

Genera `home.png` junto al archivo. Las alturas de cada página y el recorte del fondo sobrante se ajustaron a mano para las referencias guardadas; si se regenera, comparar contra `reference/` antes de reemplazar nada.
