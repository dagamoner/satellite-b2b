import { auth } from "./app/auth";
import { NextResponse } from "next/server";

export default auth((req: any) => {
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // Si no está logueado y trata de acceder a cualquier ruta protegida (no login), redirigir a "/"
  if (!isLoggedIn && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Si está logueado y trata de ir a la página de login, redirigir al dashboard
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/tickets", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Excluir rutas de API, archivos estáticos y la página de login del middleware
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
