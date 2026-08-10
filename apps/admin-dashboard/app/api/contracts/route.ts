import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { cookies } from "next/headers";
import { checkRole } from "../../../lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/contracts — Listar todos los contratos (admin)
export async function GET(request: Request) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES", "TECH"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const technicianId = searchParams.get("technicianId");

    const where: any = {};
    if (status && status !== "ALL") where.status = status as any;
    
    // TECH can only see their own assigned contracts
    if ((session.user as any).role === "TECH") {
      where.technicianId = (session.user as any).id;
    } else {
      if (technicianId && technicianId !== "ALL") where.technicianId = technicianId;
    }

    const contracts = await prisma.installationContract.findMany({
      where,
      include: {
        technician: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contracts });
  } catch (error) {
    console.error("[GET /api/contracts]", error);
    return NextResponse.json({ error: "Error al obtener contratos." }, { status: 500 });
  }
}
