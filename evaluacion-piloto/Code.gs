/**
 * Evaluación de desempeño · Piloto (Cornerstone Perú)
 * Aplicación web de Google Apps Script vinculada a una Hoja de cálculo.
 * Las respuestas se guardan en la hoja "Respuestas", una fila por evaluación.
 */

const NOMBRE_HOJA = 'Respuestas';
const ZONA_HORARIA = 'America/Lima';
const NO_APLICA = 'No aplica';
const NO_OBSERVADO = 'No tuve oportunidad de observarlo';

const MODELO = {
  escala: [
    { valor: 1, etiqueta: 'Insatisfecho', frecuencia: 'Raramente', rango: '0% a 39%' },
    { valor: 2, etiqueta: 'En Desarrollo', frecuencia: 'A veces', rango: '40% a 64%' },
    { valor: 3, etiqueta: 'Sólido / Requerido', frecuencia: 'Frecuentemente', rango: '65% a 84%' },
    { valor: 4, etiqueta: 'Sobresaliente', frecuencia: 'Casi siempre', rango: '85% a 94%' },
    { valor: 5, etiqueta: 'Excepcional / Modelo', frecuencia: 'Siempre', rango: '95% a 100%' }
  ],
  competencias: [
    {
      id: 'c1',
      nombre: 'Entusiasmo por el Cliente',
      definicion: 'Apertura y escucha activa para entender las necesidades del cliente (tanto interno como externo), resolviendo problemas con responsabilidad y cuidando la marca para asegurar la satisfacción, fidelización y recompra de servicios.',
      comportamientos: [
        { id: 'c1b1', nombre: 'Postura Consultiva', texto: 'Capacidad para posicionarse como un asesor estratégico de confianza ante clientes internos y externos, trascendiendo la ejecución transaccional de pedido',
          textoYo: 'Me posiciono como asesor/a estratégico/a de confianza ante clientes internos y externos, trascendiendo la ejecución transaccional de pedido' },
        { id: 'c1b2', nombre: 'Responsabilidad en la Solución', texto: 'Se hace dueño de los problemas y consultas del cliente (interno o externo), asegurando respuestas oportunas y soluciones efectivas sin trasladar fricción interna.',
          textoYo: 'Me hago dueño/a de los problemas y consultas del cliente (interno o externo), asegurando respuestas oportunas y soluciones efectivas sin trasladar fricción interna.' },
        { id: 'c1b3', nombre: 'Recompra y Profundización', texto: 'Ejecuta acciones concretas de fidelización y se esfuerza por conocer al cliente (interno o externo), maximizando el valor de una relación a largo plazo y la recompra de servicios.',
          textoYo: 'Ejecuto acciones concretas de fidelización y me esfuerzo por conocer al cliente (interno o externo), maximizando el valor de una relación a largo plazo y la recompra de servicios.' },
        { id: 'c1b4', nombre: 'Reputación y Experiencia', texto: 'Cuida rigurosamente la experiencia del cliente (interno y externo), en cada punto de contacto, resguardando la reputación de Cornerstone.',
          textoYo: 'Cuido rigurosamente la experiencia del cliente (interno y externo), en cada punto de contacto, resguardando la reputación de Cornerstone.' },
        { id: 'c1b5', nombre: 'Gestión de Objeciones', texto: 'Gestiona objeciones y situaciones críticas con madurez, preservando la relación comercial y la confianza del cliente/candidato a largo plazo.',
          textoYo: 'Gestiono objeciones y situaciones críticas con madurez, preservando la relación comercial y la confianza del cliente/candidato a largo plazo.', extra: NO_OBSERVADO }
      ]
    },
    {
      id: 'c2',
      nombre: 'Soñar en Grande',
      definicion: 'Mentalidad de crecimiento e innovación, adopta tecnologías y asume riesgos calculados para adaptar la operación, desafiar el statu quo y superar metas ambiciosas',
      comportamientos: [
        { id: 'c2b1', nombre: 'Agilidad y Adaptación', texto: 'Se adapta rápido a los cambios y asume nuevos retos con disposición.',
          textoYo: 'Me adapto rápido a los cambios y asumo nuevos retos con disposición.' },
        { id: 'c2b2', nombre: 'Innovación', texto: 'Propone nuevas ideas para mejorar la forma de trabajar y se anima a ponerlas en práctica, considerando sus riesgos.',
          textoYo: 'Propongo nuevas ideas para mejorar la forma de trabajar y me animo a ponerlas en práctica, considerando sus riesgos.' },
        { id: 'c2b3', nombre: 'Uso de Tecnología e IA', texto: 'Usa herramientas digitales e inteligencia artificial para hacer su trabajo mejor y más rápido.',
          textoYo: 'Uso herramientas digitales e inteligencia artificial para hacer mi trabajo mejor y más rápido.' },
        { id: 'c2b4', nombre: 'Planificación', texto: 'Planifica su trabajo con anticipación, define prioridades y se prepara para lo que viene.',
          textoYo: 'Planifico mi trabajo con anticipación, defino prioridades y me preparo para lo que viene.' },
        { id: 'c2b5', nombre: 'Superación de Metas', texto: 'Se pone metas retadoras y se esfuerza por superarlas, yendo más allá de lo que se le pide.',
          textoYo: 'Me pongo metas retadoras y me esfuerzo por superarlas, yendo más allá de lo que se me pide.' }
      ]
    },
    {
      id: 'c3',
      nombre: 'Hacer lo Correcto e Integridad',
      definicion: 'Actuación ética, transparente y coherente que garantiza la estricta confidencialidad de la información, el apego a las metodologías corporativas y la responsabilidad directa sobre los propios actos',
      comportamientos: [
        { id: 'c3b1', nombre: 'Confidencialidad Absoluta', texto: 'Custodia y garantiza la confidencialidad absoluta de la información estratégica de clientes, candidatos y de la organización.',
          textoYo: 'Custodio y garantizo la confidencialidad absoluta de la información estratégica de clientes, candidatos y de la organización.' },
        { id: 'c3b2', nombre: 'Liderar con el Ejemplo', texto: 'Lidera con el ejemplo, demostrando congruencia entre sus acciones y los valores de Cornerstone, aun bajo presión comercial o de tiempo.',
          textoYo: 'Lidero con el ejemplo, demostrando congruencia entre mis acciones y los valores de Cornerstone, aun bajo presión comercial o de tiempo.' },
        { id: 'c3b3', nombre: 'Accountability de Errores', texto: 'Admite abiertamente sus errores, asume la responsabilidad de sus actos y actúa consecuentemente para corregir el impacto generado.',
          textoYo: 'Admito abiertamente mis errores, asumo la responsabilidad de mis actos y actúo consecuentemente para corregir el impacto generado.' },
        { id: 'c3b4', nombre: 'Firmeza Ética', texto: 'Manifiesta con firmeza y respeto su disconformidad ante situaciones, acuerdos o hechos que considere no éticos o contrarios a la firma.',
          textoYo: 'Manifiesto con firmeza y respeto mi disconformidad ante situaciones, acuerdos o hechos que considere no éticos o contrarios a la firma.', extra: NO_OBSERVADO },
        { id: 'c3b5', nombre: 'Disciplina Metodológica', texto: 'Aplica las metodologías, políticas y procedimientos definidos por la firma, y propone mejoras para hacer más eficientes y consistentes las formas de trabajo.',
          textoYo: 'Aplico las metodologías, políticas y procedimientos definidos por la firma, y propongo mejoras para hacer más eficientes y consistentes las formas de trabajo.' }
      ]
    },
    {
      id: 'c4',
      nombre: 'Determinación y Pasión',
      definicion: 'Energía ejecutiva, perseverancia y sentido de urgencia para superar barreras y lograr los KPIs del negocio, proyectando orgullo constante por la propuesta de valor de Cornerstone',
      comportamientos: [
        { id: 'c4b1', nombre: 'Energía Ejecutiva', texto: 'Experimenta y transmite una profunda pasión por alcanzar las metas, inyectando alta energía ejecutiva en la gestión diaria.',
          textoYo: 'Experimento y transmito una profunda pasión por alcanzar las metas, inyectando alta energía ejecutiva en la gestión diaria.' },
        { id: 'c4b2', nombre: 'Perseverancia y Resiliencia', texto: 'Persevera ante obstáculos, objeciones y contingencias, tomando las decisiones necesarias en el debido momento para no detener el avance.',
          textoYo: 'Persevero ante obstáculos, objeciones y contingencias, tomando las decisiones necesarias en el debido momento para no detener el avance.' },
        { id: 'c4b3', nombre: 'Ownership de KPIs', texto: 'Asume la responsabilidad por sus resultados, identifica y resuelve problemas que afectan el cumplimiento de sus KPI y toma acciones oportunas para alcanzar los objetivos individuales y del equipo.',
          textoYo: 'Asumo la responsabilidad por mis resultados, identifico y resuelvo problemas que afectan el cumplimiento de mis KPI y tomo acciones oportunas para alcanzar los objetivos individuales y del equipo.' },
        { id: 'c4b4', nombre: 'Embajador de Marca', texto: 'Proyecta orgullo por la propuesta de valor de Cornerstone, actuando como un embajador activo de la marca en sus redes y entorno.',
          textoYo: 'Proyecto orgullo por la propuesta de valor de Cornerstone, actuando como embajador/a activo/a de la marca en mis redes y entorno.' },
        { id: 'c4b5', nombre: 'Sentido de Urgencia', texto: 'Actúa con sentido de urgencia y velocidad de respuesta para traducir los compromisos comerciales y operacionales en entregas concretas.',
          textoYo: 'Actúo con sentido de urgencia y velocidad de respuesta para traducir los compromisos comerciales y operacionales en entregas concretas.' }
      ]
    },
    {
      id: 'c5',
      nombre: 'Trabajo en Equipo y Colaboración',
      definicion: 'Articulación transversal y abierta entre áreas para priorizar los objetivos corporativos, compartiendo información, activando sinergias de cross-selling y promoviendo un buen clima de trabajo',
      comportamientos: [
        { id: 'c5b1', nombre: 'Sinergia Interáreas', texto: 'Fomenta y gestiona de manera eficiente la colaboración con otras áreas y Unidades de Negocio para lograr mejores resultados colectivos.',
          textoYo: 'Fomento y gestiono de manera eficiente la colaboración con otras áreas y Unidades de Negocio para lograr mejores resultados colectivos.' },
        { id: 'c5b2', nombre: 'Cross-selling Activo', texto: 'Identifica y promueve oportunidades de colaboración entre las Unidades de Negocio para generar nuevas oportunidades comerciales y fortalecer la propuesta de valor de la firma.',
          textoYo: 'Identifico y promuevo oportunidades de colaboración entre las Unidades de Negocio para generar nuevas oportunidades comerciales y fortalecer la propuesta de valor de la firma.' },
        { id: 'c5b3', nombre: 'Intercambio de Información', texto: 'Comparte de forma abierta información, contactos y conocimientos clave para mejorar la comprensión de otras partes y cerrar negocios en equipo.',
          textoYo: 'Comparto de forma abierta información, contactos y conocimientos clave para mejorar la comprensión de otras partes y cerrar negocios en equipo.' },
        { id: 'c5b4', nombre: 'Clima y Reconocimiento', texto: 'Promueve, facilita y contribuye activamente a mantener un buen clima de equipo, reconociendo el trabajo de sus compañeros.',
          textoYo: 'Promuevo, facilito y contribuyo activamente a mantener un buen clima de equipo, reconociendo el trabajo de mis compañeros.' },
        { id: 'c5b5', nombre: 'Feedback Maduro', texto: 'Ofrece y recibe retroalimentación constructiva con madurez, orientándola a la mejora continua y priorizando el objetivo corporativo de la firma.',
          textoYo: 'Ofrezco y recibo retroalimentación constructiva con madurez, orientándola a la mejora continua y priorizando el objetivo corporativo de la firma.' }
      ]
    },
    {
      id: 'c6',
      nombre: 'Iniciativa, Proactividad y Comunicación',
      definicion: 'Actúa con autonomía e iniciativa para identificar oportunidades de mejora, anticipar necesidades y resolver problemas, utilizando información y datos para tomar decisiones. Comunica sus ideas y avances con claridad y oportunidad, y promueve la colaboración para alcanzar los objetivos del negocio.',
      comportamientos: [
        { id: 'c6b1', nombre: 'Autonomía y Proactividad', texto: 'Actúa con autonomía para identificar oportunidades, anticipar necesidades y resolver problemas, tomando la iniciativa para proponer e implementar soluciones que contribuyan a los objetivos del negocio.',
          textoYo: 'Actúo con autonomía para identificar oportunidades, anticipar necesidades y resolver problemas, tomando la iniciativa para proponer e implementar soluciones que contribuyan a los objetivos del negocio.' },
        { id: 'c6b2', nombre: 'Toma de Decisiones Data-Driven', texto: 'Toma decisiones acertadas fundamentándose en el análisis sistemático de datos, métricas y reportes operacionales (Dashboards).',
          textoYo: 'Tomo decisiones acertadas fundamentándome en el análisis sistemático de datos, métricas y reportes operacionales (Dashboards).' },
        { id: 'c6b3', nombre: 'Comunicación Ejecutiva', texto: 'Se comunica con mucha facilidad y emplea un lenguaje fluido, estructurado y conciso acorde con el interlocutor (C-Level, equipo, cliente).',
          textoYo: 'Me comunico con mucha facilidad y empleo un lenguaje fluido, estructurado y conciso acorde con el interlocutor (C-Level, equipo, cliente).' },
        { id: 'c6b4', nombre: 'Escucha Activa y Alineamiento', texto: 'Escucha con atención e interés, y asegura que las partes involucradas se mantengan informadas sobre cambios o noticias del área y la firma.',
          textoYo: 'Escucho con atención e interés, y aseguro que las partes involucradas se mantengan informadas sobre cambios o noticias del área y la firma.' },
        { id: 'c6b5', nombre: 'Empoderamiento y Liderazgo', texto: 'Compromete y empodera a las personas/equipos, estableciendo objetivos claros, evaluando el desempeño objetivamente y brindando feedback.',
          textoYo: 'Comprometo y empodero a las personas/equipos, estableciendo objetivos claros, evaluando el desempeño objetivamente y brindando feedback.', extra: NO_APLICA, ayudaExtra: 'Elige No aplica si no tiene equipo a cargo.', ayudaExtraYo: 'Elige No aplica si no tienes equipo a cargo.' }
      ]
    }
  ],
  roles: ['Autoevaluación', 'Jefe directo evaluando a un colaborador'],
  tiempos: ['Menos de 10 minutos', 'Entre 10 y 20 minutos', 'Entre 20 y 30 minutos', 'Más de 30 minutos'],
  claridad: ['Sí', 'Más o menos', 'No']
};

/** Columnas de la tabla de resultados, en orden. */
function columnas_() {
  const cols = [
    { clave: 'fecha', titulo: 'Fecha y hora' },
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'area', titulo: 'Área' },
    { clave: 'cargo', titulo: 'Cargo' },
    { clave: 'rol', titulo: 'Rol en la evaluación' },
    { clave: 'evaluado', titulo: 'Colaborador evaluado' }
  ];
  MODELO.competencias.forEach(function (c) {
    c.comportamientos.forEach(function (b) {
      cols.push({ clave: b.id, titulo: c.nombre + ' · ' + b.nombre });
    });
    cols.push({ clave: 'com_' + c.id, titulo: c.nombre + ' · Comentario' });
  });
  cols.push({ clave: 'tiempo', titulo: '¿Cuánto tiempo te tomó completarla?' });
  cols.push({ clave: 'dificil', titulo: '¿Hubo algún comportamiento difícil de entender o de evaluar? ¿Cuál?' });
  cols.push({ clave: 'escala', titulo: '¿La escala fue clara?' });
  cols.push({ clave: 'cambios', titulo: '¿Qué cambiarías?' });
  cols.push({ clave: 'minutos', titulo: 'Tiempo registrado por el sistema (min)' });
  return cols;
}

function doGet() {
  const t = HtmlService.createTemplateFromFile('Index');
  t.modeloJson = JSON.stringify(MODELO).replace(/</g, '\\u003c');
  return t.evaluate()
    .setTitle('Evaluación de desempeño · Piloto')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Ejecutar una sola vez desde el editor para preparar la hoja. */
function configurar() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('LIBRO_ID', libro.getId());
  hoja_();
}

function hoja_() {
  const id = PropertiesService.getScriptProperties().getProperty('LIBRO_ID');
  const libro = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.getSheets().length === 1 && libro.getSheets()[0].getLastRow() === 0
      ? libro.getSheets()[0].setName(NOMBRE_HOJA)
      : libro.insertSheet(NOMBRE_HOJA);
  }
  if (hoja.getLastRow() === 0) {
    const titulos = columnas_().map(function (c) { return c.titulo; });
    hoja.getRange(1, 1, 1, titulos.length).setValues([titulos])
      .setFontWeight('bold').setWrap(true).setVerticalAlignment('top')
      .setBackground('#243042').setFontColor('#ffffff');
    hoja.setFrozenRows(1);
    hoja.setFrozenColumns(2);
    hoja.setColumnWidths(1, titulos.length, 160);
  }
  return hoja;
}

/** Evita que un texto escrito por el usuario se interprete como fórmula. */
function texto_(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max || 2000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function guardarRespuesta(r) {
  if (!r || typeof r !== 'object') throw new Error('No se recibieron respuestas.');
  const d = r.datos || {};
  ['nombre', 'area', 'cargo', 'rol'].forEach(function (k) {
    if (!String(d[k] || '').trim()) throw new Error('Faltan datos iniciales.');
  });
  if (MODELO.roles.indexOf(d.rol) < 0) throw new Error('Rol no válido.');
  const esJefe = d.rol === MODELO.roles[1];
  if (esJefe && !String(d.evaluado || '').trim()) throw new Error('Falta el nombre del colaborador evaluado.');

  const fila = {
    fecha: Utilities.formatDate(new Date(), ZONA_HORARIA, 'yyyy-MM-dd HH:mm'),
    nombre: texto_(d.nombre, 200),
    area: texto_(d.area, 200),
    cargo: texto_(d.cargo, 200),
    rol: d.rol,
    evaluado: esJefe ? texto_(d.evaluado, 200) : ''
  };

  const notas = r.notas || {};
  const comentarios = r.comentarios || {};
  MODELO.competencias.forEach(function (c) {
    c.comportamientos.forEach(function (b) {
      const v = notas[b.id];
      const n = Number(v);
      if (n >= 1 && n <= 5 && Math.floor(n) === n) fila[b.id] = n;
      else if (b.extra && v === b.extra) fila[b.id] = b.extra;
      else throw new Error('Falta calificar ' + b.nombre + '.');
    });
    fila['com_' + c.id] = texto_(comentarios[c.id]);
  });

  const ci = r.cierre || {};
  if (MODELO.tiempos.indexOf(ci.tiempo) < 0) throw new Error('Falta indicar cuánto tiempo te tomó.');
  if (MODELO.claridad.indexOf(ci.escala) < 0) throw new Error('Falta indicar si la escala fue clara.');
  fila.tiempo = ci.tiempo;
  fila.dificil = texto_(ci.dificil);
  fila.escala = ci.escala;
  fila.cambios = texto_(ci.cambios);
  const min = Number(r.minutos);
  fila.minutos = min > 0 && min < 1440 ? Math.round(min * 10) / 10 : '';

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    hoja_().appendRow(columnas_().map(function (c) { return fila[c.clave]; }));
  } finally {
    lock.releaseLock();
  }
  return true;
}
