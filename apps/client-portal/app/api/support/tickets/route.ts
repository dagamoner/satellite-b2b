import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@repo/database";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

// Función para generar número de ticket TK-2026-0001
async function generateTicketNumber() {
  const year = new Date().getFullYear();
  const count = await db.supportTicket.count();
  const seq = String(count + 1).padStart(4, "0");
  return `SOL-${year}-${seq}`;
}

/**
 * GET /api/support/tickets
 * Obtiene los tickets vinculados a un contrato desde la sesión.
 */
export async function GET() {
  const session = await auth();
  const contractId = session?.user?.contractId;

  if (!contractId) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  try {
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
export async function POST(request: Request) {
  try {
    const session = await auth();
    const { title, description, category } = await request.json();
    const contractId = session?.user?.contractId;

    if (!contractId || !title || !description || !category) {
      return NextResponse.json({ error: "Faltan campos obligatorios o sesión no válida" }, { status: 400 });
    }

    // Generar el número de ticket
    let ticketNumber = "";
    
    if (category === "Contrato") {
      // Buscar si ya existe un ticket de contrato para evitar duplicación
      const existingTicket = await db.supportTicket.findFirst({
        where: {
          contractId,
          category: "Contrato"
        },
        include: {
          messages: true
        }
      });

      if (existingTicket) {
        return NextResponse.json({ success: true, ticket: existingTicket });
      }

      // 1. Obtener el número del contrato base (la solicitud original)
      const baseContract = await db.installationContract.findUnique({
        where: { id: contractId },
        select: { contractNumber: true }
      });
      
      const baseNumber = baseContract?.contractNumber || "SOL-0000-0000";
      
      // 2. Contar cuántos tickets de tipo contrato existen para este contratoId para la extensión
      const contractTicketsCount = await db.supportTicket.count({
        where: { 
          contractId,
          category: "Contrato"
        }
      });
      
      const extension = String(contractTicketsCount + 1).padStart(6, "0");
      ticketNumber = `${baseNumber}-C-${extension}`;
    } else {
      // Generador estándar para otras categorías
      ticketNumber = await generateTicketNumber();
    }

    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        contractId,
        title,
        description,
        category,
        status: "OPEN",
        priority: "MEDIUM",
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
