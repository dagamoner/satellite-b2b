import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

// GET /api/crm/leads - Obtener leads filtrados y ordenados
export async function GET(request: Request) {
  const session = await auth();

  if (!session || !["ADMIN", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    
    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
        { leadNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[GET /api/crm/leads]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST /api/crm/leads - Crear un nuevo lead manualmente
export async function POST(request: Request) {
  const session = await auth();

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
      latitude,
      longitude,
      notes,
      assignedToId
    } = body;

    if (!clientName || !email || !phone) {
      return NextResponse.json({ error: "Faltan campos requeridos (nombre, email, teléfono)" }, { status: 400 });
    }

    // Generar un número de lead único
    const count = await prisma.lead.count();
    const leadNumber = `L-${10000 + count + 1}`;

    const lead = await prisma.lead.create({
      data: {
        leadNumber,
        clientName,
        companyName,
        email,
        phone,
        source: source || "MANUAL",
        status: "NEW",
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        notes,
        assignedToId: assignedToId || (session.user as any).id,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Registrar actividad de creación automática
    await prisma.clientActivity.create({
      data: {
        type: "NOTE",
        title: "Lead creado",
        description: `Lead registrado manualmente por ${session.user.name}. Estado inicial: Nuevo.`,
        createdById: (session.user as any).id,
        leadId: lead.id,
      }
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("[POST /api/crm/leads]", error);
    return NextResponse.json({ error: "Error al crear el lead" }, { status: 500 });
  }
}
