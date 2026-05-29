"use server";

import { prisma } from "@repo/database";

export async function getTechnicians() {
  try {
    return await prisma.user.findMany({
      where: { role: "TECH" },
      select: { id: true, name: true }
    });
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
}

/**
 * Actualiza el estado de un ticket y opcionalmente guarda datos en el contrato vinculado.
 */
export async function updateTicketStatus(ticketId: string, status: string, contractData?: any) {
  try {
    let ticket = null;

    // 1. Intentar buscar por ID (UUID)
    if (ticketId && ticketId.length > 20) {
      ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        select: { id: true, contractId: true, ticketNumber: true }
      });
    }

    // 2. Si no se encontró, intentar buscar por ticketNumber (ej: SOL-2026-0067)
    if (!ticket && ticketId) {
      ticket = await prisma.supportTicket.findFirst({
        where: { ticketNumber: ticketId },
        select: { id: true, contractId: true, ticketNumber: true }
      });
    }

    // 3. Si sigue sin encontrarse y tenemos DNI, buscar el ticket abierto más reciente del cliente
    if (!ticket && contractData?.clientDni) {
      ticket = await prisma.supportTicket.findFirst({
        where: { 
          category: "Contrato",
          status: { in: ["OPEN", "CONTRACT_INITIATED", "LEAD"] },
          // Relacionar con el contrato que tenga ese DNI
          contract: {
            clientDni: contractData.clientDni
          }
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, contractId: true, ticketNumber: true }
      });
    }

    if (!ticket) throw new Error("No se encontró una solicitud activa para vincular estos datos.");

    // Validar firmas antes de transición de estado
    if (status === 'COMPLETED' && !contractData?.clientSignature) {
      const currentContract = await prisma.installationContract.findUnique({
        where: { id: ticket.contractId },
        select: { clientSignature: true }
      });
      if (!currentContract?.clientSignature) {
        throw new Error('No se puede completar el contrato sin la firma del cliente.');
      }
    }

    if (status === 'SIGNATURE_PENDING' && !contractData?.techSignature) {
      const currentContract = await prisma.installationContract.findUnique({
        where: { id: ticket.contractId },
        select: { techSignature: true }
      });
      if (!currentContract?.techSignature) {
        throw new Error('No se puede pasar a firma pendiente sin la firma del técnico.');
      }
    }

    const effectiveTicketId = ticket.id;

    // 2. Encontrar todos los tickets asociados a este contrato
    const relatedTickets = await prisma.supportTicket.findMany({
      where: { contractId: ticket.contractId }
    });

    // 3. Actualizar el estado de TODOS los tickets relacionados
    for (const t of relatedTickets) {
      await prisma.supportTicket.update({
        where: { id: t.id },
        data: { 
          status,
          updatedAt: new Date()
        }
      });

      await prisma.ticketMessage.create({
        data: {
          ticketId: t.id,
          content: `EL SISTEMA HA CAMBIADO EL ESTADO A: ${status.replace('_', ' ')}`,
          authorId: null, // Sistema
        }
      });
    }

    // 4. Si hay datos de contrato, actualizarlos
    if (contractData) {
      const mappedContractStatus = 
        status === "TECH_IN_PROGRESS" ? "IN_PROGRESS" :
        status === "SIGNATURE_PENDING" ? "SIGNATURE_PENDING" :
        status === "COMPLETED" ? "COMPLETED" :
        status === "CONTRACT_INITIATED" ? "APPROVED" :
        undefined;

      await prisma.installationContract.update({
        where: { id: ticket.contractId },
        data: {
          ...contractData,
          status: mappedContractStatus !== undefined ? mappedContractStatus : undefined
        }
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("[UPDATE_TICKET_STATUS_ERROR]", error);
    throw error;
  }
}

export async function saveInstallationContract(data: any) {
  try {
    // 1. Generar número de contrato correlativo si no viene
    const count = await prisma.installationContract.count();
    const contractNumber = `MR-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    // 2. Crear el registro en la base de datos
    const contract = await prisma.installationContract.create({
      data: {
        contractNumber,
        status: "COMPLETED",
        clientName: data.titular,
        clientEmail: data.email || "",
        clientPhone: data.telefono || "",
        clientDni: data.dni,
        address: data.ubicacion,
        city: data.ciudad || "Mendoza",
        equipmentType: data.producto === "Starlink Mini X" ? "MINI_X" : "STANDARD_V4",
        planType: "BASICO_V4",
        
        kitSerialNumber: data.nroSerieKit,
        terminalId: data.terminalId,
        antennaModel: data.antennaModel,
        cableColor: data.cableColor,
        hardwareVersion: data.versionHardware,
        antennaLocation: data.ubicacionAntena,
        obstructions: data.obstrucciones,
        downloadSpeed: parseFloat(data.velocidadBajada) || 0,
        uploadSpeed: parseFloat(data.velocidadSubida) || 0,
        latency: parseInt(data.latencia) || 0,
        networkMode: data.modoRed,

        latitude: parseFloat(data.latitud) || null,
        longitude: parseFloat(data.longitud) || null,

        techSignature: data.techSignature,
        clientSignature: data.clientSignature,

        photoCasa: data.photoCasa,
        photoAntena: data.photoAntena,
        photoRouter: data.photoRouter,
        photoCable: data.photoCable,
        photoTest: data.photoTest,

        technicianId: data.technicianId,
        installedAt: new Date(),
      }
    });

    return { success: true, contractId: contract.id, contractNumber: contract.contractNumber };
  } catch (error: any) {
    console.error("Error saving contract:", error);
    return { success: false, error: error.message };
  }
}
export async function getTicketInfo(ticketId: string) {
  try {
    let ticket = null;
    if (ticketId.length > 20) {
      ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: { contract: true }
      });
    } else {
      ticket = await prisma.supportTicket.findFirst({
        where: { ticketNumber: ticketId },
        include: { contract: true }
      });
    }
    return ticket;
  } catch (error) {
    console.error("Error fetching ticket info:", error);
    return null;
  }
}
