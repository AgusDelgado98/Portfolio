# F2 — Header: medición y decisión mobile

Decisión pedida por PLAN-FROZEN v1.1 (sección 13, decisión 8): elegir entre header inline y `MobileNav` **midiendo el layout real**, no por estimación. Este documento registra la medición y el resultado. Implementación: `src/components/layout/SiteHeader.jsx`, `MobileNav.jsx` y `src/styles/shell.css`.

## Qué se midió

El header desktop completo — `AD (+ nombre y rol) | Projects · About · Contact | CV | ES/EN` — renderizado en el navegador integrado (Edge 154), con **textos en español** (los más anchos: "Proyectos", "Sobre mí", "Contacto"). Para cada ancho se forzó el layout inline con un override temporal y se midió el solapamiento entre elementos, el desborde horizontal del header y de la página, y si algo envolvía a una segunda línea.

Anchos de los bloques (px): logo 42 · bloque de marca completo 128–313 (según envuelva el rol) · links 307 · CV 41 · ES/EN 77. Con separaciones y padding del header, el layout inline necesita ≈ 520 px de contenido con solo el logo y ≈ 790 px con el nombre.

| Viewport | Inline con nombre | Inline solo logo |
|---|---|---|
| 320 | desborda y envuelve (header de 125 px) | solapa 91 px |
| 360 | desborda | solapa 71 px |
| 390 | desborda | solapa 56 px |
| 414 | desborda | solapa 44 px |
| 600 | solapa 87 px | cabe |
| 720 | solapa 31 px | cabe |
| 768 | solapa 14 px | cabe |
| 900 | cabe | cabe |
| 1024 | cabe | cabe |

## Decisión: tres modos

| Viewport | Modo |
|---|---|
| ≥ 860 px | Una fila: `AD Agustín Delgado | Projects · About · Contact | CV | ES/EN` |
| 721 – 859 px | Una fila, **sin el texto del nombre** (queda el logo "AD") |
| ≤ 720 px | Barra con marca y botón de menú; los cinco ítems viven en `MobileNav` |

Por qué:

1. **En teléfonos (320–414) el inline no cabe de ninguna forma**, ni siquiera con solo el logo. Menú obligatorio.
2. **El corte está en 720 y no en ~600**, que es donde el inline con logo empezaría a caber. A 601 px el margen es de unos 20 px: un texto más largo, un zoom de texto del navegador o una etiqueta traducida ensancharían los links y el header se rompería sin que nada lo avise. A 721 px el margen es de unos 140 px.
3. **Entre 721 y 859 se esconde el nombre en lugar de pasar a menú**, para que una tablet vertical (768) tenga Projects / About / Contact / CV / ES-EN a un toque. El enlace de marca conserva su nombre accesible con `aria-label="Agustín Delgado — Inicio"`.
4. Descartado: hamburguesa hasta 860 (más simple, pero deja sin navegación visible a las tablets) y hamburguesa siempre (contradice el header mínimo pedido para desktop).

`MobileNav` no depende de hover: se abre con un `<button>` real (`aria-expanded`, `aria-controls`), cada ítem mide 44 px de alto, se cierra al elegir un link o un idioma, y con Escape devuelve el foco al botón. Contiene Projects, About, Contact, CV y ES/EN.

## Resultado final (modo real, sin forzar nada)

Verificado con un chequeo estricto: exactamente uno de {botón de menú, nav inline completo} visible, sin solapamientos, todo dentro del header, una sola fila y sin desborde horizontal de la página.

| Viewport | Modo | Alto del header | Resultado |
|---|---|---|---|
| 320 | menú | 80 px | ok |
| 360 | menú | 80 px | ok |
| 390 | menú | 67 px | ok |
| 414 | menú | 67 px | ok |
| 600 | menú | 67 px | ok |
| 720 | menú | 67 px | ok |
| 721 | inline, sin nombre | 65 px | ok |
| 768 | inline, sin nombre | 65 px | ok |
| 859 | inline, sin nombre | 69 px | ok |
| 860 | inline con nombre | 71 px | ok |
| 900 | inline con nombre | 71 px | ok |
| 901 | inline con nombre | 71 px | ok |
| 1024 | inline con nombre | 71 px | ok |
| 1280 | inline con nombre | 71 px | ok |

## Un defecto encontrado y corregido durante la medición

La primera versión pasaba la medición pero a 768 px **no mostraba ni el nav ni el botón de menú**: las reglas viejas de Atlas (`styles.css` ≤ 768 px y `atlas.css` ≤ 900 px) ocultan `.nav-rail` y `.header-aside` para su propio breakpoint de hamburguesa, y la nueva regla no volvía a mostrarlos. Lo detectó una captura, no la medición (que ignoraba elementos ocultos). Corregido declarando `display: flex` explícito en `shell.css`; la medición pasó a verificar que haya *exactamente un* modo visible, y un test (`architecture.test.js`) fija esa regla en el CSS.

Las reglas viejas del header en `styles.css` / `atlas.css` quedan sin efecto sobre el nuevo header y se eliminan en F7.
