import { NextResponse } from "next/server";
import { auth } from "../app/auth";

export type Role = "ADMIN" | "TECH" | "SALES";

export async function checkRole(allowedRoles: Role[]) {
  const session = await auth();
  
  if (!session || !session.user) {
    return { 
      authorized: false, 
      error: NextResponse.json({ error: "No autenticado" }, { status: 401 }), 
      session: null 
    };
  }
  
  const userRole = (session.user as any).role as Role;
  
  if (!allowedRoles.includes(userRole)) {
    return { 
      authorized: false, 
      error: NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 }), 
      session 
    };
  }
  
  return { 
    authorized: true, 
    error: null, 
    session 
  };
}
