import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../../auth";

export const dynamic = "force-dynamic";

// GET /api/crm/accounts/[id] - Obtener la Ficha 360 del Cliente
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || !["ADMIN", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const account = await prisma.customerAccount.findUnique({
      where: { id },
      include: {
        contracts: {
          orderBy: { createdAt: "desc" }
        },
        invoices: {
          orderBy: { dueDate: "desc" }
        },
        activities: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!account) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ account });
  } catch (error) {
    console.error("[GET /api/crm/accounts/[id]]", error);
    return NextResponse.json({ error: "Error al obtener la cuenta del cliente" }, { status: 500 });
  }
}
