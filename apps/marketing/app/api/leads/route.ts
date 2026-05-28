import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  await cookies(); // Force dynamic runtime
  try {
    const { name, razonSocial, nombreFantasia, email, phone, dni, type, message, planName, cbu, clientCategory, rubro, province, city, otherCity, street, houseNumber, zipCode } = await request.json();

    if (!name || !email || !dni || !type || !province || !street) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }
    
    const finalCity = city === "Otra localidad" ? otherCity : city;

    const contractNumber = await generateLeadNumber();
    const ticketNumber = contractNumber; // Unificamos los números para trazabilidad absoluta

    // 1. Crear el Contrato en estado LEAD
    const contract = await db.installationContract.create({
      data: {
        contractNumber,
        status: "LEAD",
        clientName: name,
        companyName: razonSocial || undefined,
        clientEmail: email,
        clientPhone: phone || "Sin especificar",
        clientDni: dni,
        equipmentType: type === "HARDWARE" ? "SOLICITUD_HARDWARE" : "PENDIENTE",
        planType: planName || "POR_DEFINIR",
        address: `${street} ${houseNumber}`.trim(),
        city: finalCity,
        province: province,
        street,
        houseNumber,
        zipCode,
        installationNotes: `Interés inicial: ${type}. Nombre Fantasía: ${nombreFantasia || "N/A"}. Mensaje: ${message}`,
        cbu,
        clientCategory,
        rubro,
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

    // 3. Crear el Lead comercial en el CRM (crm_leads)
    const leadCount = await db.lead.count();
    const leadNumber = `L-${10000 + leadCount + 1}`;

    // Buscar un usuario administrador para asociar el lead y la actividad comercial
    const adminUser = await db.user.findFirst({
      where: { role: "ADMIN" }
    });

    const lead = await db.lead.create({
      data: {
        leadNumber,
        clientName: name,
        companyName: razonSocial || name,
        contactName: nombreFantasia || name,
        email,
        phone: phone || "Sin especificar",
        city: finalCity,
        source: "WEB_MARKETING",
        status: "NEW",
        estimatedValue: 150000, // Presupuesto inicial estimado estándar
        planInterest: planName || "POR_DEFINIR",
        notes: `Solicitud de antena vía web. Tipo: ${type}. DNI: ${dni}. Mensaje: ${message || "Sin mensaje"}`,
        assignedToId: adminUser?.id || null,
        cbu,
        clientCategory,
        rubro,
      }
    });

    // Registrar la actividad inicial de creación (crm_activities)
    if (adminUser) {
      await db.clientActivity.create({
        data: {
          type: "NOTE",
          title: "Lead creado (Web)",
          description: `Nuevo lead registrado desde la Landing Page. Plan de interés: ${planName || type}.`,
          createdById: adminUser.id,
          leadId: lead.id,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      contractNumber: contract.contractNumber,
      clientDni: contract.clientDni,
      ticketId: ticket.id,
      leadId: lead.id
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
