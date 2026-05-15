import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@repo/database";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

  try {
    const { pdfBase64, fileName, clientEmail, clientName } = await request.json();

    if (!pdfBase64) {
      return NextResponse.json({ error: "No PDF data provided" }, { status: 400 });
    }

    // 1. Enviar el email con el adjunto
    const { data, error } = await resend.emails.send({
      from: "MR Technology <onboarding@resend.dev>", // Cambiar por dominio verificado luego
      to: [clientEmail],
      subject: "Certificado de Instalación Exitosa - MR Technology",
      html: `
        <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Instalación Finalizada con Éxito!</h2>
          <p>Estimado/a <strong>${clientName}</strong>,</p>
          <p>Nos complace informarle que la instalación de su servicio satelital ha sido completada y auditada correctamente.</p>
          <p>Adjunto a este correo encontrará su <strong>Certificado de Instalación y Auditoría Técnica</strong>, el cual incluye los detalles de su plan, pruebas de velocidad y el anexo fotográfico de la obra.</p>
          <br/>
          <p>Gracias por confiar en <strong>MR Technology</strong>.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 0.8rem; color: #64748b;">Este es un mensaje automático, por favor no responda a este correo.</p>
        </div>
      `,
      attachments: [
        {
          filename: fileName || "Certificado_Instalacion.pdf",
          content: pdfBase64.split(",")[1], // Eliminar el prefijo data:application/pdf;base64,
        },
      ],
    });

    if (error) {
      console.error("[EMAIL_ERROR]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API_SEND_CERTIFICATE] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
