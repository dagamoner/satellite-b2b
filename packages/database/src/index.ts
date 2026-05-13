import { PrismaClient } from "./generated/client";

export * from "./generated/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ahora que el esquema tiene 'url = env("DATABASE_URL")', podemos usar el constructor estándar.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
