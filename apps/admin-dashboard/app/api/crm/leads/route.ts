import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";
import { checkRole } from "../../../../lib/rbac";

export const dynamic = "force-dynamic";

// Helper: maps a DB lead to the UI shape
function mapLead(lead: any) {
  return {
    id: lead.id,
    leadNumber: lead.leadNumber,
    companyName: lead.companyName || lead.clientName,
    contactName: lead.contactName || lead.clientName,
    email: lead.email,
    phone: lead.phone,
    city: lead.city || "Sin ciudad",
    coordinates: (lead.latitude != null && lead.longitude != null)
      ? `${lead.latitude},${lead.longitude}`
      : "Sin coordenadas",
    status: lead.status,
    estimatedValue: lead.estimatedValue ?? 0,
    planInterest: lead.planInterest || "SIN_PLAN",
    notes: lead.notes || "",
    createdAt: lead.createdAt,
    source: lead.source,
    assignedTo: lead.assignedTo,
    activities: (lead.activities || []).map((a: any) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      description: a.description,
      notes: a.description,
      createdAt: a.createdAt,
      createdBy: a.createdBy,
      user: a.createdBy,
    })),
  };
}

// GET /api/crm/leads - Obtener leads filtrados y ordenados
export async function GET(request: Request) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;

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
        { contactName: { contains: search, mode: "insensitive" } },
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
        },
        activities: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ leads: leads.map(mapLead) });
  } catch (error) {
    console.error("[GET /api/crm/leads]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST /api/crm/leads - Crear un nuevo lead manualmente
export async function POST(request: Request) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;

  try {
    const body = await request.json();
    const {
      clientName,
      contactName,
      companyName,
      email,
      phone,
      city,
      source,
      latitude,
      longitude,
      estimatedValue,
      planInterest,
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
        contactName: contactName || clientName,
        companyName,
        email,
        phone,
        city: city || "Sin ciudad",
        source: source || "MANUAL",
        status: "NEW",
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : 0,
        planInterest: planInterest || "STARLINK_PRO",
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        notes,
        assignedToId: assignedToId || (session.user as any).id,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        activities: true,
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

    return NextResponse.json({ lead: mapLead(lead) });
  } catch (error) {
    console.error("[POST /api/crm/leads]", error);
    return NextResponse.json({ error: "Error al crear el lead" }, { status: 500 });
  }
}

// PATCH /api/crm/leads - Actualizar estado o campos de un lead
export async function PATCH(request: Request) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;

  try {
    const body = await request.json();
    const { leadId, status, estimatedValue, planInterest, notes, assignedToId } = body;

    if (!leadId) {
      return NextResponse.json({ error: "leadId requerido" }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (estimatedValue !== undefined) updateData.estimatedValue = parseFloat(estimatedValue);
    if (planInterest !== undefined) updateData.planInterest = planInterest;
    if (notes !== undefined) updateData.notes = notes;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        activities: {
          include: { createdBy: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    // Registrar actividad si cambió el estado
    if (status) {
      await prisma.clientActivity.create({
        data: {
          type: "NOTE",
          title: "Estado actualizado",
          description: `Estado cambiado a "${status}" por ${session.user.name}.`,
          createdById: (session.user as any).id,
          leadId: lead.id,
        }
      });
    }

    return NextResponse.json({ lead: mapLead(lead) });
  } catch (error) {
    console.error("[PATCH /api/crm/leads]", error);
    return NextResponse.json({ error: "Error al actualizar el lead" }, { status: 500 });
  }
}
