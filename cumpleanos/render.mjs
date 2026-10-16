// Genera los GIF de todas las personas en gifs/.
// Si existe fotos/<id>.jpg|jpeg|png (p. ej. fotos/natalia-marquez.jpg) se usa como foto.
// Encuadre opcional por persona en fotos/encuadre.json: { "<id>": { "zoom": 1.5, "ox": 0, "oy": -0.5 } }
// Uso: node build.mjs && node render.mjs [--mes diciembre] [--out carpeta]   (requiere Playwright)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(path.join(process.execPath, '../../lib/node_modules/playwright')); }

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await playwright.chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(dir, 'generador.html'));
await page.evaluate(() => CS.loadAssets());
const oi = process.argv.indexOf('--out');
const outDir = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(dir, 'gifs');
fs.mkdirSync(outDir, { recursive: true });
const encFile = path.join(dir, 'fotos', 'encuadre.json');
const encuadre = fs.existsSync(encFile) ? JSON.parse(fs.readFileSync(encFile, 'utf8')) : {};

const mi = process.argv.indexOf('--mes');
const soloMes = mi > 0 ? process.argv[mi + 1] : null;
const ids = await page.evaluate(m => CS.COLABORADORES.filter(p => !m || p.mes === m).map(p => p.id), soloMes);
for (const id of ids) {
  const foto = ['jpg', 'jpeg', 'png'].map(e => path.join(dir, 'fotos', `${id}.${e}`)).find(f => fs.existsSync(f));
  const dataUrl = foto ? `data:image/${foto.endsWith('png') ? 'png' : 'jpeg'};base64,${fs.readFileSync(foto).toString('base64')}` : null;
  const b64 = await page.evaluate(async ({ id, dataUrl, enc }) => {
    const p = { ...CS.COLABORADORES.find(x => x.id === id), firma: CS.FIRMA, ...enc };
    if (dataUrl) p.foto = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = dataUrl; });
    const bytes = await CS.makeGif(p);
    let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }, { id, dataUrl, enc: encuadre[id] || {} });
  const out = path.join(outDir, `cumpleanos-${id}.gif`);
  fs.writeFileSync(out, Buffer.from(b64, 'base64'));
  console.log(`${path.basename(out)}  ${(fs.statSync(out).size / 1048576).toFixed(2)} MB${foto ? '  (con foto)' : ''}`);
}
await browser.close();
