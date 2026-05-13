import { Pool } from "pg";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton para no re-crear el cliente en cada hot-reload en desarrollo
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
