# Cumpleaños · Cornerstone

Tarjetas de cumpleaños animadas (GIF) con la marca Cornerstone, listas para enviar por Gmail.

- `generador.html` — ábrelo en el navegador: eliges a la persona, subes su foto (con zoom y encuadre),
  editas nombre, fecha, mensaje y firma, ves la animación y descargas el GIF. También arma el asunto y
  el cuerpo del correo para copiar.
- `gifs/` — GIF ya generados para los cumpleañeros de noviembre 2026 (con iniciales en lugar de foto).
- `fotos/` — si guardas aquí `<id>.jpg` (p. ej. `natalia-marquez.jpg`) y corres `node render.mjs`,
  se regeneran todos los GIF con sus fotos.
- `src/` — fuentes: `tarjeta.js` (diseño, datos y mensajes), `gif.js` (codificador GIF), `generador.html` (interfaz).
  Después de editar, corre `node build.mjs` para volver a armar `generador.html`.

Ids: natalia-marquez, michele-montalbetti, francesca-huaman, gabriela-echeandia, adriana-lopez,
katherine-garcia, nicole-tovar.

## Enviar por Gmail

1. Redactar → pega asunto y cuerpo.
2. Ícono **Insertar foto** → **Subir** → elige el GIF con la opción **En línea** (si va como adjunto no se anima).
3. Envía. El GIF mide 600 × 860 px, pesa ~1 MB y repite en bucle de 3,6 s.

Gmail no ejecuta animaciones CSS ni JavaScript dentro del correo; por eso el movimiento va en el GIF.
