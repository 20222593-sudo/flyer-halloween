// Exporta deck y flyer: node render.mjs [deck|flyer|all] [outdir]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'node:path';
const what = process.argv[2] || 'all';
const out = process.argv[3] || '.';
const here = path.dirname(new URL(import.meta.url).pathname);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
if (what === 'deck' || what === 'all') {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(here, 'presentacion.html'));
  await page.evaluate(() => document.fonts.ready);
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) await slides[i].screenshot({ path: path.join(out, `slide-${String(i + 1).padStart(2, '0')}.png`) });
  await page.pdf({ path: path.join(out, 'deck.pdf'), width: '1920px', height: '1080px', printBackground: true, pageRanges: '' });
  console.log('deck', slides.length);
}
if (what === 'flyer' || what === 'all') {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(here, 'flyer-ranking.html'));
  await page.evaluate(() => document.fonts.ready);
  const h = await page.evaluate(() => document.querySelector('.page').getBoundingClientRect().height);
  await page.locator('.page').screenshot({ path: path.join(out, 'flyer.png') });
  await page.pdf({ path: path.join(out, 'flyer.pdf'), width: '1080px', height: Math.ceil(h) + 'px', printBackground: true });
  console.log('flyer', h);
}
if (what === 'a4' || what === 'all') {
  // A4 210 × 297 mm = 794 × 1123 px; PNG a 3x ≈ 290 dpi para impresión
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
  await page.goto('file://' + path.join(here, 'flyer-ranking-a4.html'));
  await page.evaluate(() => document.fonts.ready);
  const over = await page.evaluate(() => { const p = document.querySelector('.page'); const f = document.querySelector('.files').getBoundingClientRect(); const c = document.querySelector('.cta').getBoundingClientRect(); return { gap: Math.round(c.top - f.bottom), scroll: p.scrollHeight }; });
  await page.locator('.page').screenshot({ path: path.join(out, 'flyer-a4.png') });
  await page.pdf({ path: path.join(out, 'flyer-a4.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log('a4', JSON.stringify(over));
}
if (what === 'rewards' || what === 'all') {
  // Flyer de recompensas en A4, mismo tratamiento que el ranking A4
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
  await page.goto('file://' + path.join(here, 'flyer-recompensas-a4.html'));
  await page.evaluate(() => document.fonts.ready);
  const fit = await page.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); return { gap: Math.round(r('.cta').top - r('.moti').bottom), bottom: Math.round(r('.cta').bottom), hero: Math.round(r('.hero').height), prizes: Math.round(r('.prizes').height), cta: Math.round(r('.cta').height) }; });
  await page.locator('.page').screenshot({ path: path.join(out, 'recompensas-a4.png') });
  await page.pdf({ path: path.join(out, 'recompensas-a4.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log('rewards', JSON.stringify(fit));
}
await browser.close();
