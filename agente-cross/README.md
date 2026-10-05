# Agente Cross 2026 · Cornerstone

Rediseño visual del programa interno **Misión Posible: Agente Cross** (concepto: expediente confidencial + centro de inteligencia + gamificación corporativa, sin elementos bélicos).

## Entregables (`export/`)
- `Agente-Cross-2026.pptx`: presentación de 9 diapositivas en 16:9 (cada diapositiva va como imagen; el texto está en las notas del orador).
- `Agente-Cross-2026.pdf`: la misma presentación en PDF.
- `slides/slide-01…09.png`: diapositivas sueltas (1920 × 1080).
- `Agente-Cross-Ranking.png` / `.pdf`: flyer digital "Ranking de agentes calificados" (1080 px de ancho, @2x).

## Fuentes editables
- `presentacion.html`: deck (una `<section class="slide">` por diapositiva).
- `flyer-ranking.html`: flyer de ranking.
- `agente-cross.css`: sistema visual compartido (colores, sellos, tipografía).
- `render.mjs`: vuelve a exportar todo con `node render.mjs all export` (usa Playwright + Chromium).

Paleta Cornerstone: Navy #0D1427, Blue #004887, Accent #95C9E1 / #D8E8F5, Action Red #CB333B (sellos).
Tipografías: Archivo (titulares condensados), Plus Jakarta Sans (texto), IBM Plex Mono (códigos de operación).
