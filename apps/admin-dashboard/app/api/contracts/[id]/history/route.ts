import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { checkRole } from "../../../../../lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkRole(["ADMIN", "SALES", "TECH"]);
  if (error) return error;

  try {
    const resolvedParams = await params;
    const contractId = resolvedParams.id;
    
    // Find tickets linked to this contract
    const tickets = await prisma.supportTicket.findMany({
      where: { contractId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json({ tickets });
  } catch (err) {
    console.error("[GET /api/contracts/[id]/history]", err);
    return NextResponse.json({ error: "Error fetching history" }, { status: 500 });
  }
}
