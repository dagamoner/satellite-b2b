import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/support/tickets/[id]/messages
 * Obtiene todos los mensajes de un ticket específico.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { content, attachments, authorId } = await request.json();
    console.log("[API_CLIENT_MESSAGES] POST request received:", { ticketId: id, content, authorId });

    if (!content) {
      return NextResponse.json({ error: "El contenido es vacío" }, { status: 400 });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        content,
        attachments: attachments || null,
        ticketId: id,
        authorId: authorId || null, 
      },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });

    console.log("[API_CLIENT_MESSAGES] Message created successfully:", message.id);

    // Actualizar el updatedAt del ticket para ordenamiento
    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error("[API_CLIENT_MESSAGES] POST error:", error);
    return NextResponse.json({ 
      error: "Error al enviar mensaje",
      details: error.message 
    }, { status: 500 });
  }
}
