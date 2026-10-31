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

Los proyectos se presentan en dos grupos (`group` en `src/projects/registry.js`):

- **Vinculados a mi trabajo**, en este orden: PARADIGM, PROVIDENTIA y SOMA. Cada ficha separa el uso profesional declarado de la demostración pública, que se construye con datos sintéticos (PARADIGM), públicos (PROVIDENTIA, StatsWales) o ficticios (SOMA, con una vista previa en video).
- **Personales**: Caelum Health Analytics, ALETHEIA, Tekmérion, LumenVox y ClarusFlow.

Hogares y Kairós están en el registro pero ocultos (`hidden: true`). El portfolio no enlaza la aplicación profesional de SOMA.

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

Hay un único CV oficial, en inglés (octubre de 2026; diseño azul suave, una página, «Data Analyst | Business Intelligence | Data Operations»). Todos los botones de descarga (Hero, cabecera, Contacto, pie y «Sobre mí») usan `CV_HREF` (`src/i18n/config.js`): `/cv/Agustin-Delgado-2026.pdf`, que se descarga como «Agustín Delgado 2026.pdf». El destino es el mismo en español y en inglés.

- `public/cv/Agustin-Delgado-2026.pdf`: el archivo estático. `public/cv/Agustin_Delgado_CV_EN.pdf` es una copia idéntica de la ruta anterior.
- `api/cv.js` y `api/cv-data/chunk1…7.js`: función de Vercel que reconstruye el PDF desde su payload base64 y verifica su SHA de blob de git antes de servirlo.
- `vercel.json`: reescribe `/cv/Agustin-Delgado-2026.pdf` a `/api/cv` y redirige la ruta anterior `/cv/Agustin_Delgado_CV_EN.pdf` a la nueva.
- `public/cv/README.txt`: nombre y rutas del CV.
- `scripts/build-cv-payload.mjs`: al reemplazar el PDF, regenera los fragmentos y la huella (`node scripts/build-cv-payload.mjs`). `src/cv.test.js` comprueba que el archivo estático, la entrega de `/api/cv` y la huella coinciden.

## Dominio, SEO y acceso público

La URL canónica es `https://portfolio-me-f104.vercel.app/`. Las rutas son fragmentos (`#projects`, `#about/skills`…) del mismo documento, así que hay una sola URL indexable.

- `index.html`: `<link rel="canonical">`, `og:url`, `og:image` y `twitter:image` (imagen social 1200×630 en `public/og/og-default.png`) apuntan a esa URL.
- `public/robots.txt` permite todo y declara el sitemap; `public/sitemap.xml` lista únicamente la URL canónica. `src/seo.test.js` lo comprueba.
- Ninguna ruta pública pide autenticación propia: no hay login, y el portfolio no enlaza la aplicación profesional de SOMA.
- **Vercel Authentication.** La configuración deseada del proyecto `portfolio` es `ssoProtection.deploymentType = "preview"`: producción pública y vistas previas protegidas. Hoy el valor es `all_except_custom_domains`, que protege también el dominio `*.vercel.app` de producción (responde 302 a `vercel.com/sso-api`, incluidos `robots.txt`, la imagen social y el CV). El cambio se hace en la configuración del proyecto en Vercel (Deployment Protection → Vercel Authentication) o con la API del proyecto; no forma parte de este repositorio y se aplica solo con autorización expresa, después de publicar. Si el dominio canónico cambia, hay que actualizar `index.html`, `public/robots.txt`, `public/sitemap.xml`, los hipervínculos del CV (se regeneran con el PDF) y `src/seo.test.js`.

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
