import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";

// GET /api/contracts — Listar todos los contratos (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const technicianId = searchParams.get("technicianId");

    const where: any = {};
    if (status && status !== "ALL") where.status = status as any;
    if (technicianId && technicianId !== "ALL") where.technicianId = technicianId;

    const contracts = await prisma.installationContract.findMany({
      where,
      include: {
        technician: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contracts });
  } catch (error) {
    console.error("[GET /api/contracts]", error);
    return NextResponse.json({ error: "Error al obtener contratos." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
