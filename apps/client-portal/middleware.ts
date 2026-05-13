import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const nextAuth = NextAuth(authConfig);
export const { auth } = nextAuth;

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/";
  const isSoportePage = req.nextUrl.pathname.startsWith("/soporte");

  // 1. Si no está logueado y trata de entrar a soporte, al login
  if (!isLoggedIn && isSoportePage) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // 2. Si está logueado y trata de entrar al login, al dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/soporte/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/soporte/:path*"],
};
