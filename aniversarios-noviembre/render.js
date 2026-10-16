// Genera una tarjeta animada (GIF) y una estática (PNG) por persona:
//   NODE_PATH=$(npm root -g) node aniversarios-noviembre/render.js
// Requiere ffmpeg (FFMPEG=/ruta/a/ffmpeg si no está en el PATH).
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PEOPLE = ["bianca-lozano", "juan-manuel-gutierrez", "ana-lucia-pacheco"];
const FRAMES = 45;          // 3 s a 15 fps, bucle perfecto
const FPS = 15;
const GIF_WIDTH = 700;      // ancho final del GIF (se ve a 600 px en la mayoría de correos)
const FFMPEG = process.env.FFMPEG || "ffmpeg";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
  const file = "file://" + path.join(__dirname, "tarjeta.html");
  const out = path.join(__dirname, "tarjetas");
  for (const slug of PEOPLE) {
    await page.goto(`${file}?p=${slug}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.getElementById("photo").complete);

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "aniv-"));
    for (let i = 0; i < FRAMES; i++) {
      await page.evaluate(t => window.setFrame(t), i / FRAMES);
      await page.screenshot({ path: path.join(tmp, `f${String(i).padStart(3, "0")}.png`) });
    }
    fs.copyFileSync(path.join(tmp, "f000.png"), path.join(out, `aniversario-${slug}.png`));

    const filter =
      `scale=${GIF_WIDTH}:-1:flags=lanczos,split[a][b];` +
      `[a]palettegen=max_colors=256:stats_mode=full[p];` +
      `[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`;
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(tmp, "f%03d.png"),
      "-filter_complex", filter, "-loop", "0", path.join(out, `aniversario-${slug}.gif`)]);
    fs.rmSync(tmp, { recursive: true });
    const kb = Math.round(fs.statSync(path.join(out, `aniversario-${slug}.gif`)).size / 1024);
    console.log("ok", slug, `${kb} KB`);
  }
  await browser.close();
})();
