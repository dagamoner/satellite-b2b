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
