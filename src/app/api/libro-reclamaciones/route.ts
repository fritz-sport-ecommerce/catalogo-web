import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Cargar la API key de Resend desde variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // 1. Generar PDF profesional
    const pdfBytes = await generateReclamoPDF(data);
    // 2. Enviar correo a ambos destinatarios
    try {
      await sendReclamoEmail(data, pdfBytes);
    } catch (emailError) {
      console.error('Error enviando el correo:', emailError);
      return NextResponse.json({ error: 'No se pudo enviar el PDF por correo electrónico. Intenta nuevamente o contacta soporte.' }, { status: 500 });
    }
    // 3. Devolver el PDF para descarga
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reclamo-${data.nombre}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al procesar el reclamo' }, { status: 500 });
  }
}

// Función para generar el PDF profesional
type ReclamoData = {
  nombre: string;
  documentoTipo: string;
  documentoNumero: string;
  direccion: string;
  email: string;
  telefono: string;
  establecimiento: string;
  ruc: string;
  direccionEstablecimiento: string;
  emailEstablecimiento: string;
  fechaIncidente: string;
  descripcion: string;
  expectativa: string;
  acepto: boolean;
  fechaRecepcion: string;
};

async function generateReclamoPDF(data: ReclamoData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  let y = height - 60;

  // Encabezado centrado y destacado
  page.drawText('FRITZ SPORT SAC', { x: width / 2 - 100, y, size: 24, font: fontBold, color: rgb(0.8, 0, 0) });
  y -= 28;
  page.drawText('LIBRO DE RECLAMACIONES VIRTUAL', { x: width / 2 - 130, y, size: 16, font: fontBold, color: rgb(0, 0, 0) });
  y -= 18;
  // Línea horizontal
  page.drawLine({ start: { x: 40, y: y }, end: { x: width - 40, y: y }, thickness: 1, color: rgb(0.8, 0, 0) });
  y -= 30;

  // Recuadro: Datos del Consumidor
  page.drawRectangle({ x: 40, y: y - 100, width: width - 80, height: 100, borderColor: rgb(0.8, 0, 0), borderWidth: 1 });
  page.drawText('Datos del Consumidor', { x: 50, y: y - 20, size: 13, font: fontBold, color: rgb(0.8, 0, 0) });
  page.drawText(`Nombre: ${data.nombre}`, { x: 60, y: y - 38, size: 11, font });
  page.drawText(`Tipo/N° Documento: ${data.documentoTipo} - ${data.documentoNumero}`, { x: 220, y: y - 38, size: 11, font });
  page.drawText(`Dirección: ${data.direccion}`, { x: 60, y: y - 54, size: 11, font });
  page.drawText(`Correo: ${data.email}`, { x: 60, y: y - 70, size: 11, font });
  page.drawText(`Teléfono: ${data.telefono}`, { x: 320, y: y - 70, size: 11, font });
  y -= 110;

  // Recuadro: Datos del Establecimiento
  page.drawRectangle({ x: 40, y: y - 80, width: width - 80, height: 80, borderColor: rgb(0.2, 0.2, 0.2), borderWidth: 1 });
  page.drawText('Datos del Establecimiento', { x: 50, y: y - 20, size: 13, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(`Nombre: ${data.establecimiento}`, { x: 60, y: y - 38, size: 11, font });
  page.drawText(`RUC: ${data.ruc}`, { x: 320, y: y - 38, size: 11, font });
  page.drawText(`Dirección: ${data.direccionEstablecimiento}`, { x: 60, y: y - 54, size: 11, font });
  page.drawText(`Correo: ${data.emailEstablecimiento}`, { x: 60, y: y - 70, size: 11, font });
  y -= 90;

  // Recuadro: Detalle del Reclamo
  page.drawRectangle({ x: 40, y: y - 120, width: width - 80, height: 120, borderColor: rgb(0.8, 0.5, 0), borderWidth: 1 });
  page.drawText('Detalle del Reclamo', { x: 50, y: y - 20, size: 13, font: fontBold, color: rgb(0.8, 0.5, 0) });
  page.drawText(`Fecha del incidente: ${data.fechaIncidente}`, { x: 60, y: y - 38, size: 11, font });
  page.drawText('Descripción:', { x: 60, y: y - 54, size: 11, font: fontBold });
  page.drawText(data.descripcion, { x: 130, y: y - 54, size: 10, font, maxWidth: 400 });
  page.drawText('Solución esperada:', { x: 60, y: y - 86, size: 11, font: fontBold });
  page.drawText(data.expectativa, { x: 170, y: y - 86, size: 10, font, maxWidth: 360 });
  y -= 130;

  // Declaración y fecha
  page.drawRectangle({ x: 40, y: y - 60, width: width - 80, height: 60, borderColor: rgb(0.2, 0.5, 0.2), borderWidth: 1 });
  page.drawText('Declaración jurada', { x: 50, y: y - 20, size: 12, font: fontBold, color: rgb(0.2, 0.5, 0.2) });
  page.drawText('Yo, como usuario, declaro bajo juramento que la información proporcionada es verídica y correcta.', { x: 60, y: y - 38, size: 10, font, maxWidth: width - 120 });
  page.drawText(`Fecha de recepción: ${data.fechaRecepcion}`, { x: 60, y: y - 54, size: 10, font });
  y -= 70;

  // Nota legal importante
  const nota = 'Nota importante: De acuerdo con la Ley N° 29571 (Ley de Protección y Defensa del Consumidor) y su reglamento, este Libro de Reclamaciones Virtual debe ser proporcionado en todo establecimiento que ofrezca bienes o servicios, y debe garantizar que el consumidor pueda expresar su reclamo de manera clara y recibir una respuesta en un plazo razonable.';
  page.drawText(nota, { x: 50, y: y - 20, size: 9, font, maxWidth: width - 100, color: rgb(0.3,0.3,0.3) });
  y -= 40;

  // Pie de página
  page.drawLine({ start: { x: 40, y: 60 }, end: { x: width - 40, y: 60 }, thickness: 1, color: rgb(0.8, 0, 0) });
  page.drawText('FRITZ SPORT SAC - Libro de Reclamaciones Virtual', { x: 50, y: 45, size: 10, font: fontBold, color: rgb(0.5, 0, 0) });
  page.drawText(`Generado el: ${new Date().toLocaleDateString()}`, { x: width - 180, y: 45, size: 10, font });

  return await pdfDoc.save();
}

// Función para enviar el correo con Resend
async function sendReclamoEmail(data: ReclamoData, pdfBytes: Uint8Array) {
  const recipients = ['legal@fritzsportsac.com' ,data.email, ];
  const subject = `Nuevo Reclamo - Libro de Reclamaciones Virtual`;
  const html = `<p>Estimado/a ${data.nombre},</p>
    <p>Su reclamo ha sido recibido correctamente. Adjuntamos el PDF con el detalle de su reclamo.</p>
    <p>Atentamente,<br/>Fritz Sport SAC</p>`;

  console.log('Enviando correo a:', recipients);
  try {
    await resend.emails.send({
      from: 'soporte@reclamos.fritzsport.pe',
      to: recipients,
      subject,
      html,
      attachments: [
        {
          filename: `reclamo-${data.nombre}.pdf`,
          content: Buffer.from(pdfBytes).toString('base64'),
        },
      ],
    });
    console.log('Correo enviado exitosamente a:', recipients);
  } catch (error) {
    console.error('Error al enviar el correo a:', recipients, error);
    throw error;
  }
} 