import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/internal/rooms
 * Devuelve todos los rooms del usuario: general + DMs + grupos
 */
export async function GET() {
  const session = await auth();
  if (!session || !["ADMIN", "TECH", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    // Rooms donde el usuario es miembro
    const memberships = await prisma.chatRoomMember.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, role: true } },
              },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                sender: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    // Obtener el último mensaje del canal general
    const lastGeneralMsg = await prisma.internalMessage.findFirst({
      where: { OR: [{ roomId: null }, { roomId: "general" }] },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { name: true } },
      },
    });

    const generalRoom = {
      id: "general",
      name: "Canal General",
      type: "GENERAL",
      members: [],
      lastMessage: lastGeneralMsg
        ? {
            content: lastGeneralMsg.content,
            senderName: lastGeneralMsg.sender.name,
            createdAt: lastGeneralMsg.createdAt,
          }
        : null,
    };

    const rooms = memberships.map((m) => {
      const r = m.room;
      const lastMsg = r.messages[0] ?? null;

      // Para DMs: el nombre del room es el nombre del otro usuario
      let displayName = r.name;
      if (r.type === "DIRECT") {
        const other = r.members.find((mem) => mem.userId !== userId);
        displayName = other?.user.name ?? "DM";
      }

      return {
        id: r.id,
        name: displayName,
        type: r.type,
        members: r.members.map((mem) => mem.user),
        lastMessage: lastMsg
          ? {
              content: lastMsg.content,
              senderName: lastMsg.sender.name,
              createdAt: lastMsg.createdAt,
            }
          : null,
      };
    });

    return NextResponse.json({ rooms: [generalRoom, ...rooms] });
  } catch (error) {
    console.error("[ROOMS_GET]", error);
    return NextResponse.json({ error: "Error al obtener rooms" }, { status: 500 });
  }
}

/**
 * POST /api/internal/rooms
 * Crea un DM o un grupo.
 * Body: { type: "DIRECT"|"GROUP", memberIds: string[], name?: string }
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session || !["ADMIN", "TECH", "SALES"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { type, memberIds, name } = await request.json();

    // Siempre incluir al creador
    const allMemberIds: string[] = Array.from(new Set([userId, ...memberIds]));

    if (type === "DIRECT") {
      if (allMemberIds.length !== 2) {
        return NextResponse.json({ error: "DM requiere exactamente 2 miembros" }, { status: 400 });
      }

      // Verificar si ya existe un DM entre estos dos usuarios
      const existing = await prisma.chatRoom.findFirst({
        where: {
          type: "DIRECT",
          AND: allMemberIds.map((id) => ({
            members: { some: { userId: id } },
          })),
        },
        include: {
          members: { include: { user: { select: { id: true, name: true, role: true } } } },
        },
      });

      if (existing) {
        const other = existing.members.find((m) => m.userId !== userId);
        return NextResponse.json({
          room: {
            id: existing.id,
            name: other?.user.name ?? "DM",
            type: "DIRECT",
            members: existing.members.map((m) => m.user),
          },
        });
      }
    }

    // Crear nuevo room
    const room = await prisma.chatRoom.create({
      data: {
        name: type === "GROUP" ? (name || "Nuevo Grupo") : null,
        type,
        members: {
          create: allMemberIds.map((id) => ({ userId: id })),
        },
      },
      include: {
        members: { include: { user: { select: { id: true, name: true, role: true } } } },
      },
    });

    const other = room.members.find((m) => m.userId !== userId);
    const displayName = type === "DIRECT" ? (other?.user.name ?? "DM") : room.name;

    return NextResponse.json({
      room: {
        id: room.id,
        name: displayName,
        type: room.type,
        members: room.members.map((m) => m.user),
      },
    });
  } catch (error) {
    console.error("[ROOMS_POST]", error);
    return NextResponse.json({ error: "Error al crear room" }, { status: 500 });
  }
}
