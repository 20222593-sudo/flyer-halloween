# Flyer Halloween · Cornerstone

Flyer corporativo de Halloween (edición sostenible) para colaboradores de Cornerstone.

- `flyer-halloween-cornerstone.png` — versión para pantallas/redes (2400 × 3394 px)
- `flyer-halloween-cornerstone.pdf` — versión para impresión (proporción A4)
- `flyer.html` — archivo fuente editable (abre en el navegador; fuentes y logos en `assets/`)

Paleta: Cornerstone Dark Navy #0D1427, Blue #004887, Blue Accent #95C9E1 y #D8E8F5 (fondo) + acentos Halloween
(calabaza #EE7F35, luna #F2E8D0) y cartón reciclado #C9A77C.
Tipografías: Fraunces (título), Plus Jakarta Sans (texto), Caveat (detalle hecho a mano).

## Aniversarios · Octubre 2026

Tarjetas individuales para enviar por correo a cada colaborador que cumple aniversario (`aniversarios-octubre/`).

- `tarjetas/aniversario-<nombre>.png` — una imagen por persona (1200 × 1500 px), lista para adjuntar o insertar en el correo
- `tarjeta.html` — plantilla (datos de cada persona al final del archivo; se abre con `?p=<nombre>`)
- `fotos/` — retratos recortados del flyer mensual
- `render.js` — regenera todas las tarjetas: `NODE_PATH=$(npm root -g) node aniversarios-octubre/render.js`

El mensaje cambia según los años: 1 año, de 2 a 4 años, de 5 a 7 años y 8 años o más.
