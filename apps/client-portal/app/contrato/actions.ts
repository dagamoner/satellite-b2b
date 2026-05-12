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
    // 1. Buscar el ticket para encontrar el contractId
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      select: { contractId: true, ticketNumber: true }
    });

    if (!ticket) throw new Error("Ticket no encontrado");

    // 2. Actualizar el estado del Ticket
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { 
        status,
        updatedAt: new Date()
      }
    });

    // 3. Si hay datos de contrato, actualizarlos
    if (contractData) {
      await prisma.installationContract.update({
        where: { id: ticket.contractId },
        data: {
          ...contractData,
          // Si el ticket se marca como COMPLETED, el contrato también
          status: status === "COMPLETED" ? "COMPLETED" : undefined
        }
      });
    }

    // 4. Agregar mensaje de sistema al hilo del ticket
    await prisma.ticketMessage.create({
      data: {
        ticketId,
        content: `EL SISTEMA HA CAMBIADO EL ESTADO A: ${status.replace('_', ' ')}`,
        authorId: null, // Sistema
      }
    });

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
