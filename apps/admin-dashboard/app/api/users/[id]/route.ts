import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import bcrypt from "bcryptjs";
import { checkRole } from "../../../../lib/rbac";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkRole(["ADMIN"]);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const { password, email, active } = body;

    const updateData: any = {};

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (email) {
      updateData.email = email;
    }
    if (typeof active === "boolean") {
      updateData.active = active;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("[USER_PATCH]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkRole(["ADMIN"]);
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("[USER_DELETE]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
