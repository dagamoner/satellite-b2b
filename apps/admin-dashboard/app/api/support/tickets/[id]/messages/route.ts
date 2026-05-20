import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { cookies } from "next/headers";
import { checkRole } from "../../../../../../lib/rbac";

export const dynamic = "force-dynamic";

/**
 * GET /api/support/tickets/[id]/messages
 * Obtiene el hilo de comunicación del ticket para el personal técnico.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { authorized, error, session } = await checkRole(["ADMIN", "SALES", "TECH"]);
    if (error) return error;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: { contract: { select: { technicianId: true } } }
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 });
    }

    if ((session.user as any).role === "TECH" && ticket.contract.technicianId !== (session.user as any).id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
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
    return NextResponse.json({ error: "Error al cargar el hilo de chat" }, { status: 500 });
  }
}

/**
 * POST /api/support/tickets/[id]/messages
 * Permite al equipo de operaciones responder al cliente.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { authorized, error, session } = await checkRole(["ADMIN", "SALES", "TECH"]);
    if (error) return error;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: { contract: { select: { technicianId: true } } }
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 });
    }

    if ((session.user as any).role === "TECH" && ticket.contract.technicianId !== (session.user as any).id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const { content, attachments, authorId } = await request.json();
    console.log("[API_ADMIN_MESSAGES] POST request received:", { ticketId: id, content, authorId });

    if (!content) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        content,
        attachments: attachments ? JSON.stringify(attachments) : null,
        ticketId: id,
        authorId: authorId, 
      },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });

    console.log("[API_ADMIN_MESSAGES] Message created successfully:", message.id);

    // Actualizar timestamp del ticket para que suba en el inbox
    // Y cambiar estado a IN_PROGRESS si es del staff
    await prisma.supportTicket.update({
      where: { id },
      data: { 
        updatedAt: new Date(),
        status: authorId ? "IN_PROGRESS" : undefined // Si hay authorId, es un técnico respondiendo
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error("[API_ADMIN_MESSAGES] POST error:", error);
    return NextResponse.json({ 
      error: "Error al enviar respuesta técnica", 
      details: error.message 
    }, { status: 500 });
  }
}
