import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/internal/rooms/[id]/messages
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: roomId } = await params;
  const session = await auth();
  if (!session || !["ADMIN", "TECH", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const isGeneral = roomId === "general";

  // Verificar que el usuario es miembro del room si no es el canal general
  if (!isGeneral) {
    const isMember = await prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!isMember) {
      return NextResponse.json({ error: "No eres miembro de este canal" }, { status: 403 });
    }
  }

  try {
    const messages = await prisma.internalMessage.findMany({
      where: isGeneral 
        ? { OR: [{ roomId: null }, { roomId: "general" }] }
        : { roomId },
      orderBy: { createdAt: "asc" },
      take: 100,
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[ROOM_MESSAGES_GET]", error);
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 });
  }
}

/**
 * POST /api/internal/rooms/[id]/messages
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: roomId } = await params;
  const session = await auth();
  if (!session || !session.user || !["ADMIN", "TECH", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const isGeneral = roomId === "general";

  if (!isGeneral) {
    const isMember = await prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!isMember) {
      return NextResponse.json({ error: "No eres miembro de este canal" }, { status: 403 });
    }
  }

  try {
    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    const message = await prisma.internalMessage.create({
      data: {
        content: content.trim(),
        senderId: userId,
        roomId: isGeneral ? null : roomId,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("[ROOM_MESSAGES_POST]", error);
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 });
  }
}
