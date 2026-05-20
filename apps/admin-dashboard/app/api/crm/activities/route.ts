import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";
import { checkRole } from "../../../../lib/rbac";

export const dynamic = "force-dynamic";

// POST /api/crm/activities - Registrar una nueva actividad de contacto
export async function POST(request: Request) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;

  try {
    const body = await request.json();
    const { type, title, description, accountId, leadId } = body;

    if (!type || !title || !description) {
      return NextResponse.json({ error: "Faltan campos requeridos (type, title, description)" }, { status: 400 });
    }

    if (!accountId && !leadId) {
      return NextResponse.json({ error: "Debe asociar la actividad a un Lead o a una Cuenta de Cliente" }, { status: 400 });
    }

    const activity = await prisma.clientActivity.create({
      data: {
        type,
        title,
        description,
        accountId: accountId || null,
        leadId: leadId || null,
        createdById: (session.user as any).id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("[POST /api/crm/activities]", error);
    return NextResponse.json({ error: "Error al registrar la actividad" }, { status: 500 });
  }
}
