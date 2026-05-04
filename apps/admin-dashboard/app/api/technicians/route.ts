import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@repo/database";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  await await await cookies(); // Force dynamic runtime
  try {
    const techs = await db.user.findMany({
      where: { role: "TECH" },
      select: { id: true, name: true }
    });
    return NextResponse.json({ technicians: techs });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener técnicos" }, { status: 500 });
  }
}
