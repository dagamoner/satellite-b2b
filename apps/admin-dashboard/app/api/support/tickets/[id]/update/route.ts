import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";

/**
 * PATCH /api/support/tickets/[id]/update
 * Actualiza estado o prioridad del ticket y genera mensaje de sistema si es necesario.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();
    const { status, priority, operatorId } = body;

    // Obtener estado actual antes de actualizar
    const currentTicket = await prisma.supportTicket.findUnique({
      where: { id },
      select: { priority: true, status: true, ticketNumber: true }
    });

    if (!currentTicket) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 });
    }

    // Actualizar el ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: status || undefined,
        priority: priority || undefined,
        updatedAt: new Date()
      }
    });

    // Lógica de Mensajes Automáticos (User request: "1. Si")
    let systemMessage = "";
    
    if (priority && priority !== currentTicket.priority) {
      systemMessage = `⚠️ EL NOC HA CAMBIADO LA PRIORIDAD A: ${priority}`;
    } else if (status && status !== currentTicket.status) {
      const statusLabels: any = {
        'OPEN': 'ABIERTO',
        'IN_PROGRESS': 'EN PROCESO TÉCNICO',
        'RESOLVED': 'RESUELTO',
        'CLOSED': 'FINALIZADO / CERRADO'
      };
      systemMessage = `🔄 ESTADO ACTUALIZADO: EL TICKET SE ENCUENTRA ${statusLabels[status] || status}`;
    }

    if (systemMessage) {
      await prisma.ticketMessage.create({
        data: {
          content: systemMessage,
          ticketId: id,
          authorId: operatorId || null, // Atribuido al operador que hizo el cambio
        }
      });
    }

    return NextResponse.json({ success: true, ticket: updatedTicket });

  } catch (error) {
    console.error("[TICKET_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Error al actualizar ticket" }, { status: 500 });
  }
}
