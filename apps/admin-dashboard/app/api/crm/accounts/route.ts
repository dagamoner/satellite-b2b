import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

// GET /api/crm/accounts - Listar todas las cuentas de cliente
export async function GET(request: Request) {
  const session = await auth();

  if (!session || !["ADMIN", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: any = {};

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { taxId: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const accounts = await prisma.customerAccount.findMany({
      where,
      include: {
        contracts: {
          select: { id: true, contractNumber: true, status: true, planType: true }
        },
        invoices: {
          select: { id: true, amount: true, status: true }
        }
      },
      orderBy: { companyName: "asc" }
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("[GET /api/crm/accounts]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
