import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { cookies } from "next/headers";
import { checkRole } from "../../../../../lib/rbac";

export const dynamic = "force-dynamic";

/**
 * GET /api/support/tickets/all
 * Retorna todos los tickets del sistema para el Dashboard Admin
 */
export async function GET() {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES", "TECH"]);
  if (error) return error;

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  try {
    // ---- VERIFICACIÓN AUTOMÁTICA DE 5 DÍAS DE INACTIVIDAD ----
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const inactiveTickets = await prisma.supportTicket.findMany({
      where: {
        updatedAt: { lt: fiveDaysAgo },
        status: { notIn: ["CLOSED", "RESOLVED"] },
        priority: { not: "CRITICAL" }
      },
      select: { id: true }
    });

    if (inactiveTickets.length > 0) {
      const inactiveIds = inactiveTickets.map(t => t.id);
      
      await prisma.supportTicket.updateMany({
        where: { id: { in: inactiveIds } },
        data: { priority: "CRITICAL", updatedAt: new Date() }
      });

      // Crear mensaje de sistema para cada ticket actualizado
      const systemMessages = inactiveIds.map(id => ({
        ticketId: id,
        content: `⚠️ EL SISTEMA HA CAMBIADO LA PRIORIDAD A: CRITICAL (Por inactividad de 5 días)`,
        authorId: null,
      }));
      
      await prisma.ticketMessage.createMany({
        data: systemMessages
      });
    }
    // -----------------------------------------------------------

    const tickets = await prisma.supportTicket.findMany({
      where: role === "TECH" ? {
        contract: {
          technicianId: userId
        }
      } : undefined,
      include: {
        contract: {
          select: {
            id: true,
            clientName: true,
            contractNumber: true,
          }
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("[ADMIN_TICKETS_ALL]", error);
    return NextResponse.json({ error: "Error al obtener tickets" }, { status: 500 });
  }
}
