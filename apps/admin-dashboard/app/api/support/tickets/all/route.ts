import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * GET /api/support/tickets/all
 * Retorna todos los tickets del sistema para el Dashboard Admin
 */
export async function GET() {
  await await await cookies(); // Force dynamic runtime
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        contract: {
          select: {
            id: true,
            clientName: true,
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
  } finally {
    await prisma.$disconnect();
  }
}
