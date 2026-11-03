# F12 — Integración, CLS About y Pull Request

**Veredicto para producción: APTO** (merge y deploy a producción requieren autorización posterior explícita).

## 1. Corrección CLS About

### Diagnóstico
1. El CSS de About diferido **contribuía**, pero no era el único factor.
2. El golpe dominante (~0,92 del CLS de Lighthouse) era `main#main-content` creciendo al sustituir el fallback de Suspense por la página completa en frío a `#about`.
3. Navegación interna con prefetch ya mitigaba el síntoma; el acceso directo en frío lo exponía.

### Corrección mínima
- `about.css` pasa al CSS de entry (JS de About sigue diferido).
- `CaseShell` (y su CSS) pasa a lazy para compensar presupuesto CSS.
- `main.jsx` hace `await loadAbout()` antes del primer paint si el hash es `#about`.
- `AboutView` renderiza el módulo ya resuelto **sin Suspense** en ese caso; fallback con altura reservada solo para navegación interna.
- Prefetch `loadAbout()` en hover/focus del nav y en `hashchange`.

### Validación
| Medición | Resultado |
| --- | --- |
| Observado CDP frío + interno @390/1440 (3 corridas c/u) | CLS mediana **0** (`f12/cls-about.json`) |
| Lighthouse móvil simulado `#about` (3 corridas) | CLS mediana **0,027** (solo swap tipográfico en `<em>`); Perf mediana 97 |

Umbral de aceptación interno: CLS ≤ 0,1. **Cumplido.** Tipografía y composición sin cambios. Presupuestos sin ampliar tolerancias.

## 2. Pruebas y build finales

- `npm test`: **423 / 423**
- `npm run build`: OK
- Presupuestos: ver §3
- DECERNO: sigue retenido (F7 no ejecutada)

## 3. Presupuestos (build F12)

| Métrica | Valor | Límite | Margen |
| --- | --- | --- | --- |
| JS inicial gzip -9 | 104.194 | 104.906 | +712 |
| CSS inicial gzip -9 | 12.687 | 13.014 | +327 |
| Fuentes totales | 208.512 | 210.000 | +1.488 |

## 4. Git / PR

- Rama: `design/superficie-de-decision`
- Último commit: `a4f542fa49ac013956ec7fdb555f97298ef50db6`
- PR → `main`, sin merge automático
- Preview de PR permitida; sin promoción a producción ni cambio de dominio

## 5. Pendientes (no bloquean F12)

- Excepción tipográfica 115 KB (documentada; sin cambiar tipografía).
- Safari iOS / lector de pantalla reales.
- Analítica de campo (post-publicación).
- CLS residual ~0,03 por `font-display: swap` en el titular (aceptable).

## 6. Recomendación

**APTO para merge a `main` y publicación** cuando el titular autorice explícitamente tras revisar la preview. No mergear desde este informe.
