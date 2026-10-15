/* Codificador GIF animado, sin dependencias.
   - Paleta global (median cut) + colores de marca forzados.
   - Tramado ordenado (Bayer 4×4) para suavizar degradados sin "ruido" entre cuadros.
   - Cada cuadro guarda solo los píxeles que cambian (transparencia + recorte),
     así el archivo pesa poco y Gmail lo carga rápido. */
(function (global) {
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v / 16 - 0.47) * 10);
  const TRANSP = 255;

  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }

  function medianCut(samples, maxColors) {
    const n = samples.length / 3;
    let boxes = [mkBox(Uint32Array.from({ length: n }, (_, i) => i))];
    function mkBox(idx) {
      let lo = [255, 255, 255], hi = [0, 0, 0];
      for (const i of idx) for (let c = 0; c < 3; c++) {
        const v = samples[i * 3 + c]; if (v < lo[c]) lo[c] = v; if (v > hi[c]) hi[c] = v;
      }
      const r = [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]];
      const ch = r[0] >= r[1] && r[0] >= r[2] ? 0 : r[1] >= r[2] ? 1 : 2;
      return { idx, ch, range: r[ch], score: r[ch] * Math.sqrt(idx.length) };
    }
    while (boxes.length < maxColors) {
      let bi = -1, best = 0;
      boxes.forEach((b, i) => { if (b.idx.length > 1 && b.range > 0 && b.score > best) { best = b.score; bi = i; } });
      if (bi < 0) break;
      const b = boxes[bi], ch = b.ch;
      const sorted = Array.from(b.idx).sort((x, y) => samples[x * 3 + ch] - samples[y * 3 + ch]);
      const mid = sorted.length >> 1;
      boxes.splice(bi, 1, mkBox(Uint32Array.from(sorted.slice(0, mid))), mkBox(Uint32Array.from(sorted.slice(mid))));
    }
    return boxes.map(b => {
      let r = 0, g = 0, bl = 0;
      for (const i of b.idx) { r += samples[i * 3]; g += samples[i * 3 + 1]; bl += samples[i * 3 + 2]; }
      const k = b.idx.length; return [Math.round(r / k), Math.round(g / k), Math.round(bl / k)];
    });
  }

  function lzw(pix, mcs, out) {
    const clear = 1 << mcs, eoi = clear + 1;
    let size = mcs + 1, next = eoi + 1, dict = new Map();
    const bytes = []; let cur = 0, nbits = 0;
    const emit = c => { cur |= c << nbits; nbits += size; while (nbits >= 8) { bytes.push(cur & 255); cur >>>= 8; nbits -= 8; } };
    emit(clear);
    let prefix = pix[0];
    for (let i = 1; i < pix.length; i++) {
      const k = pix[i], key = prefix * 256 + k, v = dict.get(key);
      if (v !== undefined) { prefix = v; continue; }
      emit(prefix);
      if (next === 4096) { emit(clear); dict = new Map(); size = mcs + 1; next = eoi + 1; }
      else { if (next >= (1 << size)) size++; dict.set(key, next++); }
      prefix = k;
    }
    emit(prefix); emit(eoi);
    if (nbits > 0) bytes.push(cur & 255);
    out.push(mcs);
    for (let i = 0; i < bytes.length; i += 255) {
      const len = Math.min(255, bytes.length - i); out.push(len);
      for (let j = 0; j < len; j++) out.push(bytes[i + j]);
    }
    out.push(0);
  }

  /* opts: { width, height, frames, delay (centésimas de s), render(i) → Uint8ClampedArray RGBA,
             fixedColors: ['#hex'], onProgress(p) }  → Promise<Uint8Array> */
  async function encode(opts) {
    const { width: W, height: H, frames: N, delay, render, onProgress } = opts;
    const fixed = (opts.fixedColors || []).map(hexToRgb);
    const tick = () => new Promise(r => setTimeout(r, 0));

    // 1 · paleta a partir de cuadros de muestra
    const sampleFrames = [0, N >> 2, N >> 1, (3 * N) >> 2];
    const step = 5, samples = [];
    for (const f of sampleFrames) {
      const d = render(f);
      for (let p = 0; p < W * H; p += step) samples.push(d[p * 4], d[p * 4 + 1], d[p * 4 + 2]);
      await tick();
    }
    const palette = fixed.concat(medianCut(Uint8Array.from(samples), 255 - fixed.length)).slice(0, 255);
    while (palette.length < 256) palette.push([0, 0, 0]);

    const lut = new Int16Array(1 << 18).fill(-1);
    function nearest(r, g, b) {
      const key = ((r >> 2) << 12) | ((g >> 2) << 6) | (b >> 2);
      let v = lut[key];
      if (v >= 0) return v;
      let best = 1e9;
      for (let i = 0; i < 255; i++) {
        const p = palette[i], dr = p[0] - r, dg = p[1] - g, db = p[2] - b;
        const d = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
        if (d < best) { best = d; v = i; }
      }
      lut[key] = v; return v;
    }

    const out = [];
    const str = s => { for (const ch of s) out.push(ch.charCodeAt(0)); };
    const u16 = v => out.push(v & 255, (v >> 8) & 255);
    str('GIF89a'); u16(W); u16(H); out.push(0xF7, 0, 0);
    for (const c of palette) out.push(c[0], c[1], c[2]);
    out.push(0x21, 0xFF, 11); str('NETSCAPE2.0'); out.push(3, 1, 0, 0, 0);

    let prev = null;
    for (let f = 0; f < N; f++) {
      const d = render(f);
      const idx = new Uint8Array(W * H);
      for (let y = 0; y < H; y++) {
        const row = (y & 3) * 4;
        for (let x = 0; x < W; x++) {
          const p = y * W + x, o = p * 4, t = BAYER[row + (x & 3)];
          const r = Math.max(0, Math.min(255, d[o] + t)), g = Math.max(0, Math.min(255, d[o + 1] + t)), b = Math.max(0, Math.min(255, d[o + 2] + t));
          idx[p] = nearest(r | 0, g | 0, b | 0);
        }
      }
      let x0 = 0, y0 = 0, x1 = W - 1, y1 = H - 1, pix = idx;
      if (prev) {
        x0 = W; y0 = H; x1 = -1; y1 = -1;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const p = y * W + x;
          if (idx[p] !== prev[p]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        }
        if (x1 < 0) { x0 = y0 = x1 = y1 = 0; }
        const w = x1 - x0 + 1, h = y1 - y0 + 1;
        pix = new Uint8Array(w * h);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const p = (y + y0) * W + x + x0;
          pix[y * w + x] = idx[p] === prev[p] ? TRANSP : idx[p];
        }
      }
      // Graphic Control Extension: no desechar (1), transparencia activa
      out.push(0x21, 0xF9, 4, (1 << 2) | 1); u16(delay); out.push(TRANSP, 0);
      out.push(0x2C); u16(x0); u16(y0); u16(x1 - x0 + 1); u16(y1 - y0 + 1); out.push(0);
      lzw(pix, 8, out);
      prev = idx;
      if (onProgress) onProgress((f + 1) / N);
      await tick();
    }
    out.push(0x3B);
    return Uint8Array.from(out);
  }

  global.CSGif = { encode };
})(typeof window !== 'undefined' ? window : globalThis);
