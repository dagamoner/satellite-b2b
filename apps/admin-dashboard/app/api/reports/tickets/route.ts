import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@repo/database";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await cookies(); // Force dynamic runtime
  
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  try {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (priority && priority !== "ALL") {
      where.priority = priority;
    }

    const tickets = await db.supportTicket.findMany({
      where,
      include: {
        contract: {
          select: {
            contractNumber: true,
            clientName: true,
            clientEmail: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Generate CSV
    const headers = [
      "Numero de Ticket",
      "Titulo",
      "Categoria",
      "Estado",
      "Prioridad",
      "Fecha Creacion",
      "Contrato",
      "Cliente",
      "Email Cliente",
      "Descripcion"
    ];

    const rows = tickets.map(t => [
      t.ticketNumber,
      t.title,
      t.category,
      t.status,
      t.priority,
      t.createdAt.toISOString(),
      t.contract.contractNumber,
      t.contract.clientName,
      t.contract.clientEmail,
      t.description
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=reporte-tickets-${new Date().toISOString().split('T')[0]}.csv`
      }
    });

  } catch (error) {
    console.error("[REPORT_TICKETS] Error:", error);
    return NextResponse.json({ error: "Error al generar el reporte" }, { status: 500 });
  }
}
