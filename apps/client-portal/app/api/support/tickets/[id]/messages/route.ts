import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * GET /api/support/tickets/[id]/messages
 * Obtiene todos los mensajes de un ticket específico.
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
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 });
  }
}

/**
 * POST /api/support/tickets/[id]/messages
 * Envía un nuevo mensaje al ticket.
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
      return NextResponse.json({ error: "El contenido es vacío" }, { status: 400 });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        content,
        attachments: attachments || null,
        ticketId: id,
        authorId: authorId || null, // null si es el cliente
      },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });

    // Actualizar el updatedAt del ticket para ordenamiento
    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("[POST_MESSAGE_ERROR]", error);
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 });
  }
}
