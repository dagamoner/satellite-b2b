import { NextResponse } from "next/server";
import { prisma } from "@repo/database";

export const dynamic = "force-dynamic";

// GET /api/scripts/backfill-accounts
export async function GET(request: Request) {
  try {
    // 1. Find all completed contracts that don't have an account
    const contracts = await prisma.installationContract.findMany({
      where: {
        status: "COMPLETED",
        accountId: null
      }
    });

    const results = [];

    for (const contract of contracts) {
      // 2. Update any related lead to WON
      if (contract.clientEmail) {
        await prisma.lead.updateMany({
          where: { email: contract.clientEmail },
          data: { status: "WON" }
        });
      }

      // 3. Create or find CustomerAccount
      let account = await prisma.customerAccount.findFirst({
        where: {
          OR: [
            { email: contract.clientEmail },
            { taxId: contract.clientDni }
          ]
        }
      });

      if (!account) {
        const count = await prisma.customerAccount.count();
        const accountNumber = `CTA-${10000 + count + 1}`;

        account = await prisma.customerAccount.create({
          data: {
            accountNumber,
            companyName: contract.companyName || contract.clientName,
            contactName: contract.clientName,
            taxId: contract.clientDni || "0",
            phone: contract.clientPhone || "No provisto",
            email: contract.clientEmail,
            address: contract.address || "Dirección no provista",
            city: contract.city || "Mendoza",
            province: contract.province || "Mendoza",
            country: contract.country || "Argentina",
            tier: "STANDARD",
            status: "ACTIVE",
            planName: contract.planType,
            monthlyFee: contract.monthlyFee || 0,
            activationDate: contract.installedAt || contract.createdAt,
          }
        });
      }

      // 4. Link contract to account
      await prisma.installationContract.update({
        where: { id: contract.id },
        data: { accountId: account.id }
      });

      results.push({ contract: contract.contractNumber, account: account.accountNumber });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${contracts.length} contracts`,
      results 
    });
  } catch (error: any) {
    console.error("[BACKFILL_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
