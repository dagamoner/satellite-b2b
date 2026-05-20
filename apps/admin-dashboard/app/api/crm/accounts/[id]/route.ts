import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../../auth";
import { checkRole } from "../../../../../lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/crm/accounts/[id] - Obtener la Ficha 360 del Cliente
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;

  const { id } = await params;

  try {
    const account = await prisma.customerAccount.findUnique({
      where: { id },
      include: {
        contracts: {
          orderBy: { createdAt: "desc" }
        },
        invoices: {
          orderBy: { dueDate: "desc" }
        },
        activities: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!account) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ account });
  } catch (error) {
    console.error("[GET /api/crm/accounts/[id]]", error);
    return NextResponse.json({ error: "Error al obtener la cuenta del cliente" }, { status: 500 });
  }
}

// PUT /api/crm/accounts/[id] - Actualizar el Estado u otros datos del Cliente
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { status, companyName, contactName, email, phone, city, planName, monthlyFee } = body;

    const account = await prisma.customerAccount.findUnique({
      where: { id }
    });

    if (!account) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
    }

    const updated = await prisma.customerAccount.update({
      where: { id },
      data: {
        status: status || account.status,
        companyName: companyName || account.companyName,
        contactName: contactName || account.contactName,
        email: email || account.email,
        phone: phone || account.phone,
        city: city || account.city,
        planName: planName || account.planName,
        monthlyFee: monthlyFee !== undefined ? monthlyFee : account.monthlyFee
      }
    });

    return NextResponse.json({ account: updated });
  } catch (error) {
    console.error("[PUT /api/crm/accounts/[id]]", error);
    return NextResponse.json({ error: "Error al actualizar la cuenta del cliente" }, { status: 500 });
  }
}
