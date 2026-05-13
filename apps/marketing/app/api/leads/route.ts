import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Generador de número de contrato para Leads
async function generateLeadNumber() {
  const year = new Date().getFullYear();
  const count = await db.installationContract.count();
  const seq = String(count + 1).padStart(4, "0");
  return `SOL-${year}-${seq}`;
}

// Generador de número de ticket
async function generateTicketNumber() {
  const year = new Date().getFullYear();
  const count = await db.supportTicket.count();
  const seq = String(count + 1).padStart(4, "0");
  return `TK-${year}-${seq}`;
}

export async function POST(request: NextRequest) {
  await await await cookies(); // Force dynamic runtime
  try {
    const { name, email, phone, dni, type, message, planName } = await request.json();

    if (!name || !email || !dni || !type) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const contractNumber = await generateLeadNumber();
    const ticketNumber = contractNumber; // Unificamos los números para trazabilidad absoluta

    // 1. Crear el Contrato en estado LEAD
    const contract = await db.installationContract.create({
      data: {
        contractNumber,
        status: "LEAD",
        clientName: name,
        clientEmail: email,
        clientPhone: phone || "Sin especificar",
        clientDni: dni,
        equipmentType: type === "HARDWARE" ? "SOLICITUD_HARDWARE" : "PENDIENTE",
        planType: planName || "POR_DEFINIR",
        address: "Pendiente de definición comercial",
        city: "Por definir",
        province: "Por definir",
        installationNotes: `Interés inicial: ${type}. Mensaje: ${message}`,
      }
    });

    // 2. Crear el Ticket de Preventa vinculado
    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        contractId: contract.id,
        title: `Interés Comercial: ${planName || type}`,
        description: message || `El cliente ${name} ha solicitado información sobre ${planName || type}.`,
        category: "Ventas",
        status: "OPEN",
        priority: "HIGH",
        messages: {
          create: {
            content: `Sistema: Se ha generado un nuevo lead desde la landing page. Cliente: ${name}. DNI: ${dni}. Plan: ${planName || type}.`,
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      contractNumber: contract.contractNumber,
      clientDni: contract.clientDni,
      ticketId: ticket.id
    });

  } catch (error: any) {
    console.error("[LEAD_API_ERROR]", error);
    // Devolvemos el mensaje de error real para diagnosticar en Vercel
    return NextResponse.json({ 
      error: "Error en la base de datos", 
      message: error.message,
      code: error.code // Código de error de Prisma (P2002, etc)
    }, { status: 500 });
  }
}
