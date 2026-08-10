import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const nextAuth = NextAuth(authConfig);
export const { auth } = nextAuth as any;

export default auth((req: any) => {
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // Si no está logueado y trata de acceder a cualquier ruta protegida (no login), redirigir a "/"
  if (!isLoggedIn && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Excluir rutas de API, archivos estáticos y favicon del middleware
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
