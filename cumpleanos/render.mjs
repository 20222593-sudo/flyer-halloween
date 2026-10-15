// Genera los GIF de todas las personas en gifs/.
// Si existe fotos/<id>.jpg|jpeg|png (p. ej. fotos/natalia-marquez.jpg) se usa como foto.
// Uso: node build.mjs && node render.mjs   (requiere Playwright)
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
fs.mkdirSync(path.join(dir, 'gifs'), { recursive: true });

const ids = await page.evaluate(() => CS.COLABORADORES.map(p => p.id));
for (const id of ids) {
  const foto = ['jpg', 'jpeg', 'png'].map(e => path.join(dir, 'fotos', `${id}.${e}`)).find(f => fs.existsSync(f));
  const dataUrl = foto ? `data:image/${foto.endsWith('png') ? 'png' : 'jpeg'};base64,${fs.readFileSync(foto).toString('base64')}` : null;
  const b64 = await page.evaluate(async ({ id, dataUrl }) => {
    const p = { ...CS.COLABORADORES.find(x => x.id === id), firma: CS.FIRMA };
    if (dataUrl) p.foto = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = dataUrl; });
    const bytes = await CS.makeGif(p);
    let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }, { id, dataUrl });
  const out = path.join(dir, 'gifs', `cumpleanos-${id}.gif`);
  fs.writeFileSync(out, Buffer.from(b64, 'base64'));
  console.log(`${path.basename(out)}  ${(fs.statSync(out).size / 1048576).toFixed(2)} MB${foto ? '  (con foto)' : ''}`);
}
await browser.close();
