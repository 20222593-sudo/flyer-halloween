# Agente Cross 2026 · Cornerstone

Rediseño visual del programa interno **Misión Posible: Agente Cross**. La presentación sigue la estructura, el orden y la paleta del PPT original (6 diapositivas, tipografía Mulish), pero cambia los personajes armados por recursos de inteligencia: tablero de investigación, credencial de agente, red de conexiones y mapa de territorios. El ranking de agentes no va en la presentación: se comunica aparte con el flyer.

## Entregables (`export/`)
- `Agente-Cross-2026.pptx`: presentación de 6 diapositivas en 16:9 (cada diapositiva va como imagen; el texto está en las notas del orador).
- `Agente-Cross-2026.pdf`: la misma presentación en PDF.
- `slides/slide-01…09.png`: diapositivas sueltas (1920 × 1080).
- `Agente-Cross-Ranking.png` / `.pdf`: flyer digital "Ranking de agentes calificados" (1080 px de ancho, @2x).
- `Agente-Cross-Recompensas-A4.png` / `.pdf`: flyer A4 "Tu misión todavía no termina" con los 6 niveles y premios oficiales y el llamado a aprovechar los 3 meses restantes.
- `Agente-Cross-Ranking-A4.png` / `.pdf`: el mismo flyer en una hoja A4 (PNG de 2382 × 3369 px, ≈ 290 dpi, apto para imprimir).

## Fuentes editables
- `presentacion.html`: deck (una `<section class="slide">` por diapositiva).
- `build-pptx.py`: arma el PPTX desde `export/slides/` (`python3 build-pptx.py`, requiere `python-pptx`).
- `flyer-ranking.html`: flyer de ranking (formato digital largo).
- `flyer-ranking-a4.html`: flyer de ranking en A4.
- `flyer-recompensas-a4.html`: flyer de recompensas en A4.
- `agente-cross.css`: sistema visual compartido (colores, sellos, tipografía).
- `render.mjs`: vuelve a exportar todo con `node render.mjs all export` (o `deck`, `flyer`, `a4`, `rewards`) (usa Playwright + Chromium).

Paleta Cornerstone: Navy #0D1427, Blue #004887, Accent #95C9E1 / #D8E8F5, Action Red #CB333B (sellos).
Tipografías: Mulish (presentación, igual que el original), Archivo (titulares condensados), Plus Jakarta Sans (flyer), IBM Plex Mono (códigos y sellos).
