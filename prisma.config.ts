import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Carga el .env de la raíz del monorepo
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

export default defineConfig({
  earlyAccess: true,
  schema: "./packages/database/prisma/schema.prisma",
  datasource: {
    url: DATABASE_URL,
  },
  migrations: {
    seed: "npx tsx ./packages/database/prisma/seed.ts",
  },
});

