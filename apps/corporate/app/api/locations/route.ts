import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provincia = searchParams.get("provincia");

    if (!provincia) {
      return NextResponse.json({ error: "Missing provincia parameter" }, { status: 400 });
    }

    const locations = await db.customLocation.findMany({
      where: {
        province: provincia,
      },
      select: {
        city: true,
      },
      orderBy: {
        city: "asc",
      },
    });

    const cityNames = locations.map(loc => loc.city);

    return NextResponse.json({ localidades: cityNames });
  } catch (error) {
    console.error("Error fetching custom locations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
