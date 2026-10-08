# Portfolio — Agustín Delgado

Portfolio de **Data Analyst**. El sitio presenta el perfil, los proyectos y la evidencia reproducible. El idioma de la interfaz es español o inglés.

## Arquitectura

Aplicación de una sola página (React 18, Vite). La navegación es por hash.

| Ruta | Qué muestra |
| --- | --- |
| `#home` | Portada |
| `#projects` | Índice de proyectos |
| `#projects/<id>` | Ficha de un proyecto |
| `#projects/<proyecto>/<caso>` | Case study del proyecto |
| `#about` | Perfil, método, habilidades, formación y experiencia |
| `#contact` | Contacto |

Los seis case studies se cargan bajo demanda, cada uno en su propio chunk. El resto de las rutas (Home, Projects, fichas, About, Contact) forma el JavaScript inicial. Las URLs antiguas (`#casework`, `#proyectos`, `#portada`, `#contacto`, `#stack`, `#data-bi`, `#operations`, `#enfoque`, `#formacion`, `#engineering-log`) siguen resolviendo y se normalizan a la ruta canónica.

## Proyectos

PROVIDENTIA, Caelum Health Analytics, Paradigm, Soma, Hogares, Tekmérion, Kairós, ClarusFlow, LumenVox y ALETHEIA.

Los case studies publicados son:

- Paradigm — no-show y riesgo operativo
- PROVIDENTIA — demand forecasting, capacity decision y policy decision
- ALETHEIA — comparabilidad de fuentes públicas, con una sección de research

## Stack del sitio

- React 18
- Vite 5
- CSS propio, sin framework de UI
- i18n ES/EN en el cliente

## Rendimiento

El JavaScript inicial de Home se mide con gzip nivel 9 y debe quedar en 110 KB o menos. Los case studies no entran en ese total: se piden al abrir el caso. El detalle del baseline y de la auditoría está en `docs/redesign/`.

## Comandos

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Licencia

© 2026 Agustín Delgado. Todos los derechos reservados.
