import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * GET /api/support/tickets/[id]/messages
 * Obtiene el hilo de comunicación del ticket para el operador NOC.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    cookies();
    const messages = await prisma.ticketMessage.findMany({
      where: { ticketId: id },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar el hilo de chat" }, { status: 500 });
  }
}

/**
 * POST /api/support/tickets/[id]/messages
 * Permite al operador NOC responder al cliente.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    cookies();
    const { content, attachments, authorId } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        content,
        attachments: attachments ? JSON.stringify(attachments) : null,
        ticketId: id,
        authorId: authorId, // ID del operador/técnico
      },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });

    // Actualizar timestamp del ticket para que suba en el inbox
    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ error: "Error al enviar respuesta técnica" }, { status: 500 });
  }
}
