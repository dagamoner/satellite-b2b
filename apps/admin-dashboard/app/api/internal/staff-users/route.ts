import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/internal/staff-users
 * Lista todos los usuarios del staff para mostrar en la lista de contactos
 */
export async function GET() {
  const session = await auth();

  if (!session || !["ADMIN", "TECH", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[STAFF_USERS_GET]", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}
