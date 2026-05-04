import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@repo/database";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Función para generar número de ticket TK-2026-0001
async function generateTicketNumber() {
  const year = new Date().getFullYear();
  const count = await db.supportTicket.count();
  const seq = String(count + 1).padStart(4, "0");
  return `TK-${year}-${seq}`;
}

/**
 * GET /api/support/tickets?contractId=...
 * Obtiene los tickets vinculados a un contrato.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contractId = searchParams.get("contractId");

  if (!contractId) {
    return NextResponse.json({ error: "contractId es requerido" }, { status: 400 });
  }

  try {
    await await cookies();
    const tickets = await db.supportTicket.findMany({
      where: { contractId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener tickets" }, { status: 500 });
  }
}

/**
 * POST /api/support/tickets
 * Crea un nuevo ticket de soporte.
 */
export async function POST(request: NextRequest) {
  try {
    await await cookies();
    const { contractId, title, description, category } = await request.json();

    if (!contractId || !title || !description || !category) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const ticketNumber = await generateTicketNumber();

    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        contractId,
        title,
        description,
        category,
        status: "OPEN",
        priority: "MEDIUM", // Prioridad inicial, el NOC la ajustará
        messages: {
          create: {
            content: `Ticket creado: ${description}`,
          }
        }
      },
      include: {
        messages: true
      }
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("[CREATE_TICKET_ERROR]", error);
    return NextResponse.json({ error: "Error al crear ticket" }, { status: 500 });
  }
}
