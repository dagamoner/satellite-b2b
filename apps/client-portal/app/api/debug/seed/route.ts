import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    cookies();
    console.log("Iniciando Emergency Seed...");

    // 1. Crear Técnico de prueba si no existe
    const tech = await db.user.upsert({
      where: { email: "tech@mrtechnology.com" },
      update: {},
      create: {
        email: "tech@mrtechnology.com",
        name: "Soporte Técnico Satelital",
        role: "TECH",
      },
    });

    // 2. Crear Contrato de prueba si no existe
    const contract = await db.installationContract.upsert({
      where: { contractNumber: "MR-2026-0001" },
      update: {},
      create: {
        contractNumber: "MR-2026-0001",
        clientDni: "12345678",
        clientName: "Usuario de Prueba B2B",
        clientEmail: "test@client.com",
        serviceType: "STARLINK_B2B",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Seed completado con éxito",
      data: {
        technician: tech.email,
        contract: contract.contractNumber,
        dni: contract.clientDni
      }
    });
  } catch (error: any) {
    console.error("Error en Emergency Seed:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
