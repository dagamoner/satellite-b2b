import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { contractSchema } from "@repo/validation";
import { z } from "zod";
import type { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


// Genera un número de contrato único: MR-2026-XXXX
async function generateContractNumber(p: PrismaClient): Promise<string> {
  const year = new Date().getFullYear();
  const count = await p.installationContract.count();
  const seq = String(count + 1).padStart(4, "0");
  return `SOL-${year}-${seq}`;
}

// POST /api/contracts — Crear nuevo contrato desde el formulario del cliente
export async function POST(request: NextRequest) {
  // Force dynamic runtime to prevent build errors
  await await cookies();
  console.log("[API_CONTRACTS] VERSION_STABILIZED_V3");

  try {
    const body = await request.json();

    // Validar con Zod (Servidor)
    const validation = contractSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      clientName,
      clientEmail,
      clientPhone,
      clientDni,
      companyName,
      address,
      city,
      province,
      equipmentType,
      planType,
      monthlyFee,
      installationNotes,
    } = validation.data;


    const contractNumber = await generateContractNumber(prisma);

    const contract = await prisma.installationContract.create({
      data: {
        contractNumber,
        clientName,
        clientEmail,
        clientPhone,
        clientDni,
        companyName: companyName || null,
        address,
        city: city || "Mendoza",
        province: province || "Mendoza",
        equipmentType,
        planType,
        monthlyFee: monthlyFee ? parseFloat(monthlyFee) : null,
        installationNotes: installationNotes || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        contractNumber: contract.contractNumber,
        id: contract.id,
        message: `Contrato ${contract.contractNumber} creado exitosamente.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/contracts]", error);
    return NextResponse.json(
      { error: "Error interno del servidor al crear el contrato." },
      { status: 500 }
    );
  }
}
