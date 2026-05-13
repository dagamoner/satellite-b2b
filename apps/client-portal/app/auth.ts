import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@repo/database";
import { authConfig } from "../auth.config";

import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      id: "technician-credentials",
      name: "TechnicianPortal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password || (user.role !== "TECH" && user.role !== "ADMIN")) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "client-credentials",
      name: "ClientPortal",
      credentials: {
        dni: { label: "DNI", type: "text" },
        contractNumber: { label: "N° Contrato", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.dni || !credentials?.contractNumber) return null;

        // Buscamos el contrato que coincida con el DNI del cliente y el número de contrato
        const contract = await prisma.installationContract.findFirst({
          where: {
            clientDni: credentials.dni as string,
            contractNumber: credentials.contractNumber as string,
          },
        });

        if (!contract) return null;

        // Para el cliente, el 'user' es el contrato/titular
        return {
          id: contract.id,
          name: contract.clientName,
          email: contract.clientEmail,
          dni: contract.clientDni,
          contractNumber: contract.contractNumber,
        };
      },
    }),
  ],
});
