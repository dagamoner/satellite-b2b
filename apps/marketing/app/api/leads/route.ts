import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

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
    const { name, razonSocial, nombreFantasia, email, phone, dni, type, message, planName, cbu, clientCategory, rubro, province, departamento, city, otherCity, street, houseNumber, zipCode, installationPrice, antennaModel } = await request.json();

    if (!name || !email || !dni || !type || !province || !street) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }
    let finalCity = city === "Otra localidad" ? otherCity : city;
    if (departamento) {
      finalCity = `${finalCity} (Depto: ${departamento})`;
    }

    // Guardar la nueva localidad si es personalizada
    if (city === "Otra localidad" && otherCity && province) {
      try {
        await db.customLocation.upsert({
          where: {
            province_city: {
              province,
              city: otherCity.trim()
            }
          },
          update: {},
          create: {
            province,
            city: otherCity.trim()
          }
        });
      } catch (locErr) {
        console.error("Error al guardar la localidad personalizada:", locErr);
      }
    }
    
    // Extraer números del importe o null
    let parsedPrice = null;
    if (installationPrice && installationPrice.includes("$")) {
      const nums = installationPrice.replace(/\D/g, "");
      if (nums) parsedPrice = parseFloat(nums);
    } else if (installationPrice === "Bonificado (100% OFF)") {
      parsedPrice = 0;
    }

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
        antennaModel: antennaModel || "POR_DEFINIR",
        installationPrice: parsedPrice,
        address: `${street} ${houseNumber}`.trim(),
        city: finalCity,
        province: province,
        street,
        houseNumber,
        zipCode,
        installationNotes: `Interés inicial: ${type}. Nombre Fantasía: ${nombreFantasia || "N/A"}. Antena: ${antennaModel}. Instalación: ${installationPrice}. Mensaje: ${message}`,
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
        estimatedValue: parsedPrice || 150000,
        planInterest: planName,
        notes: `Antena: ${antennaModel}. Instalación: ${installationPrice}. Mensaje: ${message}. Solicitud de antena vía web. Tipo: ${type}. DNI: ${dni}. Mensaje: ${message || "Sin mensaje"}`,
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

    // 4. Enviar emails vía Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const fromClient = "MR Technology <no-reply@mrtechnology.it.com>";
        const fromSystem = "Sistema B2B <alertas@mrtechnology.it.com>";
        
        const adminEmailRaw = process.env.ADMIN_EMAIL || "ventas@mrtechnology.it.com";
        const techEmailRaw = process.env.TECH_EMAIL || "soporte@mrtechnology.it.com";

        // Soportar múltiples correos separados por coma
        const adminEmails = adminEmailRaw.split(',').map(e => e.trim());
        const techEmails = techEmailRaw.split(',').map(e => e.trim());

        await Promise.all([
          // 4.1 Email al Cliente
          resend.emails.send({
            from: fromClient,
            to: email,
            subject: `Solicitud Recibida - ${contract.contractNumber}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #0284c7; margin: 0;">MR Technology</h1>
                  <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Conectividad Satelital B2B</p>
                </div>
                <h2 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Solicitud de Servicio Recibida</h2>
                <p style="font-size: 16px;">Hola <strong>${name}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.5;">Hemos recibido correctamente tu solicitud de servicio para el plan/hardware: <strong>${planName || type}</strong>.</p>
                <p style="font-size: 16px;">Tu número de seguimiento y de solicitud es:</p>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #cbd5e1;">
                  <span style="font-size: 28px; font-weight: bold; color: #0284c7; font-family: monospace;">${contract.contractNumber}</span>
                </div>
                <p style="font-size: 16px; line-height: 1.5;">Un representante técnico de nuestro equipo se contactará a la brevedad al teléfono proporcionado (${phone}) o a este mismo correo electrónico para coordinar los siguientes pasos y realizar el relevamiento técnico si corresponde.</p>
                <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">Podés realizar el seguimiento de tu instalación y acceder a tu documentación en cualquier momento desde nuestro <strong>Portal de Clientes</strong> utilizando tu DNI y tu número de solicitud:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_PORTAL_URL || 'https://satellite-b2b-client-portal.vercel.app'}" style="background-color: #0284c7; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 16px;">Acceder al Portal de Clientes</a>
                </div>
                <br/>
                <p style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">Este es un mensaje automático del Portal B2B de MR Technology. Por favor no respondas a este correo.</p>
              </div>
            `,
          }),

          // 4.2 Email a Administrativos (Ventas)
          resend.emails.send({
            from: fromSystem,
            to: adminEmails,
            subject: `Nuevo Lead B2B: ${planName || type} - ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; border-top: 5px solid #10b981; background-color: #ffffff;">
                <h2 style="color: #047857; margin-top: 0;">¡Nuevo Lead desde la Web!</h2>
                <p style="font-size: 16px;">Ha ingresado una nueva solicitud de servicio. Por favor, contactar a la brevedad para cerrar la venta.</p>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8; font-size: 15px;">
                    <li><strong>Cliente:</strong> ${name}</li>
                    <li><strong>DNI/CUIT:</strong> ${dni}</li>
                    <li><strong>Empresa:</strong> ${razonSocial || nombreFantasia || "N/A"}</li>
                    <li><strong>Teléfono:</strong> <a href="tel:${phone}" style="color: #0284c7;">${phone}</a></li>
                    <li><strong>Email:</strong> <a href="mailto:${email}" style="color: #0284c7;">${email}</a></li>
                    <li><strong>Plan / Interés:</strong> ${planName || type}</li>
                    <li><strong>Localidad:</strong> ${finalCity}, ${province}</li>
                  </ul>
                </div>
                <p style="font-size: 14px; background-color: #fffbeb; color: #b45309; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px;"><strong>Mensaje del cliente:</strong><br/>${message || "Sin mensaje adicional."}</p>
                <div style="text-align: center; margin-top: 30px;">
                  <span style="font-size: 12px; color: #64748b;">N° Contrato CRM: ${contract.contractNumber}</span>
                </div>
              </div>
            `,
          }),

          // 4.3 Email a Técnicos (Aviso de Instalación)
          resend.emails.send({
            from: fromSystem,
            to: techEmails,
            subject: `Pre-aviso tecnico: Posible instalacion en ${finalCity}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; border-top: 5px solid #0ea5e9; background-color: #ffffff;">
                <h2 style="color: #0369a1; margin-top: 0;">Pre-Aviso de Instalación / Relevamiento</h2>
                <p style="font-size: 16px;">Ventas ha recibido un nuevo Lead. Este es un aviso temprano para que el equipo técnico pueda ir previendo el equipamiento y analizando la factibilidad de la zona.</p>
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bae6fd;">
                  <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8; font-size: 15px;">
                    <li><strong>Ticket N°:</strong> ${ticket.ticketNumber}</li>
                    <li><strong>Zona / Localidad:</strong> ${finalCity}, ${province}</li>
                    <li><strong>Dirección:</strong> ${street} ${houseNumber}</li>
                    <li><strong>Hardware Solicitado:</strong> ${antennaModel || "Por definir"}</li>
                    <li><strong>Tipo de Plan:</strong> ${planName || type}</li>
                  </ul>
                </div>
                <p style="font-size: 14px; color: #475569;"><em>Nota: Esperar la confirmación y pago por parte de administración antes de despachar equipos.</em></p>
              </div>
            `,
          })
        ]);
        console.log("[RESEND] Correos enviados exitosamente (Cliente, Admin, Técnico)");
      } catch (emailError) {
        console.error("[RESEND_ERROR] No se pudo enviar el correo:", emailError);
      }
    } else {
      console.warn("No RESEND_API_KEY provided. Skipping emails.");
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
