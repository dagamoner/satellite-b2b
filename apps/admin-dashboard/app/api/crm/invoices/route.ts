import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";
import { checkRole } from "../../../../lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/crm/invoices - Obtener lista de facturas
export async function GET(request: Request) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        account: {
          select: { id: true, companyName: true, taxId: true, email: true }
        }
      },
      orderBy: { dueDate: "desc" }
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("[GET /api/crm/invoices]", error);
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 });
  }
}

// POST /api/crm/invoices - Registrar pago manual o crear nueva factura
export async function POST(request: Request) {
  const { authorized, error, session } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;

  try {
    const body = await request.json();
    const { action, invoiceId, amount, dueDate, accountId, paymentMethod, pdfUrl } = body;

    // Acción 1: REGISTRAR UN PAGO MANUAL
    if (action === "PAY_MANUAL") {
      if (!invoiceId) {
        return NextResponse.json({ error: "Falta el ID de la factura" }, { status: 400 });
      }

      const existingInvoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { account: true }
      });

      if (!existingInvoice) {
        return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
      }

      const updatedInvoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "PAID",
          paymentMethod: paymentMethod || "TRANSFER",
          paidAt: new Date(),
          pdfUrl: pdfUrl || existingInvoice.pdfUrl || "/uploads/invoices/manual-payment.pdf"
        }
      });

      // Registrar la actividad del cobro manual
      await prisma.clientActivity.create({
        data: {
          type: "NOTE",
          title: `Pago manual registrado: ${updatedInvoice.invoiceNumber}`,
          description: `Se registró cobro manual administrativo de ${updatedInvoice.currency} ${updatedInvoice.amount.toLocaleString("es-AR")} vía ${paymentMethod || "Transferencia Bancaria"}. Modificado por ${session.user.name}.`,
          createdById: (session.user as any).id,
          accountId: existingInvoice.accountId,
        }
      });

      return NextResponse.json({ invoice: updatedInvoice });
    }

    // Acción 2: CREAR UNA NUEVA FACTURA
    if (!amount || !dueDate || !accountId) {
      return NextResponse.json({ error: "Faltan campos (monto, vencimiento, cliente)" }, { status: 400 });
    }

    const count = await prisma.invoice.count();
    const invoiceNumber = `FACT-MANUAL-${1000 + count + 1}`;

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        amount: parseFloat(amount),
        currency: "ARS",
        dueDate: new Date(dueDate),
        status: "UNPAID",
        accountId,
        pdfUrl: pdfUrl || "/uploads/invoices/mock-invoice.pdf"
      },
      include: {
        account: true
      }
    });

    // Registrar actividad de factura creada
    await prisma.clientActivity.create({
      data: {
        type: "NOTE",
        title: `Factura mensual emitida: ${newInvoice.invoiceNumber}`,
        description: `Emisión de cobro satelital mensual administrativo por un monto de ARS ${newInvoice.amount.toLocaleString("es-AR")}.`,
        createdById: (session.user as any).id,
        accountId,
      }
    });

    return NextResponse.json({ invoice: newInvoice });
  } catch (error) {
    console.error("[POST /api/crm/invoices]", error);
    return NextResponse.json({ error: "Error en la operación de facturación" }, { status: 500 });
  }
}
