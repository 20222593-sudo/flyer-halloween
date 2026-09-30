// Genera una tarjeta PNG por persona: node aniversarios-octubre/render.js
const { chromium } = require("playwright");
const path = require("path");

const PEOPLE = [
  "oscar-alva", "natalia-marquez", "mayra-quevedo",
  "sandra-valencia", "roberto-pacora", "martin-barrantes",
  "ines-secada", "keyla-huaman", "alexandra-monteverde",
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
  const file = "file://" + path.join(__dirname, "tarjeta.html");
  for (const slug of PEOPLE) {
    await page.goto(`${file}?p=${slug}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.getElementById("photo").complete);
    await page.screenshot({ path: path.join(__dirname, "tarjetas", `aniversario-${slug}.png`) });
    console.log("ok", slug);
  }
  await browser.close();
})();
