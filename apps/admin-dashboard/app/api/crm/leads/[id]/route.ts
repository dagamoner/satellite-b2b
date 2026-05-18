import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../../auth";

export const dynamic = "force-dynamic";

// PUT /api/crm/leads/[id] - Actualizar un lead específico y automatizar transiciones
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || !["ADMIN", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      clientName,
      companyName,
      email,
      phone,
      source,
      status, // NEW, CONTACTED, FEASIBILITY, WON, LOST
      latitude,
      longitude,
      notes,
      assignedToId
    } = body;

    // 1. Obtener el lead original antes de actualizar para ver la transición de estado
    const originalLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!originalLead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    // 2. Realizar la actualización del Lead
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        clientName: clientName !== undefined ? clientName : undefined,
        companyName: companyName !== undefined ? companyName : undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        source: source !== undefined ? source : undefined,
        status: status !== undefined ? status : undefined,
        latitude: latitude !== undefined ? (latitude ? parseFloat(latitude) : null) : undefined,
        longitude: longitude !== undefined ? (longitude ? parseFloat(longitude) : null) : undefined,
        notes: notes !== undefined ? notes : undefined,
        assignedToId: assignedToId !== undefined ? assignedToId : undefined,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // 3. Registrar actividad si el estado cambió
    if (status && originalLead.status !== status) {
      await prisma.clientActivity.create({
        data: {
          type: "NOTE",
          title: `Tránsito de Estado: ${originalLead.status} ➡️ ${status}`,
          description: `El lead cambió de estado en el embudo comercial. Modificado por ${session.user.name}.`,
          createdById: (session.user as any).id,
          leadId: id,
        }
      });
    }

    // 4. AUTOMATIZACIÓN CRÍTICA: Si el estado cambia a WON (Ganado), crear cuenta y contrato borrador
    if (status === "WON" && originalLead.status !== "WON") {
      // A. Crear o buscar CustomerAccount
      const taxId = "CUIT-" + Math.floor(10000000 + Math.random() * 90000000); // placeholder único de CUIT
      const email = updatedLead.email || `cliente-${updatedLead.id}@mrtechnology.com`;

      let account = await prisma.customerAccount.findFirst({
        where: {
          OR: [
            { email: email }
          ]
        }
      });

      if (!account) {
        account = await prisma.customerAccount.create({
          data: {
            companyName: updatedLead.companyName || updatedLead.clientName,
            taxId,
            phone: updatedLead.phone || "No provisto",
            email: email,
            address: "Valle de Uco, Mendoza, Argentina", // Dirección base
            city: "Mendoza",
            province: "Mendoza",
            country: "Argentina",
            tier: "STANDARD",
          }
        });

        // Registrar actividad de cuenta creada
        await prisma.clientActivity.create({
          data: {
            type: "NOTE",
            title: "Cuenta corporativa creada automáticamente",
            description: `Cuenta generada a partir del lead comercial ${updatedLead.leadNumber} marcado como GANADO.`,
            createdById: (session.user as any).id,
            accountId: account.id,
          }
        });
      }

      // B. Crear orden de Instalación (Contrato) Borrador para el NOC
      const contractCount = await prisma.installationContract.count();
      const contractNumber = `CONTR-${2000 + contractCount + 1}`;

      const newContract = await prisma.installationContract.create({
        data: {
          contractNumber,
          status: "PENDING",
          clientName: updatedLead.clientName,
          clientEmail: email,
          clientPhone: updatedLead.phone,
          clientDni: taxId,
          companyName: updatedLead.companyName,
          address: "Valle de Uco, Mendoza, Argentina",
          city: "Mendoza",
          province: "Mendoza",
          country: "Argentina",
          equipmentType: "STARLINK_BUSINESS",
          planType: "Plan Comercial Standard (Starlink)",
          monthlyFee: 85000.00,
          latitude: updatedLead.latitude,
          longitude: updatedLead.longitude,
          accountId: account.id,
        }
      });

      // Registrar actividad técnica vinculada a la cuenta
      await prisma.clientActivity.create({
        data: {
          type: "NOC_SYSTEM",
          title: "Orden de instalación satelital iniciada",
          description: `Se abrió la orden técnica #${newContract.contractNumber} en estado PENDIENTE. Lista para asignación de técnico de campo.`,
          createdById: (session.user as any).id,
          accountId: account.id,
        }
      });
    }

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error("[PUT /api/crm/leads/[id]]", error);
    return NextResponse.json({ error: "Error al actualizar el lead" }, { status: 500 });
  }
}

// DELETE /api/crm/leads/[id] - Eliminar un lead
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Eliminar actividades asociadas primero
    await prisma.clientActivity.deleteMany({
      where: { leadId: id }
    });

    await prisma.lead.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Lead eliminado correctamente" });
  } catch (error) {
    console.error("[DELETE /api/crm/leads/[id]]", error);
    return NextResponse.json({ error: "Error al eliminar el lead" }, { status: 500 });
  }
}
