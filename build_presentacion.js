// Genera "Presentacion_EC2_Semana8.pptx".
// Uso: node build_presentacion.js
// Requiere: pptxgenjs, react, react-dom, react-icons y sharp (npm install).

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
const fa = require("react-icons/fa");

const OUT = path.join(__dirname, "Presentacion_EC2_Semana8.pptx");
const LOGO = path.join(__dirname, "assets", "logo-ulima.png");
const HAS_LOGO = fs.existsSync(LOGO);

// ---------- Paleta y tipografías ----------
const COL = {
  dark: "24313A", // gris pizarra oscuro
  orange: "D9622B", // acento
  teal: "2E6E73", // secundario
  card: "F3F4F4", // tarjetas
  soft: "FBEDE4", // tarjeta destacada del estrés
  text: "3B444C",
  white: "FFFFFF",
  lightOrange: "F2A57A", // naranja claro sobre fondo oscuro
  muted: "6B747B",
  darkCard: "33434E", // tarjeta sobre fondo oscuro
  placeholder: "D9DDDF",
  arrow: "9AA3A9",
};
const HEAD = "Cambria";
const BODY = "Calibri";

const THEME = {
  name: "EC2 Semana 8",
  colors: {
    dk1: COL.text, lt1: COL.white, dk2: COL.dark, lt2: COL.card,
    accent1: COL.orange, accent2: COL.teal, accent3: COL.lightOrange, accent4: COL.soft,
    accent5: COL.muted, accent6: COL.darkCard, hlink: COL.teal, folHlink: COL.muted,
  },
};

// ---------- Íconos ----------
async function icon(IconComponent, color = "#FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

// ---------- Ayudantes de dibujo ----------
function card(slide, x, y, w, h, fill = COL.card, name = "Tarjeta") {
  slide.addShape("roundRect", {
    x, y, w, h, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.12, objectName: name,
  });
}

function iconCircle(slide, data, x, y, d, color, name = "Icono") {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color }, line: { type: "none" }, objectName: name + " círculo" });
  const s = d * 0.54;
  slide.addImage({ data, x: x + (d - s) / 2, y: y + (d - s) / 2, w: s, h: s, objectName: name });
}

function txt(slide, text, opts) {
  slide.addText(text, {
    fontFace: BODY, fontSize: 15, color: COL.text, margin: 0, valign: "top", isTextBox: true, ...opts,
  });
}

function title(slide, text) {
  slide.addText(text, { placeholder: "title" });
}

// ---------- Construcción ----------
async function build() {
  const I = {
    brain: await icon(fa.FaBrain),
    city: await icon(fa.FaCity),
    grad: await icon(fa.FaGraduationCap),
    finger: await icon(fa.FaFingerprint),
    comments: await icon(fa.FaComments),
    table: await icon(fa.FaTable),
    chart: await icon(fa.FaChartBar),
    map: await icon(fa.FaMapMarkerAlt),
    female: await icon(fa.FaFemale),
    male: await icon(fa.FaMale),
    warn: await icon(fa.FaExclamationTriangle),
    shield: await icon(fa.FaShieldAlt),
    calendar: await icon(fa.FaCalendarCheck),
    book: await icon(fa.FaBookOpen),
    tasks: await icon(fa.FaTasks),
    bed: await icon(fa.FaBed),
    friends: await icon(fa.FaUserFriends),
    wine: await icon(fa.FaWineGlassAlt),
    run: await icon(fa.FaRunning),
    clipboard: await icon(fa.FaClipboardCheck),
    heart: await icon(fa.FaHeartbeat),
    wallet: await icon(fa.FaWallet),
    briefcase: await icon(fa.FaBriefcase),
    globe: await icon(fa.FaGlobeAmericas),
    building: await icon(fa.FaBuilding),
  };

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
  pres.author = "Fatima Turner";
  pres.title = "Determinantes sociales de la salud mental, conductas de riesgo, personalidad y estilos de vida";
  pres.subject = "Evaluación Continua 2, Semana 8";
  pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

  // Logo pequeño abajo a la derecha (o espacio reservado) y número abajo a la izquierda.
  const LOGO_BOX = { x: 11.53, y: 6.82, w: 1.2, h: 0.42 };
  const logoObj = HAS_LOGO
    ? { image: { path: LOGO, ...LOGO_BOX, sizing: { type: "contain", w: LOGO_BOX.w, h: LOGO_BOX.h } } }
    : { rect: { ...LOGO_BOX, fill: { color: COL.placeholder }, line: { type: "none" } } };
  const num = (color) => ({ x: 0.6, y: 6.86, w: 0.6, h: 0.34, fontFace: BODY, fontSize: 11, color });
  const titlePh = (color) => ({
    placeholder: {
      options: {
        name: "title", type: "title", x: 0.6, y: 0.42, w: 12.13, h: 0.8,
        fontFace: HEAD, fontSize: 26, bold: true, color, align: "left", valign: "middle", margin: 0,
      },
      text: "",
    },
  });

  pres.defineSlideMaster({ title: "PORTADA", background: { color: COL.dark }, objects: [logoObj], slideNumber: num("C9D1D3") });
  pres.defineSlideMaster({ title: "OSCURA", background: { color: COL.dark }, objects: [logoObj, titlePh(COL.white)], slideNumber: num("C9D1D3") });
  pres.defineSlideMaster({ title: "CLARA", background: { color: COL.white }, objects: [logoObj, titlePh(COL.dark)], slideNumber: num(COL.muted) });

  const chartText = { fontFace: BODY, color: COL.text };

  // ===== 1. Portada =====
  pres.addSection({ title: "Introducción" });
  let s = pres.addSlide({ masterName: "PORTADA", sectionTitle: "Introducción" });
  iconCircle(s, I.brain, 0.6, 0.75, 0.85, COL.orange, "Ícono cerebro");
  txt(s, "ESTRATEGIAS Y PROGRAMAS DE INTERVENCIÓN EN PROBLEMAS PSICOSOCIALES", {
    x: 0.6, y: 1.9, w: 12.1, h: 0.4, fontSize: 14, bold: true, color: COL.lightOrange, charSpacing: 2, objectName: "Curso",
  });
  s.addText("Determinantes sociales de la salud mental, conductas de riesgo, personalidad y estilos de vida", {
    x: 0.6, y: 2.45, w: 12.1, h: 1.9, fontFace: HEAD, fontSize: 36, bold: true, color: COL.white,
    margin: 0, valign: "top", isTextBox: true, objectName: "Título",
  });
  txt(s, "Análisis de 20 universitarios: el estrés como variable predominante", {
    x: 0.6, y: 3.85, w: 11.2, h: 0.5, fontSize: 20, italic: true, color: "D5DBDE", objectName: "Subtítulo",
  });
  txt(s, "Fatima Turner · Evaluación Continua 2, Semana 8", {
    x: 0.6, y: 5.0, w: 9, h: 0.4, fontSize: 16, color: COL.white, objectName: "Pie",
  });
  s.addNotes(
    "Buenos días. Les presento mi trabajo sobre los determinantes sociales de la salud mental, las conductas de riesgo, la personalidad y los estilos de vida. " +
    "Analicé las entrevistas de 20 universitarios. " +
    "La idea que atraviesa toda la presentación es que el estrés es la variable que más se repite en el grupo, así que todo el análisis gira en torno a ella."
  );

  // ===== 2. Marco =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Introducción" });
  title(s, "La salud mental depende también del contexto");
  const c2 = [
    { ic: I.city, color: COL.teal, h: "Determinantes sociales", b: "La pobreza, la inseguridad laboral, el barrio y el aislamiento elevan el riesgo. Las redes de apoyo protegen (Kirkbride et al., 2024)." },
    { ic: I.grad, color: COL.orange, h: "Estrés universitario", b: "Más estrés académico se relaciona con menor bienestar (Barbayannis et al., 2022). Trabajar y estudiar aumenta el agotamiento (di Biase y Giusino, 2026)." },
    { ic: I.finger, color: COL.teal, h: "Personalidad", b: "El perfeccionismo se asocia con ansiedad (Lunn et al., 2023). La búsqueda de emociones, con más consumo de alcohol (Lui et al., 2022)." },
  ];
  const w2 = (12.13 - 2 * 0.4) / 3;
  c2.forEach((c, i) => {
    const x = 0.6 + i * (w2 + 0.4);
    card(s, x, 1.65, w2, 4.1, COL.card, "Tarjeta " + c.h);
    iconCircle(s, c.ic, x + 0.35, 2.0, 0.9, c.color, "Ícono " + c.h);
    s.addText(c.h, { x: x + 0.35, y: 3.1, w: w2 - 0.7, h: 0.5, fontFace: HEAD, fontSize: 19, bold: true, color: COL.dark, margin: 0, valign: "top", isTextBox: true });
    txt(s, c.b, { x: x + 0.35, y: 3.7, w: w2 - 0.7, h: 1.9, fontSize: 16, paraSpaceAfter: 4 });
  });
  s.addNotes(
    "Antes de ver los resultados, parto de una idea simple: la salud mental no depende solo de la persona, también depende del contexto. " +
    "La OMS (2022) reconoce que las condiciones sociales, económicas y ambientales influyen en la salud mental. " +
    "A esto sumo la evidencia sobre el estrés universitario y sobre cómo ciertos rasgos de personalidad se asocian con ansiedad o con consumo de alcohol. " +
    "Esto se complementa con el IDH del PNUD (2025) y los ODS, que usaré más adelante."
  );

  // ===== 3. Metodología =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Introducción" });
  title(s, "Metodología: 20 universitarios entrevistados");
  card(s, 0.6, 1.65, 3.9, 4.55, COL.card, "Tarjeta muestra");
  [
    { n: "20", l: "participantes", c: COL.dark },
    { n: "12", l: "mujeres", c: COL.orange },
    { n: "8", l: "varones", c: COL.teal },
  ].forEach((r, i) => {
    const y = 1.95 + i * 1.35;
    s.addText(r.n, { x: 0.95, y, w: 1.45, h: 1.0, fontFace: HEAD, fontSize: 54, bold: true, color: r.c, margin: 0, valign: "middle", isTextBox: true });
    txt(s, r.l, { x: 2.45, y, w: 1.9, h: 1.0, fontSize: 18, valign: "middle" });
  });
  s.addText("Fuentes de información", { x: 5.0, y: 1.65, w: 7.7, h: 0.5, fontFace: HEAD, fontSize: 20, bold: true, color: COL.dark, margin: 0, valign: "middle", isTextBox: true });
  [
    { ic: I.comments, c: COL.orange, t: "Entrevista semiestructurada con la guía de DSS, con consentimiento informado" },
    { ic: I.table, c: COL.teal, t: "Cuadros individuales de análisis en seis dimensiones" },
    { ic: I.chart, c: COL.teal, t: "IDH distrital 2024 del PNUD (Anexo 1, Informe 2025)" },
  ].forEach((r, i) => {
    const y = 2.45 + i * 1.0;
    iconCircle(s, r.ic, 5.0, y, 0.7, r.c, "Ícono fuente " + (i + 1));
    txt(s, r.t, { x: 5.95, y, w: 6.75, h: 0.7, fontSize: 16, valign: "middle" });
  });
  txt(s, "Universitarios de 20 a 30 años. 19 viven en Lima y 1 en Ica. Variable central: el estrés, presente en 19 de 20.", {
    x: 5.0, y: 5.6, w: 7.7, h: 0.55, fontSize: 12, color: COL.muted, valign: "bottom",
  });
  s.addNotes(
    "La muestra está formada por 20 universitarios de 20 a 30 años, 12 mujeres y 8 varones. " +
    "Todos participaron en una entrevista semiestructurada con la guía de determinantes sociales, previo consentimiento informado. " +
    "Con esa información armé cuadros individuales en seis dimensiones y los crucé con el IDH distrital del PNUD. " +
    "Las pruebas psicológicas se aplicaron en una segunda sesión, pero el informe se basa en las entrevistas."
  );

  // ===== 4. El estrés =====
  pres.addSection({ title: "Resultados" });
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Resultados" });
  title(s, "El estrés es la variable predominante");
  card(s, 0.6, 1.65, 4.6, 4.55, COL.soft, "Tarjeta destacada estrés");
  iconCircle(s, I.brain, 0.95, 2.0, 0.95, COL.orange, "Ícono cerebro");
  s.addText("19 de 20", { x: 0.95, y: 3.1, w: 4.0, h: 1.0, fontFace: HEAD, fontSize: 54, bold: true, color: COL.orange, margin: 0, valign: "middle", isTextBox: true });
  txt(s, "participantes refieren estrés o ansiedad (95\u00A0%). Ningún cuadro reporta un diagnóstico clínico.", {
    x: 0.95, y: 4.25, w: 3.95, h: 1.6, fontSize: 17,
  });
  // Barras horizontales: pptxgenjs dibuja la primera categoría abajo, así que el orden va invertido.
  s.addChart(pres.charts.BAR, [{ name: "Participantes", labels: ["Familiar", "Laboral", "Académica"], values: [2, 11, 13] }], {
    x: 5.6, y: 1.65, w: 7.13, h: 4.55, barDir: "bar", barGapWidthPct: 55,
    chartColors: [COL.orange],
    showTitle: true, title: "Fuentes del estrés (un participante puede tener varias)",
    titleFontFace: BODY, titleFontSize: 14, titleColor: COL.dark,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0", dataLabelFontFace: BODY, dataLabelFontSize: 14, dataLabelColor: COL.text, dataLabelFontBold: true,
    catAxisLabelFontFace: BODY, catAxisLabelFontSize: 14, catAxisLabelColor: COL.text, catAxisLineShow: false,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 15, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showLegend: false, objectName: "Gráfico fuentes del estrés",
  });
  s.addNotes(
    "Este es el hallazgo central. 19 de los 20 participantes refieren estrés o ansiedad, es decir, el 95 % del grupo. " +
    "Hay que aclarar que ningún cuadro reporta un diagnóstico clínico, hablamos de lo que ellos mismos cuentan. " +
    "La principal fuente es la universidad, con 13 casos, seguida del trabajo, con 11, y en 2 casos aparece la familia. " +
    "C.P no lo registra en salud mental, pero sí lo menciona por la búsqueda de empleo."
  );

  // ===== 5. IDH por distrito =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Resultados" });
  title(s, "15 de 20 viven en distritos de Desarrollo Humano Alto");
  const idh = [
    ["San Isidro (2)", 0.8558], ["Miraflores (2)", 0.8522], ["San Borja (1)", 0.8486], ["La Molina (1)", 0.8425],
    ["Jesús María (1)", 0.8321], ["Santiago de Surco (7)", 0.8252], ["Magdalena del Mar (1)", 0.8214], ["Barranco (1)", 0.7944],
    ["Los Olivos (1)", 0.7645], ["Chorrillos (1)", 0.7490], ["Ica (1)", 0.7367], ["San Juan de Lurigancho (1)", 0.7171],
  ].reverse(); // el valor más alto queda arriba
  const lbl = idh.map((d) => d[0]);
  s.addChart(pres.charts.BAR, [
    { name: "Alto", labels: lbl, values: idh.map((d) => (d[1] >= 0.8 ? d[1] : 0)) },
    { name: "Mediano Alto", labels: lbl, values: idh.map((d) => (d[1] < 0.8 ? d[1] : 0)) },
  ], {
    x: 0.6, y: 1.5, w: 8.0, h: 5.1, barDir: "bar", barGrouping: "stacked", barGapWidthPct: 40,
    chartColors: [COL.teal, COL.orange],
    showTitle: true, title: "IDH 2024 por distrito (n.º de participantes)",
    titleFontFace: BODY, titleFontSize: 14, titleColor: COL.dark,
    showValue: true, dataLabelPosition: "inEnd", dataLabelFormatCode: "0.0000", dataLabelFontFace: BODY, dataLabelFontSize: 11, dataLabelColor: COL.white, dataLabelFontBold: true,
    catAxisLabelFontFace: BODY, catAxisLabelFontSize: 11, catAxisLabelColor: COL.text, catAxisLineShow: false,
    valAxisMinVal: 0.5, valAxisMaxVal: 0.9, valAxisMajorUnit: 0.1, valAxisLabelFormatCode: "0.0",
    valAxisLabelFontFace: BODY, valAxisLabelFontSize: 10, valAxisLabelColor: COL.muted, valAxisLineShow: false,
    valGridLine: { color: "E3E6E7", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontFace: BODY, legendFontSize: 11, legendColor: COL.text,
    objectName: "Gráfico IDH por distrito",
  });
  card(s, 9.0, 1.65, 3.73, 4.95, COL.card, "Tarjeta IDH promedio");
  iconCircle(s, I.map, 9.3, 1.95, 0.7, COL.orange, "Ícono ubicación");
  s.addText("0.8149", { x: 9.3, y: 2.8, w: 3.2, h: 0.85, fontFace: HEAD, fontSize: 44, bold: true, color: COL.orange, margin: 0, valign: "middle", isTextBox: true });
  txt(s, "IDH promedio del grupo. Perú: 0.6621", { x: 9.3, y: 3.7, w: 3.2, h: 0.55, fontSize: 14 });
  [
    { c: COL.teal, b: "Alto (0.800 a 1.000):", t: " 15 participantes" },
    { c: COL.orange, b: "Mediano Alto (0.700 a 0.799):", t: " 5 participantes" },
  ].forEach((r, i) => {
    const y = 4.35 + i * 0.6;
    s.addShape("ellipse", { x: 9.3, y: y + 0.08, w: 0.2, h: 0.2, fill: { color: r.c }, line: { type: "none" } });
    s.addText([{ text: r.b, options: { bold: true } }, { text: r.t }], { x: 9.62, y, w: 2.95, h: 0.55, fontFace: BODY, fontSize: 13, color: COL.text, margin: 0, valign: "top", isTextBox: true });
  });
  txt(s, "Hay dos participantes con las iniciales V.T: una en Surco y otro en Chorrillos.", {
    x: 9.3, y: 5.65, w: 3.2, h: 0.75, fontSize: 12, italic: true, color: COL.muted,
  });
  s.addNotes(
    "Ahora veamos dónde viven. Ordené los distritos según su IDH 2024, y entre paréntesis está el número de participantes en cada uno. " +
    "15 de los 20 viven en distritos de Desarrollo Humano Alto y 5 en distritos de nivel Mediano Alto. " +
    "El promedio del grupo es 0.8149, muy por encima del 0.6621 del Perú. " +
    "La fuente es el PNUD (2025), con valores de 2024."
  );

  // ===== 6. Género =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Resultados" });
  title(s, "El estrés según el género");
  const gen = [
    {
      h: "Mujeres (12)", c: COL.orange, ic: I.female, rows: [
        ["8/12", "Estrés por el trabajo, combinado con la universidad"],
        ["Hacia adentro", "Sueño, alimentación, piel y tristeza"],
        ["9/12", "Alcohol social, a veces para desestresarse"],
        ["7/12", "Sueño insuficiente o irregular"],
      ],
    },
    {
      h: "Varones (8)", c: COL.teal, ic: I.male, rows: [
        ["6/8", "Estrés académico, y en 2 casos familiar"],
        ["En la conducta", "Irritabilidad, aislamiento y autoexigencia física"],
        ["5/8", "Alimentación poco saludable o restrictiva"],
        ["2/8", "Ejercicio excesivo, uno con desmayo"],
      ],
    },
  ];
  const w6 = (12.13 - 0.4) / 2;
  gen.forEach((g, i) => {
    const x = 0.6 + i * (w6 + 0.4);
    card(s, x, 1.65, w6, 4.85, COL.card, "Tarjeta " + g.h);
    iconCircle(s, g.ic, x + 0.35, 1.9, 0.75, g.c, "Ícono " + g.h);
    s.addText(g.h, { x: x + 1.3, y: 1.9, w: w6 - 1.6, h: 0.75, fontFace: HEAD, fontSize: 20, bold: true, color: g.c, margin: 0, valign: "middle", isTextBox: true });
    g.rows.forEach((r, j) => {
      const y = 2.95 + j * 0.86;
      const isNum = /^\d/.test(r[0]);
      s.addText(r[0], {
        x: x + 0.35, y, w: 1.75, h: 0.7, fontFace: HEAD, fontSize: isNum ? 26 : 15, bold: true, color: g.c,
        margin: 0, valign: "middle", isTextBox: true,
      });
      txt(s, r[1], { x: x + 2.2, y, w: w6 - 2.5, h: 0.7, fontSize: 15, valign: "middle" });
    });
  });
  s.addNotes(
    "Cuando separamos por género, el estrés se vive de forma distinta. " +
    "En las mujeres se asocia sobre todo al trabajo combinado con la universidad y se expresa hacia adentro, en el sueño, la alimentación, la piel y la tristeza. " +
    "En los varones predomina el estrés académico y se expresa en la conducta, con irritabilidad, aislamiento o autoexigencia física. " +
    "El alcohol solo se describe en uno de los ocho varones, por eso no se compara."
  );

  // ===== 7. Factor predominante =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Resultados" });
  title(s, "Factor predominante en cada área");
  const areas = [
    { a: "DSS", f: "Carga académica", n: "13/20", ic: I.grad },
    { a: "Rasgos", f: "Responsabilidad", n: "7/20", ic: I.tasks },
    { a: "Riesgo", f: "Alimentación irregular", n: "13/20", ic: I.warn },
    { a: "Protector", f: "Apoyo de amigos", n: "14/20", ic: I.shield },
    { a: "Salud mental", f: "Estrés o ansiedad", n: "19/20", ic: I.brain, hi: true },
    { a: "Estilo de vida", f: "Rutina organizada", n: "12/20", ic: I.calendar },
  ];
  const w7 = (12.13 - 2 * 0.4) / 3, h7 = 2.3;
  areas.forEach((a, i) => {
    const x = 0.6 + (i % 3) * (w7 + 0.4), y = 1.65 + Math.floor(i / 3) * (h7 + 0.3);
    const c = a.hi ? COL.orange : COL.teal;
    card(s, x, y, w7, h7, a.hi ? COL.soft : COL.card, "Tarjeta " + a.a);
    iconCircle(s, a.ic, x + 0.3, y + 0.3, 0.65, c, "Ícono " + a.a);
    s.addText(a.a, { x: x + 1.15, y: y + 0.3, w: w7 - 1.4, h: 0.65, fontFace: HEAD, fontSize: 17, bold: true, color: COL.dark, margin: 0, valign: "middle", isTextBox: true });
    txt(s, a.f, { x: x + 0.3, y: y + 1.15, w: w7 - 0.6, h: 0.4, fontSize: 16, valign: "middle" });
    s.addText(a.n, { x: x + 0.3, y: y + 1.55, w: w7 - 0.6, h: 0.55, fontFace: HEAD, fontSize: 28, bold: true, color: a.hi ? COL.orange : COL.dark, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addNotes(
    "Aquí resumo el factor que más se repite en cada una de las seis áreas de análisis. " +
    "Destaca la salud mental, con el estrés o la ansiedad en 19 de 20, pero también la carga académica, la alimentación irregular y el apoyo de los amigos. " +
    "La responsabilidad empata con la confianza en sí mismo (7 de 20). Se eligió la responsabilidad por su relación con la carga académica."
  );

  // ===== 8. Eje =====
  pres.addSection({ title: "Análisis" });
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Análisis" });
  title(s, "El estrés como eje de los factores predominantes");
  const chain = [
    { h: "Carga académica", t: "Exige tiempo y rendimiento, y 11 de 20 además trabajan", ic: I.grad },
    { h: "Responsabilidad", t: "Permite cumplir, pero se vuelve autoexigencia", ic: I.tasks },
    { h: "Estrés o ansiedad", t: "Presente en 19 de 20 participantes", ic: I.brain, hi: true },
    { h: "Sueño y comidas", t: "Es lo primero que se sacrifica", ic: I.bed },
  ];
  const gap8 = 0.55, w8 = (12.13 - 3 * gap8) / 4;
  chain.forEach((c, i) => {
    const x = 0.6 + i * (w8 + gap8);
    card(s, x, 1.65, w8, 2.8, c.hi ? COL.soft : COL.card, "Tarjeta " + c.h);
    iconCircle(s, c.ic, x + 0.3, 1.95, 0.75, c.hi ? COL.orange : COL.teal, "Ícono " + c.h);
    s.addText(c.h, { x: x + 0.3, y: 2.85, w: w8 - 0.5, h: 0.45, fontFace: HEAD, fontSize: 17, bold: true, color: c.hi ? COL.orange : COL.dark, margin: 0, valign: "top", isTextBox: true });
    txt(s, c.t, { x: x + 0.3, y: 3.35, w: w8 - 0.55, h: 1.15, fontSize: 15 });
    if (i < 3) {
      s.addShape("rightArrow", { x: x + w8 + 0.12, y: 2.98, w: 0.31, h: 0.34, fill: { color: COL.arrow }, line: { type: "none" }, objectName: "Flecha " + (i + 1) });
    }
  });
  card(s, 0.6, 5.05, 12.13, 1.4, COL.dark, "Franja amigos");
  iconCircle(s, I.friends, 0.95, 5.35, 0.8, COL.orange, "Ícono amigos");
  txt(s, "Los amigos alivian el estrés (14 de 20), pero son también el espacio donde se concentra el consumo de alcohol de fin de semana. La misma red protege y expone al riesgo.", {
    x: 2.0, y: 5.2, w: 10.4, h: 1.1, fontSize: 16, color: COL.white, valign: "middle",
  });
  s.addNotes(
    "Si unimos los factores predominantes, el estrés funciona como un eje. " +
    "La carga académica exige tiempo y rendimiento, y además 11 de los 20 trabajan. " +
    "La responsabilidad les permite cumplir, pero se convierte en autoexigencia, y eso alimenta el estrés, que termina sacrificando el sueño y las comidas. " +
    "Los amigos son el principal factor protector, aunque es también con ellos con quienes se concentra el consumo de alcohol del fin de semana."
  );

  // ===== 9. Entorno y personalidad =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Análisis" });
  title(s, "El entorno genera el estrés y la personalidad lo modula");
  const cols9 = [
    {
      h: "Determinantes sociales", ic: I.city, c: COL.teal, b: [
        "Fuentes de tensión: universidad (13) y prácticas (11)",
        "Prácticas con cuotas, sin capacitación, trato diferenciado o maltrato verbal",
        "Dificultad económica en 3 casos: J.C, A.F y S.G",
        "Inseguridad en la zona en 3 casos",
      ],
    },
    {
      h: "Rasgos de personalidad", ic: I.finger, c: COL.orange, b: [
        "La autoexigencia aparece con síntomas: perfeccionismo, sobrepensamiento y autocrítica (Lunn et al., 2023)",
        "Mudarse sola o lograr resultados en las prácticas fortaleció la confianza",
        "La búsqueda del grupo se asocia con más alcohol, como en S.C (Lui et al., 2022)",
      ],
    },
  ];
  const w9 = (12.13 - 0.4) / 2;
  cols9.forEach((c, i) => {
    const x = 0.6 + i * (w9 + 0.4);
    card(s, x, 1.65, w9, 3.45, COL.card, "Tarjeta " + c.h);
    iconCircle(s, c.ic, x + 0.35, 1.9, 0.7, c.c, "Ícono " + c.h);
    s.addText(c.h, { x: x + 1.25, y: 1.9, w: w9 - 1.5, h: 0.7, fontFace: HEAD, fontSize: 19, bold: true, color: COL.dark, margin: 0, valign: "middle", isTextBox: true });
    s.addText(c.b.map((t, j) => ({ text: t, options: { bullet: { indent: 16 }, breakLine: j < c.b.length - 1, paraSpaceAfter: 6 } })), {
      x: x + 0.35, y: 2.8, w: w9 - 0.65, h: 2.15, fontFace: BODY, fontSize: 15, color: COL.text, margin: 0, valign: "top", isTextBox: true,
    });
  });
  card(s, 0.6, 5.4, 12.13, 1.0, COL.dark, "Franja asociaciones");
  iconCircle(s, I.warn, 0.9, 5.6, 0.6, COL.orange, "Ícono advertencia");
  txt(s, "Son asociaciones, no causas: la mayoría tiene soporte familiar, vivienda y seguro, y los rasgos median cómo vive la exigencia.", {
    x: 1.8, y: 5.45, w: 10.65, h: 0.9, fontSize: 16, color: COL.white, valign: "middle",
  });
  s.addNotes(
    "En esta lámina separo lo que viene del entorno y lo que viene de la persona. " +
    "Del entorno, las tensiones vienen de la universidad y de las prácticas, con cuotas, falta de capacitación o maltrato verbal, y en pocos casos de la economía o la inseguridad. " +
    "De la personalidad, la autoexigencia aparece junto con síntomas, mientras que algunos logros fortalecieron la confianza. " +
    "Quiero subrayar que son asociaciones y no causas, porque la mayoría tiene soporte familiar, vivienda y seguro."
  );

  // ===== 10. Conductas =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Análisis" });
  title(s, "Conductas que acompañan al estrés");
  const cond = [
    { h: "Alcohol", ic: I.wine, c: COL.teal, t: "En 10 cuadros, sobre todo los fines de semana. V.T (1) sale a tomar para desestresarse." },
    { h: "Sueño", ic: I.bed, c: COL.teal, t: "9 de 20 duermen poco, 8 de ellos trabajan. El mal sueño se asocia con el estrés (Gardani et al., 2022)." },
    { h: "Actividad física", ic: I.run, c: COL.teal, t: "Protege a 8 participantes (Singh et al., 2023), pero en J.V y V.T (2) se vuelve exceso." },
    { h: "Evaluación individual", ic: I.clipboard, c: COL.orange, t: "V.T (2), J.V, V.L y G.P: ejercicio excesivo, dieta restrictiva, dejar de comer y agresividad." },
  ];
  const w10 = (12.13 - 0.4) / 2, h10 = 2.3;
  cond.forEach((c, i) => {
    const x = 0.6 + (i % 2) * (w10 + 0.4), y = 1.65 + Math.floor(i / 2) * (h10 + 0.3);
    card(s, x, y, w10, h10, COL.card, "Tarjeta " + c.h);
    iconCircle(s, c.ic, x + 0.35, y + 0.35, 0.85, c.c, "Ícono " + c.h);
    s.addText(c.h, { x: x + 1.5, y: y + 0.35, w: w10 - 1.8, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: COL.dark, margin: 0, valign: "top", isTextBox: true });
    txt(s, c.t, { x: x + 1.5, y: y + 0.88, w: w10 - 1.8, h: 1.2, fontSize: 16 });
  });
  s.addNotes(
    "El estrés no aparece solo, viene acompañado de algunas conductas. " +
    "El alcohol aparece en 10 cuadros, casi siempre los fines de semana, y el sueño insuficiente en 9 participantes, de los cuales 8 trabajan. " +
    "La actividad física protege a 8 participantes, pero en dos casos se vuelve excesiva. " +
    "Ninguno es un diagnóstico, pero estos cuatro casos requieren evaluación individual."
  );

  // ===== 11. IDH y estrés =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Análisis" });
  title(s, "El estrés aparece aunque el IDH sea alto");
  const dims = [
    { h: "Vida larga y saludable", ic: I.heart, t: "Tienen seguro y controles, pero el alcohol, el poco sueño y la mala alimentación pueden afectar su salud." },
    { h: "Educación", ic: I.book, t: "Todos llegan a la universidad, pero es la principal fuente de estrés. A.F dejó de estudiar un año por dinero." },
    { h: "Nivel de vida", ic: I.wallet, t: "Soporte familiar e ingresos por prácticas. Dificultad económica en 2 de 5 (Mediano Alto) y 1 de 15 (Alto)." },
  ];
  dims.forEach((d, i) => {
    const y = 1.65 + i * 1.62;
    iconCircle(s, d.ic, 0.6, y + 0.05, 0.75, i === 1 ? COL.orange : COL.teal, "Ícono " + d.h);
    s.addText(d.h, { x: 1.6, y, w: 5.0, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: COL.dark, margin: 0, valign: "top", isTextBox: true });
    txt(s, d.t, { x: 1.6, y: y + 0.45, w: 5.0, h: 1.0, fontSize: 14 });
  });
  s.addChart(pres.charts.BAR, [{
    name: "Pérdida por desigualdad (%)",
    labels: ["San Isidro", "San Borja", "Surco", "Los Olivos", "Chorrillos", "Barranco", "S. J. de Lurigancho", "Ica", "Perú"],
    values: [3.9, 4.2, 5.9, 6.9, 8.5, 8.6, 11.0, 12.9, 18.1],
  }], {
    x: 7.0, y: 1.65, w: 5.73, h: 4.85, barDir: "col", barGapWidthPct: 45,
    chartColors: [COL.orange],
    showTitle: true, title: "Pérdida del IDH por desigualdad, 2024 (%)",
    titleFontFace: BODY, titleFontSize: 14, titleColor: COL.dark,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0", dataLabelFontFace: BODY, dataLabelFontSize: 11, dataLabelColor: COL.text, dataLabelFontBold: true,
    catAxisLabelFontFace: BODY, catAxisLabelFontSize: 11, catAxisLabelColor: COL.text, catAxisLineShow: false, catAxisLabelRotate: -45,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 20, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showLegend: false, objectName: "Gráfico pérdida por desigualdad",
  });
  s.addNotes(
    "El IDH tiene tres dimensiones y las comparé con lo que cuentan los participantes. " +
    "Casi todos tienen seguro, llegan a la universidad y cuentan con soporte familiar, pero aun así aparece el estrés. " +
    "A la derecha se ve que la pérdida por desigualdad es menor en San Isidro y mayor en San Juan de Lurigancho e Ica, aunque todos están por debajo del Perú. " +
    "El IDH mide salud, educación e ingreso, no la salud mental."
  );

  // ===== 12. ODS =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Análisis" });
  title(s, "Relación con los Objetivos de Desarrollo Sostenible");
  const ods = [
    { h: "ODS 3: Salud y bienestar", ic: I.heart, c: COL.orange, t: "Meta 3.4: 19 de 20 con estrés y solo 1 con apoyo psicológico. Alcohol (3.5) y tabaco (3.a) como conductas asociadas." },
    { h: "ODS 4: Educación de calidad", ic: I.grad, c: COL.teal, t: "La universidad es la principal fuente de estrés. Una educación de calidad también cuida la salud mental." },
    { h: "ODS 8: Trabajo decente", ic: I.briefcase, c: COL.teal, t: "11 practicantes. Se registran maltrato verbal, trato diferenciado, falta de capacitación y presión por cuotas." },
    { h: "ODS 5, 10 y 11", ic: I.building, c: COL.teal, t: "Temor a salir sola por ser mujer, inseguridad en la zona y brecha de 0.1387 entre San Isidro y San Juan de Lurigancho." },
  ];
  ods.forEach((c, i) => {
    const x = 0.6 + (i % 2) * (w10 + 0.4), y = 1.65 + Math.floor(i / 2) * (h10 + 0.3);
    card(s, x, y, w10, h10, i === 0 ? COL.soft : COL.card, "Tarjeta " + c.h);
    iconCircle(s, c.ic, x + 0.35, y + 0.3, 0.7, c.c, "Ícono " + c.h);
    s.addText(c.h, { x: x + 1.25, y: y + 0.3, w: w10 - 1.55, h: 0.7, fontFace: HEAD, fontSize: 19, bold: true, color: i === 0 ? COL.orange : COL.dark, margin: 0, valign: "middle", isTextBox: true });
    txt(s, c.t, { x: x + 0.35, y: y + 1.15, w: w10 - 0.7, h: 1.0, fontSize: 16 });
  });
  s.addNotes(
    "Por último, relaciono los hallazgos con los Objetivos de Desarrollo Sostenible. " +
    "El más directo es el ODS 3, porque 19 de 20 tienen estrés y solo 1 recibe apoyo psicológico. " +
    "El ODS 4 se vincula porque la universidad es la principal fuente de estrés, y el ODS 8 por las condiciones de las prácticas. " +
    "También aparecen el ODS 5, el 10 y el 11, por el temor de las mujeres a salir solas, la inseguridad y la brecha entre distritos."
  );

  // ===== 13. Conclusiones =====
  pres.addSection({ title: "Cierre" });
  s = pres.addSlide({ masterName: "OSCURA", sectionTitle: "Cierre" });
  title(s, "Conclusiones");
  const concl = [
    "El estrés es la variable predominante (19 de 20). Viene de la universidad y de las prácticas, no de carencias materiales.",
    "En mujeres se expresa en el sueño, la alimentación, el cuerpo y el ánimo. En varones, en la conducta: irritabilidad, aislamiento o autoexigencia.",
    "La autoexigencia lo aumenta. Los amigos y el deporte lo alivian, y el alcohol y el poco sueño lo mantienen.",
    "El IDH no refleja el estrés. Se vincula con los ODS 3, 4 y 8. Son 20 casos de autorreporte y no se pueden generalizar.",
  ];
  const w13 = (12.13 - 0.4) / 2, h13 = 2.3;
  concl.forEach((t, i) => {
    const x = 0.6 + (i % 2) * (w13 + 0.4), y = 1.65 + Math.floor(i / 2) * (h13 + 0.3);
    card(s, x, y, w13, h13, COL.darkCard, "Bloque " + (i + 1));
    s.addText("0" + (i + 1), { x: x + 0.35, y: y + 0.3, w: 1.2, h: h13 - 0.6, fontFace: HEAD, fontSize: 48, bold: true, color: COL.lightOrange, margin: 0, valign: "middle", isTextBox: true });
    txt(s, t, { x: x + 1.65, y: y + 0.3, w: w13 - 1.95, h: h13 - 0.6, fontSize: 16, color: COL.white, valign: "middle" });
  });
  s.addNotes(
    "Para cerrar, cuatro ideas. " +
    "Primero, el estrés es la variable predominante y viene de la universidad y de las prácticas, no de carencias materiales. " +
    "Segundo, las mujeres lo expresan en el cuerpo y el ánimo, y los varones en la conducta. " +
    "Tercero, la autoexigencia lo aumenta, mientras que los amigos y el deporte lo alivian. " +
    "Y cuarto, el IDH no refleja el estrés, y como son 20 casos de autorreporte, estos resultados no se pueden generalizar."
  );

  // ===== 14. Referencias =====
  s = pres.addSlide({ masterName: "CLARA", sectionTitle: "Cierre" });
  title(s, "Referencias");
  // Cada referencia: [texto normal, texto en cursiva, texto final]
  const refs = [
    ["Barbayannis, G., et al. (2022). Academic stress and mental well-being in college students. ", "Frontiers in Psychology, 13", ", 886344."],
    ["di Biase, G., & Giusino, D. (2026). The psychology of working students: A scoping review. ", "Psychology International, 8", "(1), 11."],
    ["Gardani, M., et al. (2022). Poor sleep, insomnia symptoms and stress in undergraduate students. ", "Sleep Medicine Reviews, 61", ", 101565."],
    ["Kirkbride, J. B., et al. (2024). The social determinants of mental health and disorder. ", "World Psychiatry, 23", "(1), 58–90."],
    ["Lui, P. P., et al. (2022). Linking Big Five personality domains and facets to alcohol (mis)use. ", "Alcohol and Alcoholism, 57", "(1), 58–73."],
    ["Lunn, J., et al. (2023). Perfectionism and symptoms of anxiety, OCD and depression in young people. ", "Cognitive Behaviour Therapy, 52", "(5), 460–487."],
    ["Naciones Unidas. (s. f.). ", "Objetivo 3: Garantizar una vida sana y promover el bienestar para todos", "."],
    ["Organización Mundial de la Salud. (2022). ", "Informe mundial sobre salud mental", "."],
    ["PNUD. (2025). ", "Informe sobre Desarrollo Humano Perú 2025", "."],
    ["Singh, B., et al. (2023). Physical activity interventions for depression, anxiety and distress. ", "British Journal of Sports Medicine, 57", "(18), 1203–1209."],
    ["World Health Organization. (2024). ", "Global status report on alcohol and health and treatment of substance use disorders", "."],
  ];
  const refRuns = (list) => {
    const runs = [];
    list.forEach((r, j) => {
      const last = j === list.length - 1;
      // La viñeta se reemplaza luego por <a:buNone/> para dejar solo la sangría francesa.
      runs.push({ text: r[0], options: { bullet: { indent: 22 }, paraSpaceAfter: 8 } });
      runs.push({ text: r[1], options: { italic: true } });
      runs.push({ text: r[2], options: { breakLine: !last } });
    });
    return runs;
  };
  const refOpts = { y: 1.65, w: 5.865, h: 4.85, fontFace: BODY, fontSize: 12, color: COL.text, margin: 0, valign: "top", isTextBox: true };
  s.addText(refRuns(refs.slice(0, 6)), { x: 0.6, ...refOpts, objectName: "Referencias columna 1" });
  s.addText(refRuns(refs.slice(6)), { x: 6.865, ...refOpts, objectName: "Referencias columna 2" });
  s.addNotes(
    "Estas son las referencias que sustentan el análisis. " +
    "Incluyen estudios recientes sobre estrés académico, sueño, personalidad y actividad física, además de los informes de la OMS, el PNUD y Naciones Unidas. " +
    "Muchas gracias por su atención, quedo atenta a sus preguntas."
  );

  await pres.writeFile({ fileName: OUT });
  await postProcess(OUT);
  console.log("Generado:", OUT, HAS_LOGO ? "(con logo)" : "(logo: espacio reservado)");
}

// ---------- Ajustes de XML que pptxgenjs no expone ----------
async function postProcess(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));

  // 1) Colores del tema según la paleta.
  const themePath = "ppt/theme/theme1.xml";
  let theme = await zip.file(themePath).async("string");
  for (const [k, v] of Object.entries(THEME.colors)) {
    const re = new RegExp(`(<a:${k}>)[\\s\\S]*?(</a:${k}>)`);
    theme = theme.replace(re, `$1<a:srgbClr val="${v}"/>$2`);
  }
  theme = theme.replace(/(<a:clrScheme name=")[^"]*(")/, `$1${THEME.name}$2`);
  zip.file(themePath, theme);

  // 2) Ocultar las etiquetas en cero del gráfico apilado (series "Alto" y "Mediano Alto").
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/charts\/chart\d+\.xml$/.test(n))) {
    let xml = await zip.file(name).async("string");
    if (!xml.includes("Mediano Alto")) continue;
    xml = xml.replace(/<c:ser>[\s\S]*?<\/c:ser>/g, (ser) => {
      const valBlock = (ser.match(/<c:val>[\s\S]*?<\/c:val>/) || [""])[0];
      const zeros = [...valBlock.matchAll(/<c:pt idx="(\d+)">\s*<c:v>([^<]*)<\/c:v>/g)]
        .filter((m) => Number(m[2]) === 0).map((m) => m[1]);
      if (!zeros.length) return ser;
      const del = zeros.map((i) => `<c:dLbl><c:idx val="${i}"/><c:delete val="1"/></c:dLbl>`).join("");
      return ser.replace("<c:dLbls>", "<c:dLbls>" + del);
    });
    zip.file(name, xml);
  }

  // 3) pptxgenjs repite <a:pPr> antes de cada corrida de un mismo párrafo. Solo vale el primero.
  // 4) Referencias: sin viñeta, con sangría francesa.
  const slides = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
  for (const name of slides) {
    let xml = await zip.file(name).async("string");
    xml = xml.replace(/<\/a:r><a:pPr[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, "</a:r>");
    if (xml.includes("Referencias columna")) xml = xml.replace(/<a:buSzPct val="\d+"\/><a:buChar char="[^"]*"\/>/g, "<a:buNone/>").replace(/<a:buChar char="[^"]*"\/>/g, "<a:buNone/>");
    zip.file(name, xml);
  }

  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
