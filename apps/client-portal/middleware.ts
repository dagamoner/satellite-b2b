import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Almacén en memoria simple para Edge Middleware.
// Protege principalmente contra ataques de fuerza bruta (ej. login repetitivo en NextAuth)
// Nota: En Vercel, esta memoria se resetea por instancia, pero ayuda a mitigar picos rápidos.
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 30; // Límite de 30 requests/min/IP para rutas de API (como login)

export function middleware(request: NextRequest) {
  // Aplicar rate limiting a rutas de API (incluyendo /api/auth de NextAuth)
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Recolección de basura probabilística
    if (Math.random() < 0.01) {
      for (const [key, value] of ipRequestCounts.entries()) {
        if (value.timestamp < windowStart) {
          ipRequestCounts.delete(key);
        }
      }
    }

    const currentRecord = ipRequestCounts.get(ip);

    if (currentRecord && currentRecord.timestamp > windowStart) {
      if (currentRecord.count >= MAX_REQUESTS_PER_WINDOW) {
        return new NextResponse(
          JSON.stringify({ error: "Demasiadas peticiones. Bloqueo temporal por seguridad." }),
          { 
            status: 429, 
            headers: { 
              "Content-Type": "application/json",
              "Retry-After": "60"
            } 
          }
        );
      }
      currentRecord.count += 1;
      ipRequestCounts.set(ip, currentRecord);
    } else {
      ipRequestCounts.set(ip, { count: 1, timestamp: now });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
