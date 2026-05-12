import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/support/tickets/[id]/messages
 * Obtiene todos los mensajes de un ticket específico y su metadata.
 * Permite acceso via Sesión o via DNI (para leads).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const pDni = searchParams.get("p_dni");

  try {
    const session = await auth();
    
    // Si no hay sesión, validamos por DNI
    if (!session && !pDni) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        contract: {
          select: {
            clientDni: true,
            clientName: true,
            clientEmail: true,
            clientPhone: true,
            planType: true,
            contractNumber: true,
            status: true,
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 });
    }

    // Validación de seguridad por DNI si no hay sesión
    if (!session && ticket.contract.clientDni !== pDni) {
      return NextResponse.json({ error: "DNI no coincide con el ticket" }, { status: 403 });
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

    return NextResponse.json({ 
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        contract: ticket.contract
      },
      messages 
    });
  } catch (error) {
    console.error("[GET_MESSAGES_ERROR]", error);
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
  const { searchParams } = new URL(request.url);
  const pDni = searchParams.get("p_dni");

  try {
    const session = await auth();
    
    // Si no hay sesión, validamos por DNI
    if (!session && !pDni) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el ticket existe y el DNI coincide (si no hay sesión)
    if (!session) {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id },
        include: { contract: { select: { clientDni: true } } }
      });
      if (!ticket || ticket.contract.clientDni !== pDni) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }

    const { content, attachments, authorId } = await request.json();

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
