# Evaluación de desempeño · Piloto

Formulario web para probar el bloque de comportamiento antes de lanzarlo en BUK (16 al 20 de noviembre).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `Code.gs` | Contiene los textos de la evaluación y guarda las respuestas en la hoja |
| `Index.html` | La pantalla que ve cada persona |
| `vista-previa.html` | Copia para mirar el diseño en el navegador. No guarda respuestas |

## Publicarlo (unos 10 minutos, una sola vez)

1. Entra a Google Sheets con tu cuenta y crea una hoja en blanco. Ponle un nombre, por ejemplo **Piloto evaluación de desempeño · Respuestas**.
2. En el menú, ve a **Extensiones → Apps Script**.
3. En el archivo `Código.gs` borra todo y pega el contenido de `Code.gs`.
4. Junto a **Archivos**, haz clic en **+ → HTML** y llámalo exactamente `Index`. Borra lo que trae y pega el contenido de `Index.html`.
5. Guarda (ícono del disquete). En la barra superior elige la función **configurar** y presiona **Ejecutar**.
   Google te pedirá permisos porque el script escribe en tu hoja. Elige **Revisar permisos**, tu cuenta, luego **Configuración avanzada → Ir a … (no seguro)** y **Permitir**. El aviso aparece porque el script es tuyo y Google no lo ha revisado.
   Al terminar, tu hoja tendrá una pestaña **Respuestas** con los 47 encabezados.
6. Ve a **Implementar → Nueva implementación**. En el engranaje elige **Aplicación web** y configura:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier usuario
7. Presiona **Implementar** y copia la URL que termina en `/exec`. **Ese es el link para tu equipo.**
8. Ábrelo en una ventana de incógnito para confirmar que no pide iniciar sesión. Completa una evaluación de prueba y revisa que aparezca en la hoja. Luego borra esa fila.

Si en el paso 6 no aparece la opción **Cualquier usuario**, tu cuenta corporativa la tiene bloqueada. Usa una cuenta Gmail personal o pide a TI que la habilite.

## Qué ve cada persona

1. **Inicio:** para qué es el piloto, que no tiene consecuencias, el tiempo aproximado y la escala.
2. **Datos iniciales:** nombre, área, cargo y rol. Si elige *Jefe directo evaluando a un colaborador*, aparece el campo del colaborador evaluado.
3. **Seis pasos, uno por competencia:** la definición arriba y luego cada comportamiento con los 5 niveles visibles en cada botón. Al final de cada competencia hay un comentario opcional.
   - *Gestión de Objeciones* y *Firmeza Ética* tienen además **No tuve oportunidad de observarlo**.
   - *Empoderamiento y Liderazgo* tiene además **No aplica**.
4. **Cierre del piloto:** las 4 preguntas sobre la experiencia.

No deja avanzar si falta calificar algo y marca qué falta. El avance se guarda en el dispositivo, así que si alguien cierra la página por error retoma donde iba.

## Resultados

Todo queda en la pestaña **Respuestas** de tu hoja: una fila por evaluación y estas columnas:

- Fecha y hora, Nombre, Área, Cargo, Rol en la evaluación, Colaborador evaluado
- Los 30 comportamientos (de 1 a 5, o el texto *No aplica* o *No tuve oportunidad de observarlo*), cada competencia seguida de su comentario
- Las 4 preguntas de cierre
- **Tiempo registrado por el sistema (min):** minutos desde que la persona presionó *Comenzar* hasta que envió. Incluye pausas, así que conviene compararlo con el tiempo que cada persona declaró.

La hoja es privada. Tu equipo solo usa el formulario y no puede ver ni abrir las respuestas.
Para descargarla: **Archivo → Descargar → Microsoft Excel o CSV**.

## Si cambias algo después

Los textos están en `Code.gs`, dentro de `MODELO`. Si editas el código, publica el cambio en **Implementar → Gestionar implementaciones → lápiz → Versión: Nueva versión → Implementar**. Así se mantiene el mismo link.

## A tener en cuenta

- En la parte superior Google muestra el aviso *“Esta aplicación fue creada por un usuario de Google Apps Script”*. Es normal en este tipo de formularios. Conviene mencionarlo al compartir el link.
- Cualquier persona que tenga el link puede responder. Compártelo solo con tu equipo.
