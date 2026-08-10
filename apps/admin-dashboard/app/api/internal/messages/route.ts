import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/internal/messages
 * Recupera los últimos 50 mensajes internos del staff
 */
export async function GET() {
  const session = await auth();

  if (!session || !session.user || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "TECH")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await prisma.internalMessage.findMany({
      take: 50,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[INTERNAL_MESSAGES_GET]", error);
    return NextResponse.json({ error: "Error al obtener mensajes internos" }, { status: 500 });
  }
}

/**
 * POST /api/internal/messages
 * Crea un nuevo mensaje interno del staff
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "TECH")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "El contenido del mensaje no puede estar vacío" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const message = await prisma.internalMessage.create({
      data: {
        content: content.trim(),
        senderId: userId,
      },
      include: {
        sender: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("[INTERNAL_MESSAGES_POST]", error);
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 });
  }
}
