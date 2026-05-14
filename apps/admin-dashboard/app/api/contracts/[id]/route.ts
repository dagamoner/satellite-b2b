import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@repo/database";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// PATCH /api/contracts/[id] — Actualizar estado, notas o fecha de un contrato (admin)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await cookies();
    const { id } = await params;
    const body = await request.json();

    const { 
      status, 
      techNotes, 
      scheduledDate, 
      installedAt,
      technicianId,
      kitSerialNumber,
      antennaModel,
      antennaLocation,
      obstructions,
      obstructionObject,
      downloadSpeed,
      uploadSpeed,
      latency,
      networkMode,
      perfObservations,
      photoAntena,
      photoSoporte,
      photoRouter,
      photoTest,
      photoApp,
      photoRack
    } = body;

    const updated = await db.installationContract.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(techNotes !== undefined && { techNotes }),
        ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }),
        ...(installedAt && { installedAt: new Date(installedAt) }),
        ...(technicianId !== undefined && { technicianId: technicianId === "NONE" ? null : technicianId }),
        ...(kitSerialNumber && { kitSerialNumber }),
        ...(antennaModel && { antennaModel }),
        ...(antennaLocation && { antennaLocation }),
        ...(obstructions && { obstructions }),
        ...(obstructionObject !== undefined && { obstructionObject }),
        ...(downloadSpeed !== undefined && { downloadSpeed: parseFloat(downloadSpeed) }),
        ...(uploadSpeed !== undefined && { uploadSpeed: parseFloat(uploadSpeed) }),
        ...(latency !== undefined && { latency: parseInt(latency) }),
        ...(networkMode && { networkMode }),
        ...(perfObservations !== undefined && { perfObservations }),
        ...(photoAntena && { photoAntena }),
        ...(photoSoporte && { photoSoporte }),
        ...(photoRouter && { photoRouter }),
        ...(photoTest && { photoTest }),
        ...(photoApp && { photoApp }),
        ...(photoRack && { photoRack }),
        ...(body.techSignature && { techSignature: body.techSignature }),
      },
    });

    return NextResponse.json({ success: true, contract: updated });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 });
    }
    console.error("[PATCH /api/contracts/[id]]", error);
    return NextResponse.json({ error: "Error al actualizar el contrato." }, { status: 500 });
  }
}

// GET /api/contracts/[id] — Obtener un contrato por ID
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await cookies();
    const { id } = await params;
    const contract = await db.installationContract.findUnique({
      where: { id },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ contract });
  } catch (error) {
    console.error("[GET /api/contracts/[id]]", error);
    return NextResponse.json({ error: "Error al obtener el contrato." }, { status: 500 });
  }
}
