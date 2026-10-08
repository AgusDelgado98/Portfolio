# Portfolio — Agustín Delgado

Portfolio de **Data Analyst**. El sitio presenta el perfil, los proyectos y la evidencia reproducible. El idioma de la interfaz es español o inglés.

Actualmente trabajo como **Data Analyst | Healthcare Analytics** dentro de un equipo de cinco personas que da soporte analítico a una red privada de consultorios médicos en Buenos Aires (desde marzo de 2024). Antes trabajé tres años en administración y operaciones de consultorio médico. El perfil publicado en el sitio sale de `src/i18n/messages/profileExperience.js`.

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

Visibles: PROVIDENTIA, Caelum Health Analytics, ALETHEIA, Paradigm, Soma, Tekmérion, LumenVox y ClarusFlow. Hogares y Kairós están en el registro pero ocultos (`hidden: true`).

Los case studies publicados son:

- Paradigm — no-show y riesgo operativo
- PROVIDENTIA — demand forecasting, capacity decision y policy decision
- ALETHEIA — investigación guiada por evidencia, con una sección de research y un enlace al sitio público (`ALETHEIA_WEB_URL` en `src/constants/links.js`)

## Stack del sitio

- React 18
- Vite 5
- CSS propio, sin framework de UI
- i18n ES/EN en el cliente

## Rendimiento

El JavaScript inicial de Home se mide con gzip nivel 9 y debe quedar en 110 KB o menos. Los case studies no entran en ese total: se piden al abrir el caso. El detalle del baseline y de la auditoría está en `docs/redesign/`.

## CV

Hay un único CV oficial, en inglés (septiembre de 2026). Todos los botones de descarga usan `CV_HREF` (`src/i18n/config.js`): `/cv/Agustin-Delgado-2026.pdf`, que se descarga como «Agustín Delgado 2026.pdf».

- `public/cv/Agustin-Delgado-2026.pdf`: el archivo estático.
- `api/cv.js` y `api/cv-data/chunk1…7.js`: función de Vercel que reconstruye el PDF desde su payload base64 y verifica su SHA de blob de git antes de servirlo.
- `vercel.json`: reescribe `/cv/Agustin-Delgado-2026.pdf` a `/api/cv` y redirige la ruta anterior `/cv/Agustin_Delgado_CV_EN.pdf` a la nueva.
- `public/cv/README.txt`: nombre y rutas del CV.

## Comandos

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Enlaces

- Portfolio: https://portfolio-me-f104.vercel.app
- LinkedIn: Agustín Delgado
- GitHub: [AgusDelgado98](https://github.com/AgusDelgado98)

## Licencia

© 2026 Agustín Delgado. Todos los derechos reservados.
