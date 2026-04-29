"use server";

import { prisma } from "@/lib/prisma";

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

export async function saveInstallationContract(data: any) {
  try {
    // 1. Generar número de contrato correlativo si no viene (aunque ya debería venir)
    const count = await prisma.installationContract.count();
    const contractNumber = `MR-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    // 2. Crear el registro en la base de datos
    const contract = await prisma.installationContract.create({
      data: {
        contractNumber,
        status: "COMPLETED", // Marcamos como completado al guardar desde este formulario
        clientName: data.titular,
        clientEmail: data.email || "",
        clientPhone: data.telefono || "",
        clientDni: data.dni,
        address: data.ubicacion,
        city: data.ciudad || "Mendoza",
        equipmentType: data.producto === "Starlink Mini X" ? "MINI_X" : "STANDARD_V4",
        planType: "BASICO_V4", // Hardcoded por ahora o mapper
        
        // Datos Técnicos
        kitSerialNumber: data.nroSerieKit,
        hardwareVersion: data.versionHardware,
        antennaLocation: data.ubicacionAntena,
        obstructions: data.obstrucciones,
        downloadSpeed: parseFloat(data.velocidadBajada) || 0,
        uploadSpeed: parseFloat(data.velocidadSubida) || 0,
        latency: parseInt(data.latencia) || 0,
        networkMode: data.modoRed,

        // Firmas (Base64)
        techSignature: data.techSignature,
        clientSignature: data.clientSignature,

        // Fotos (Placeholders para futuro)
        photoCasa: data.photoCasa,
        photoAntena: data.photoAntena,
        photoRouter: data.photoRouter,
        photoCable: data.photoCable,
        photoTest: data.photoTest,

        // Vinculación con técnico
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
