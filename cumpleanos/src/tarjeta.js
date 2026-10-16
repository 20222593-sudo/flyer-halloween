/* Tarjeta de cumpleaños Cornerstone — se dibuja en canvas, cuadro a cuadro.
   drawCard(ctx, t, persona) con t ∈ [0, 1): la animación cierra en bucle perfecto. */
(function (global) {
  const W = 600, H = 860;
  const C = {
    navy: '#0D1427', blue: '#004887', blue2: '#95C9E1', blue3: '#D8E8F5',
    gray: '#E3E3E3', red: '#CB333B', white: '#FFFFFF',
  };
  const PANEL = { x: 24, y: 80, w: 552, h: 756, r: 30 };
  const PHOTO = { x: 300, y: 262, r: 106 };
  const F = { display: '"CS Fraunces", Georgia, serif', body: '"CS Jakarta", "Segoe UI", sans-serif', hand: '"CS Caveat", cursive' };
  const TAU = Math.PI * 2;

  const FIRMA = 'Con cariño, tu familia Cornerstone';

  const COLABORADORES = [
    { id: 'anite-angulo', mes: 'octubre', nombre: 'Anité', completo: 'Anité Angulo', fecha: 'Lunes 19 de octubre',
      mensaje: 'Tu profesionalismo y tu sonrisa hacen que cada día en la oficina sea mejor. Que este nuevo año de vida te traiga mucha felicidad, nuevos retos y grandes satisfacciones.' },
    { id: 'natalia-marquez', nombre: 'Natalia', completo: 'Natalia Consuelo Marquez', mes: 'noviembre', fecha: 'Domingo 01 de noviembre',
      mensaje: 'Gracias por tu calidez y por la energía que contagias cada día. Que este nuevo año te traiga proyectos que te ilusionen y muchos motivos para sonreír.' },
    { id: 'michele-montalbetti', nombre: 'Michele', completo: 'Michele Montalbetti', mes: 'noviembre', fecha: 'Martes 03 de noviembre',
      mensaje: 'Tu compromiso y tu buena disposición hacen la diferencia en el equipo. ¡Celebra a lo grande y que este año venga lleno de logros y alegrías!' },
    { id: 'francesca-huaman', nombre: 'Francesca', completo: 'Francesca Huaman', mes: 'noviembre', fecha: 'Jueves 05 de noviembre',
      mensaje: 'Gracias por tu dedicación y por esa sonrisa que ilumina la oficina. Te deseamos un año lleno de salud, aprendizajes y momentos inolvidables.' },
    { id: 'gabriela-echeandia', nombre: 'Gabriela', completo: 'Gabriela Echeandía', mes: 'noviembre', fecha: 'Domingo 15 de noviembre',
      mensaje: 'Admiramos tu talento y la pasión que pones en todo lo que haces. Que este día sea tan especial como tú y que este año se cumplan tus grandes sueños.' },
    { id: 'adriana-lopez', nombre: 'Adriana', completo: 'Adriana López', mes: 'noviembre', fecha: 'Viernes 20 de noviembre',
      mensaje: 'Tu actitud positiva y tu espíritu de equipo nos inspiran. Que este nuevo año de vida te regale nuevas metas, abrazos sinceros y mucha felicidad.' },
    { id: 'katherine-garcia', nombre: 'Estefanía', completo: 'Katherine Estefanía García', mes: 'noviembre', fecha: 'Domingo 22 de noviembre',
      mensaje: 'Gracias por tu entrega y por hacer que cada reto parezca posible. Te deseamos un cumpleaños increíble y un año lleno de bendiciones y éxitos.' },
    { id: 'nicole-tovar', nombre: 'Nicole', completo: 'Nicole Tovar', mes: 'noviembre', fecha: 'Martes 24 de noviembre',
      mensaje: 'Tu creatividad y tu entusiasmo le dan un brillo especial a Cornerstone. ¡Disfruta tu día al máximo y que este año te sorprenda con lo mejor!' },
    { id: 'martin-barrantes', mes: 'diciembre', nombre: 'Martín', completo: 'Martín Jesús Barrantes', fecha: 'Martes 01 de diciembre',
      mensaje: 'Abres diciembre con la mejor noticia: ¡tu cumpleaños! Gracias por tu compromiso y tu buena energía. Que este nuevo año te traiga salud, logros y mucha alegría.' },
    { id: 'patricia-espinoza', mes: 'diciembre', nombre: 'Patricia', completo: 'Patricia Espinoza', fecha: 'Domingo 06 de diciembre',
      mensaje: 'Gracias por tu experiencia y por la calidez con la que acompañas al equipo. Que este día esté lleno de cariño y que el año que empieza te regale grandes momentos.' },
    { id: 'andrea-yauri', mes: 'diciembre', nombre: 'Andrea', completo: 'Andrea Sofía Yauri', fecha: 'Domingo 06 de diciembre',
      mensaje: 'Tu alegría y tus ganas de aprender contagian a todos a tu alrededor. ¡Celebra a lo grande y que este nuevo año te traiga muchos sueños cumplidos!' },
    { id: 'diego-cubas', mes: 'diciembre', nombre: 'Diego', completo: 'Diego Alonso Cubas', fecha: 'Sábado 19 de diciembre',
      mensaje: 'Gracias por tu dedicación y por tu disposición para dar siempre una mano. Te deseamos un cumpleaños increíble y un año lleno de éxitos y nuevas metas.' },
    { id: 'sabrina-tryon', mes: 'diciembre', nombre: 'Sabrina', completo: 'Sabrina Tryon', fecha: 'Sábado 19 de diciembre',
      mensaje: 'Tu creatividad y tu energía le dan un toque especial a cada proyecto. Que este nuevo año de vida venga cargado de alegrías, aprendizajes y momentos inolvidables.' },
    { id: 'oscar-alva', mes: 'diciembre', nombre: 'Oscar', completo: 'Oscar Santiago Jesús Alva', fecha: 'Lunes 21 de diciembre',
      mensaje: 'Gracias por tu esfuerzo y por la confianza que transmites en cada tarea. Que cierres el año celebrando en grande y que lo que viene esté lleno de bendiciones.' },
  ];

  /* ── recursos (fuentes y logos embebidos en CS_ASSETS) ── */
  const assets = { logo: null, simbolo: null, ready: null };
  function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
  function loadAssets() {
    if (assets.ready) return assets.ready;
    const A = global.CS_ASSETS;
    const faces = [
      new FontFace('CS Fraunces', `url(${A.fraunces})`, { weight: '100 900' }),
      new FontFace('CS Jakarta', `url(${A.jakarta})`, { weight: '200 800' }),
      new FontFace('CS Caveat', `url(${A.caveat})`, { weight: '400 700' }),
    ];
    assets.ready = Promise.all([
      ...faces.map(f => f.load().then(ff => document.fonts.add(ff))),
      loadImg(A.logo).then(i => (assets.logo = i)),
      loadImg(A.simbolo).then(i => (assets.simbolo = i)),
    ]);
    return assets.ready;
  }

  /* ── utilidades ── */
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function spacing(ctx, v) { if ('letterSpacing' in ctx) ctx.letterSpacing = v; }
  function wrap(ctx, text, maxW) {
    const words = text.split(/\s+/).filter(Boolean), lines = []; let line = '';
    for (const w of words) { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test; }
    if (line) lines.push(line); return lines;
  }
  function sparkle(ctx, x, y, s, color) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.beginPath();
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; ctx.quadraticCurveTo(0, 0, Math.cos(a) * s, Math.sin(a) * s); ctx.quadraticCurveTo(0, 0, Math.cos(a + Math.PI / 4) * s * .18, Math.sin(a + Math.PI / 4) * s * .18); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function initials(p) { const parts = (p.completo || p.nombre).trim().split(/\s+/); return ((parts[0] || '')[0] + ((parts.length > 2 ? parts[parts.length - 1] : parts[1]) || '')[0]).toUpperCase(); }

  /* ── confeti: cada pieza recorre el panel exactamente una vez por bucle ── */
  const CONFETI = (() => {
    const r = rng(11), cols = [C.blue2, C.white, C.blue3, C.blue2, C.white, C.red, '#5FA8D3'];
    return Array.from({ length: 64 }, (_, i) => ({
      x: PANEL.x + 14 + r() * (PANEL.w - 28), ph: r(), ph2: r(), ph3: r(),
      amp: 6 + r() * 16, sway: 1 + Math.floor(r() * 2), spin: 1 + Math.floor(r() * 3),
      size: 6 + r() * 6, shape: i % 3, color: cols[Math.floor(r() * cols.length)], rot: r() * TAU,
    }));
  })();
  const ESTRELLAS = [[70, 130, 9], [532, 120, 7], [118, 400, 6], [486, 392, 8], [60, 610, 6], [540, 640, 7], [210, 120, 5], [394, 132, 6], [96, 760, 7], [508, 770, 6]];
  const GLOBOS = [
    { x: 76, y: 215, c: C.blue2, s: 1, ph: 0 }, { x: 122, y: 268, c: C.red, s: .82, ph: .33 }, { x: 58, y: 300, c: '#2E6FA8', s: .9, ph: .6 },
    { x: 526, y: 220, c: C.white, s: .95, ph: .15 }, { x: 480, y: 272, c: C.blue2, s: .8, ph: .5 }, { x: 544, y: 305, c: '#2E6FA8', s: .88, ph: .8 },
  ];

  function bunting(ctx, x0, x1, y, sag, t, colors) {
    const n = colors.length, sway = Math.sin(TAU * t) * 3;
    const pt = u => [x0 + (x1 - x0) * u, y + 4 * sag * u * (1 - u) + sway * 4 * u * (1 - u)];
    ctx.strokeStyle = 'rgba(216,232,245,.5)'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const [px, py] = pt(i / 20); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
    colors.forEach((c, i) => {
      const u0 = (i + .15) / n, u1 = (i + .85) / n, [ax, ay] = pt(u0), [bx, by] = pt(u1);
      const flap = Math.sin(TAU * (t + i * .17)) * 2.5;
      ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
      ctx.lineTo((ax + bx) / 2 + flap, (ay + by) / 2 + 22); ctx.closePath(); ctx.fill();
    });
  }

  function balloon(ctx, b, t) {
    const bob = Math.sin(TAU * (t + b.ph)) * 7, tilt = Math.sin(TAU * (t + b.ph + .25)) * .06;
    const rx = 25 * b.s, ry = 31 * b.s, x = b.x, y = b.y + bob;
    // cuerda
    ctx.save(); ctx.strokeStyle = 'rgba(216,232,245,.45)'; ctx.lineWidth = 1.2; ctx.beginPath();
    ctx.moveTo(x, y + ry + 4);
    const sw = Math.sin(TAU * (t + b.ph)) * 6;
    ctx.bezierCurveTo(x + 8 + sw, y + ry + 34, x - 8 - sw, y + ry + 60, x + sw * .5, y + ry + 92 - bob);
    ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
    const g = ctx.createRadialGradient(-rx * .35, -ry * .4, 2, 0, 0, ry * 1.1);
    g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.35, b.c); g.addColorStop(1, b.c);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = .18; ctx.fillStyle = C.navy; ctx.beginPath(); ctx.ellipse(rx * .25, ry * .2, rx * .75, ry * .8, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = b.c; ctx.beginPath(); ctx.moveTo(-4, ry - 1); ctx.lineTo(4, ry - 1); ctx.lineTo(0, ry + 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.ellipse(-rx * .38, -ry * .42, rx * .14, ry * .22, -.5, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawPhoto(ctx, p, t) {
    const { x, y, r } = PHOTO;
    // halo
    const halo = ctx.createRadialGradient(x, y, r * .6, x, y, r * 1.75);
    halo.addColorStop(0, 'rgba(149,201,225,.35)'); halo.addColorStop(1, 'rgba(149,201,225,0)');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, r * 1.75, 0, TAU); ctx.fill();
    // anillo punteado que gira (avanza 2 periodos de guion por bucle)
    const N = 36;
    ctx.save(); ctx.translate(x, y); ctx.rotate(TAU / N * 2 * t);
    ctx.strokeStyle = C.blue2; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.setLineDash([2, TAU * (r + 16) / N - 2]);
    ctx.beginPath(); ctx.arc(0, 0, r + 16, 0, TAU); ctx.stroke(); ctx.restore();
    // punto que orbita
    const a = TAU * t - Math.PI / 2, ox = x + Math.cos(a) * (r + 16), oy = y + Math.sin(a) * (r + 16);
    const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, 14); og.addColorStop(0, 'rgba(255,255,255,.95)'); og.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = og; ctx.beginPath(); ctx.arc(ox, oy, 14, 0, TAU); ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(ox, oy, 3.2, 0, TAU); ctx.fill();
    // marco blanco
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(x, y, r + 6, 0, TAU); ctx.fill();
    // foto o monograma
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
    if (p.foto && p.crop) {
      // encuadre exacto: (cx, cy) = centro y s = ancho del recorte, en fracción del ancho/alto de la foto
      const img = p.foto, k = 2 * r / (p.crop.s * img.width);
      ctx.fillStyle = C.white; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
      ctx.drawImage(img, x - p.crop.cx * img.width * k, y - p.crop.cy * img.height * k, img.width * k, img.height * k);
    } else if (p.foto) {
      const img = p.foto, zoom = p.zoom || 1;
      const s = Math.max(2 * r / img.width, 2 * r / img.height) * zoom, dw = img.width * s, dh = img.height * s;
      const dx = x - dw / 2 - (p.ox || 0) * (dw - 2 * r) / 2, dy = y - dh / 2 - (p.oy || 0) * (dh - 2 * r) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r); g.addColorStop(0, '#2E6FA8'); g.addColorStop(1, C.blue);
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.arc(x + r * .55, y - r * .6, r * .9, 0, TAU); ctx.fill();
      ctx.fillStyle = C.white; ctx.font = `600 ${r * .78}px ${F.display}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(initials(p), x, y + 4);
    }
    ctx.restore();
    // sello con el símbolo de las cuatro C
    const bx = x + Math.cos(Math.PI / 4) * (r + 2), by = y + Math.sin(Math.PI / 4) * (r + 2);
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(bx, by, 25, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.blue3; ctx.lineWidth = 2; ctx.stroke();
    if (assets.simbolo) ctx.drawImage(assets.simbolo, bx - 15, by - 15, 30, 30);
  }

  function drawCard(ctx, t, p) {
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    // fondo y cabecera
    ctx.fillStyle = C.blue3; ctx.fillRect(0, 0, W, H);
    if (assets.logo) { const lh = 28, lw = assets.logo.width * lh / assets.logo.height; ctx.drawImage(assets.logo, (W - lw) / 2, 27, lw, lh); }

    // panel nocturno
    ctx.save(); rr(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, PANEL.r); ctx.clip();
    ctx.fillStyle = C.navy; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
    const g1 = ctx.createRadialGradient(300, 270, 20, 300, 270, 360); g1.addColorStop(0, 'rgba(0,72,135,.75)'); g1.addColorStop(1, 'rgba(0,72,135,0)');
    ctx.fillStyle = g1; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
    const g2 = ctx.createRadialGradient(300, 900, 40, 300, 900, 420); g2.addColorStop(0, 'rgba(0,72,135,.6)'); g2.addColorStop(1, 'rgba(0,72,135,0)');
    ctx.fillStyle = g2; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);

    // estrellas que titilan
    ESTRELLAS.forEach(([sx, sy, ss], i) => {
      const k = Math.max(0, Math.sin(TAU * (t * (1 + (i % 2)) + i * .37)));
      if (k > .02) { ctx.globalAlpha = .35 + .65 * k; sparkle(ctx, sx, sy, ss * (.5 + .7 * k), i % 4 === 0 ? C.blue2 : C.white); }
    });
    ctx.globalAlpha = 1;

    // confeti (más tenue al centro para no competir con el texto)
    for (const c of CONFETI) {
      const y = PANEL.y - 20 + ((c.ph + t) % 1) * (PANEL.h + 40);
      const x = c.x + Math.sin(TAU * (c.sway * t + c.ph2)) * c.amp;
      const flip = Math.cos(TAU * (c.spin * t + c.ph3));
      const centre = Math.min(1, Math.abs(x - 300) / 230);
      ctx.save(); ctx.globalAlpha = .22 + .78 * centre * centre; ctx.translate(x, y); ctx.rotate(c.rot + Math.sin(TAU * (t + c.ph)) * .6); ctx.scale(1, Math.max(.15, Math.abs(flip)));
      ctx.fillStyle = c.color;
      if (c.shape === 0) ctx.fillRect(-c.size / 2, -c.size * .35, c.size, c.size * .7);
      else if (c.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, c.size * .4, 0, TAU); ctx.fill(); }
      else { ctx.fillRect(-c.size * .9, -1.6, c.size * 1.8, 3.2); }
      ctx.restore();
    }

    bunting(ctx, PANEL.x - 4, 186, 92, 30, t, [C.blue2, C.white, C.red, '#2E6FA8', C.blue2, C.white]);
    bunting(ctx, 414, PANEL.x + PANEL.w + 4, 92, 30, t + .5, [C.white, C.blue2, '#2E6FA8', C.white, C.red, C.blue2]);
    GLOBOS.forEach(b => balloon(ctx, b, t));

    // encabezado del panel
    ctx.fillStyle = C.blue2; ctx.font = `700 12.5px ${F.body}`; spacing(ctx, '4px');
    ctx.fillText('CELEBRAMOS CONTIGO', 302, 124); spacing(ctx, '0px');

    drawPhoto(ctx, p, t);

    // saludo
    ctx.save(); ctx.translate(300, 446); ctx.rotate(-.03);
    ctx.fillStyle = C.blue2; ctx.font = `700 42px ${F.hand}`; ctx.fillText('¡Feliz cumpleaños,', 0, 0); ctx.restore();

    // nombre con destello
    let size = 70; const nameText = `${p.nombre}!`;
    ctx.font = `700 ${size}px ${F.display}`;
    while (ctx.measureText(nameText).width > 470 && size > 36) { size -= 2; ctx.font = `700 ${size}px ${F.display}`; }
    const nw = ctx.measureText(nameText).width, ny = 516;
    const sweep = t / .45; // pasa durante el primer 45 % del bucle
    if (sweep <= 1) {
      const cx = 300 - nw / 2 - 120 + sweep * (nw + 240);
      const sg = ctx.createLinearGradient(cx - 90, 0, cx + 90, 0);
      sg.addColorStop(0, C.white); sg.addColorStop(.5, C.blue2); sg.addColorStop(1, C.white);
      ctx.fillStyle = sg;
    } else ctx.fillStyle = C.white;
    ctx.fillText(nameText, 300, ny);

    // nombre completo
    ctx.fillStyle = 'rgba(216,232,245,.72)'; ctx.font = `600 12.5px ${F.body}`; spacing(ctx, '3px');
    ctx.fillText((p.completo || '').toUpperCase(), 302, 550); spacing(ctx, '0px');

    // fecha en píldora
    ctx.font = `700 13px ${F.body}`; spacing(ctx, '1.5px');
    const ft = (p.fecha || '').toUpperCase(), fw = ctx.measureText(ft).width + 58;
    rr(ctx, 300 - fw / 2, 568, fw, 34, 17); ctx.fillStyle = 'rgba(149,201,225,.14)'; ctx.fill();
    ctx.strokeStyle = 'rgba(149,201,225,.55)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = C.white; ctx.fillText(ft, 300 + 10, 590); spacing(ctx, '0px');
    sparkle(ctx, 300 - fw / 2 + 20, 585, 7, C.red);

    // mensaje
    let ms = 18, lines;
    do { ctx.font = `400 ${ms}px ${F.body}`; lines = wrap(ctx, p.mensaje || '', 468); if (lines.length <= 4) break; ms -= 1; } while (ms > 13);
    const lh = ms * 1.55, top = 662 - (lines.length - 3) * lh / 2;
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    lines.forEach((l, i) => ctx.fillText(l, 300, top + i * lh));

    // firma
    ctx.strokeStyle = 'rgba(149,201,225,.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(250, 760); ctx.lineTo(350, 760); ctx.stroke();
    ctx.fillStyle = C.blue2; ctx.font = `600 27px ${F.hand}`; ctx.fillText(p.firma || FIRMA, 300, 800);

    ctx.restore(); // fin del panel
    ctx.restore();
  }

  /* ── GIF ── */
  const FRAMES = 60, DELAY = 6; // 60 cuadros × 0,06 s = bucle de 3,6 s
  async function makeGif(p, onProgress) {
    await loadAssets();
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    return global.CSGif.encode({
      width: W, height: H, frames: FRAMES, delay: DELAY, onProgress,
      fixedColors: [C.navy, C.blue, C.blue2, C.blue3, C.red, C.white],
      render(i) { drawCard(ctx, i / FRAMES, p); return ctx.getImageData(0, 0, W, H).data; },
    });
  }

  function correo(p) {
    return {
      asunto: `¡Feliz cumpleaños, ${p.nombre}! 🎉`,
      cuerpo: `¡Hola, ${p.nombre}!\n\n${p.mensaje}\n\n¡Que tengas un día maravilloso!\n\n${p.firma || FIRMA}`,
    };
  }

  global.CS = { W, H, C, COLABORADORES, FIRMA, FRAMES, loadAssets, drawCard, makeGif, correo, initials };
})(typeof window !== 'undefined' ? window : globalThis);
