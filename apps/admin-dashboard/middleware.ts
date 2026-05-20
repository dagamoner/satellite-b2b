import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Almacén en memoria simple para Edge Middleware.
// Nota: En Vercel Serverless/Edge, esta memoria se resetea frecuentemente (cada vez que el lambda se apaga o escala),
// pero es suficiente para mitigar ataques de fuerza bruta ráfaga altamente concurrentes sobre la misma instancia.
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 30; // 30 peticiones por minuto por IP para rutas de API

export function middleware(request: NextRequest) {
  // Solo aplicar rate limiting a las rutas de API
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Obtener la IP (Vercel provee 'x-real-ip' o 'x-forwarded-for')
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Limpiar entradas antiguas (recolección de basura manual simple)
    // Para no iterar todo el mapa en cada petición, solo lo hacemos de vez en cuando (ej. 1 de cada 100)
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
          JSON.stringify({ error: "Demasiadas peticiones. Por favor, intenta de nuevo más tarde." }),
          { 
            status: 429, 
            headers: { 
              "Content-Type": "application/json",
              "Retry-After": "60"
            } 
          }
        );
      }
      // Incrementar contador
      currentRecord.count += 1;
      ipRequestCounts.set(ip, currentRecord);
    } else {
      // Nuevo registro para la ventana actual
      ipRequestCounts.set(ip, { count: 1, timestamp: now });
    }
  }

  // Si todo está bien, continuamos
  return NextResponse.next();
}

// Configurar en qué rutas corre el middleware
export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas de API (/api/*)
     * Ignora archivos estáticos, _next, etc.
     */
    '/api/:path*',
  ],
};
