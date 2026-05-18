import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

// Helper: maps a DB account to the UI shape
function mapAccount(acc: any) {
  return {
    id: acc.id,
    accountNumber: acc.accountNumber || `CTA-${acc.id.slice(0, 6).toUpperCase()}`,
    companyName: acc.companyName,
    contactName: acc.contactName || acc.companyName,
    taxId: acc.taxId,
    industry: acc.industry,
    phone: acc.phone,
    email: acc.email,
    address: acc.address,
    city: acc.city,
    province: acc.province,
    country: acc.country,
    tier: acc.tier,
    status: acc.status || "ACTIVE",
    planName: acc.planName || "SIN_PLAN",
    monthlyFee: acc.monthlyFee ?? 0,
    activationDate: acc.activationDate || acc.createdAt,
    createdAt: acc.createdAt,
    contracts: acc.contracts || [],
    invoices: acc.invoices || [],
  };
}

// GET /api/crm/accounts - Listar todas las cuentas de cliente
export async function GET(request: Request) {
  const session = await auth();

  if (!session || !["ADMIN", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: any = {};

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { contactName: { contains: search, mode: "insensitive" } },
        { taxId: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const accounts = await prisma.customerAccount.findMany({
      where,
      include: {
        contracts: {
          select: { id: true, contractNumber: true, status: true, planType: true }
        },
        invoices: {
          select: { id: true, amount: true, status: true }
        }
      },
      orderBy: { companyName: "asc" }
    });

    return NextResponse.json({ accounts: accounts.map(mapAccount) });
  } catch (error) {
    console.error("[GET /api/crm/accounts]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST /api/crm/accounts - Crear nueva cuenta de cliente
export async function POST(request: Request) {
  const session = await auth();

  if (!session || !["ADMIN", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      companyName,
      contactName,
      taxId,
      industry,
      phone,
      email,
      address,
      city,
      province,
      country,
      tier,
      planName,
      monthlyFee,
      activationDate,
    } = body;

    if (!companyName || !taxId || !phone || !email || !address || !city || !province) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Generar accountNumber único
    const count = await prisma.customerAccount.count();
    const accountNumber = `CTA-${10000 + count + 1}`;

    const account = await prisma.customerAccount.create({
      data: {
        accountNumber,
        companyName,
        contactName: contactName || companyName,
        taxId,
        industry: industry || null,
        phone,
        email,
        address,
        city,
        province,
        country: country || "Argentina",
        tier: tier || "STANDARD",
        status: "ACTIVE",
        planName: planName || null,
        monthlyFee: monthlyFee ? parseFloat(monthlyFee) : null,
        activationDate: activationDate ? new Date(activationDate) : new Date(),
      },
      include: {
        contracts: { select: { id: true, contractNumber: true, status: true, planType: true } },
        invoices: { select: { id: true, amount: true, status: true } }
      }
    });

    return NextResponse.json({ account: mapAccount(account) });
  } catch (error: any) {
    console.error("[POST /api/crm/accounts]", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Ya existe una cuenta con ese CUIT/DNI o email" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 });
  }
}

// PATCH /api/crm/accounts - Actualizar estado o datos de una cuenta
export async function PATCH(request: Request) {
  const session = await auth();

  if (!session || !["ADMIN", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { accountId, status, planName, monthlyFee, tier } = body;

    if (!accountId) {
      return NextResponse.json({ error: "accountId requerido" }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (planName !== undefined) updateData.planName = planName;
    if (monthlyFee !== undefined) updateData.monthlyFee = parseFloat(monthlyFee);
    if (tier !== undefined) updateData.tier = tier;

    const account = await prisma.customerAccount.update({
      where: { id: accountId },
      data: updateData,
      include: {
        contracts: { select: { id: true, contractNumber: true, status: true, planType: true } },
        invoices: { select: { id: true, amount: true, status: true } }
      }
    });

    return NextResponse.json({ account: mapAccount(account) });
  } catch (error) {
    console.error("[PATCH /api/crm/accounts]", error);
    return NextResponse.json({ error: "Error al actualizar la cuenta" }, { status: 500 });
  }
}
