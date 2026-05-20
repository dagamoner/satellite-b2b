import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@repo/database";
import { cookies } from "next/headers";
import { checkRole } from "../../../../lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { authorized, error } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const status = searchParams.get("status");

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

    const contracts = await db.installationContract.findMany({
      where,
      include: {
        technician: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Generate CSV
    const headers = [
      "Numero de Contrato",
      "Estado",
      "Fecha Creacion",
      "Cliente",
      "Email Cliente",
      "DNI Cliente",
      "Empresa",
      "Direccion",
      "Localidad",
      "Provincia",
      "Equipo",
      "Plan",
      "Tecnico",
      "S/N Kit",
      "Modelo Antena",
      "Ubicacion Antena",
      "Vel. Bajada (Mbps)",
      "Vel. Subida (Mbps)",
      "Latencia (ms)",
      "Fecha Instalacion",
      "Firma Tecnico",
      "DNI Tecnico",
      "Fecha Firma Tecnico",
      "Fecha Firma Cliente"
    ];

    const rows = contracts.map(c => [
      c.contractNumber,
      c.status,
      c.createdAt.toISOString(),
      c.clientName,
      c.clientEmail,
      c.clientDni,
      c.companyName || "",
      c.address,
      c.city || "",
      c.province || "",
      c.equipmentType,
      c.planType,
      c.technician?.name || c.techName || "",
      c.kitSerialNumber || "",
      c.antennaModel || "",
      c.antennaLocation || "",
      c.downloadSpeed || "",
      c.uploadSpeed || "",
      c.latency || "",
      c.installedAt ? c.installedAt.toISOString() : "",
      c.techName || "",
      c.techDni || "",
      c.techSignedAt ? c.techSignedAt.toISOString() : "",
      c.clientSignedAt ? c.clientSignedAt.toISOString() : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=reporte-instalaciones-${new Date().toISOString().split('T')[0]}.csv`
      }
    });

  } catch (error) {
    console.error("[REPORT_INSTALLATIONS] Error:", error);
    return NextResponse.json({ error: "Error al generar el reporte" }, { status: 500 });
  }
}
