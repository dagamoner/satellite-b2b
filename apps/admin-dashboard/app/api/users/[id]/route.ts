import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import bcrypt from "bcryptjs";
import { auth } from "../../../auth";
import { checkRole } from "../../../../lib/rbac";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized, error } = await checkRole(["ADMIN"]);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Missing password" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ 
      message: "Password updated successfully",
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
