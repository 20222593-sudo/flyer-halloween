// Arma generador.html como un solo archivo (fuentes, logos y scripts embebidos).
// Uso: node build.mjs [--artifact ruta.html]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const A = p => path.join(dir, '..', 'assets', p);
const b64 = (p, mime) => `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
const assets = {
  fraunces: b64(A('fonts/fraunces.woff2'), 'font/woff2'),
  jakarta: b64(A('fonts/plus-jakarta-sans.woff2'), 'font/woff2'),
  caveat: b64(A('fonts/caveat.woff2'), 'font/woff2'),
  logo: b64(A('logo-cornerstone-horizontal.png'), 'image/png'),
  simbolo: b64(A('simbolo-cornerstone.png'), 'image/png'),
};
const scripts = {
  'assets.js': `window.CS_ASSETS = ${JSON.stringify(assets)};`,
  'gif.js': fs.readFileSync(path.join(dir, 'src/gif.js'), 'utf8'),
  'tarjeta.js': fs.readFileSync(path.join(dir, 'src/tarjeta.js'), 'utf8'),
};
let body = fs.readFileSync(path.join(dir, 'src/generador.html'), 'utf8');
for (const [name, code] of Object.entries(scripts)) {
  body = body.replace(`<script src="${name}"></script>`, () => `<script>\n${code}\n</script>`);
}
const full = `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${body.replace(/\n<div class="wrap">/, '\n</head>\n<body>\n<div class="wrap">')}\n</body>\n</html>\n`;
fs.writeFileSync(path.join(dir, 'generador.html'), full);
const i = process.argv.indexOf('--artifact');
if (i > 0) fs.writeFileSync(process.argv[i + 1], body);
console.log('generador.html listo');
