import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * POST /api/support/auth
 * Valida la identidad del cliente mediante DNI y Número de Contrato.
 * Esto permite un acceso rápido al soporte técnico.
 */
export async function POST(request: NextRequest) {
  try {
    cookies();
    const { dni, contractNumber } = await request.json();

    if (!dni || !contractNumber) {
      return NextResponse.json(
        { error: "DNI y Número de Contrato son requeridos." },
        { status: 400 }
      );
    }

    // Buscar el contrato que coincida con ambos datos
    const contract = await prisma.installationContract.findFirst({
      where: {
        AND: [
          { clientDni: String(dni) },
          { contractNumber: String(contractNumber) }
        ]
      },
      select: {
        id: true,
        contractNumber: true,
        clientName: true,
        status: true,
      }
    });

    if (!contract) {
      // MOCK LOGIN para desarrollo/testing
      if (dni === "demo" && contractNumber === "demo") {
        return NextResponse.json({
          success: true,
          user: {
            contractId: "demo-id",
            contractNumber: "MR-DEMO",
            name: "Cliente Demo"
          }
        });
      }

      return NextResponse.json(
        { error: "Los datos no coinciden con ningún contrato activo." },
        { status: 401 }
      );
    }

    // En un sistema real aquí se generaría un JWT. 
    // Para esta fase, devolveremos los datos del contrato para "loguear" la sesión en el cliente.
    return NextResponse.json({
      success: true,
      user: {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        name: contract.clientName
      }
    });

  } catch (error) {
    console.error("[SUPPORT_AUTH_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
