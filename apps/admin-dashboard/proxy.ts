import { auth } from "./app/auth";
import { NextResponse } from "next/server";

// Rate Limiting en memoria por IP (protección contra fuerza bruta)
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 60; // 60 peticiones/min por IP en rutas de API

export default auth((req: any) => {
  const pathname = req.nextUrl.pathname;

  // --- Rate Limiting solo en rutas /api ---
  if (pathname.startsWith("/api")) {
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for") ||
      "127.0.0.1";
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Recolección de basura probabilística
    if (Math.random() < 0.01) {
      for (const [key, value] of ipRequestCounts.entries()) {
        if (value.timestamp < windowStart) ipRequestCounts.delete(key);
      }
    }

    const record = ipRequestCounts.get(ip);
    if (record && record.timestamp > windowStart) {
      if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return new NextResponse(
          JSON.stringify({ error: "Demasiadas peticiones. Intenta más tarde." }),
          { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
        );
      }
      record.count += 1;
      ipRequestCounts.set(ip, record);
    } else {
      ipRequestCounts.set(ip, { count: 1, timestamp: now });
    }
  }

  // --- Auth Guard: redirigir si no está logueado ---
  const isLoggedIn = !!req.auth;
  const isAuthPage = pathname === "/";

  if (!isLoggedIn && !isAuthPage) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
