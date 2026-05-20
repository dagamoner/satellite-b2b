import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@repo/database";
import { cookies } from "next/headers";
import { checkRole } from "../../../lib/rbac";

export const dynamic = "force-dynamic";

export async function GET() {
  const { authorized, error } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;
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
