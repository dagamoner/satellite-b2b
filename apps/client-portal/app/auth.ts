import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@repo/database";
import { authConfig } from "../auth.config";

import bcrypt from "bcryptjs";

const result = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
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

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password || (user.role !== "TECH" && user.role !== "ADMIN")) {
            console.log("AUTH: Technician login failed - user not found or invalid role");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            console.log("AUTH: Technician login failed - invalid password");
            return null;
          }

          console.log("AUTH: Technician login successful:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("AUTH_ERROR: Technician authorize exception:", error);
          return null;
        }
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
        console.log("AUTH: Client login attempt:", { 
          dni: credentials?.dni, 
          contract: credentials?.contractNumber 
        });

        if (!credentials?.dni || !credentials?.contractNumber) {
          console.log("AUTH: Client login failed - missing credentials");
          return null;
        }

        try {
          // Buscamos el contrato que coincida con el DNI del cliente y el número de contrato
          const contract = await prisma.installationContract.findFirst({
            where: {
              clientDni: credentials.dni as string,
              contractNumber: credentials.contractNumber as string,
            },
          });

          if (!contract) {
            console.log("AUTH: Client login failed - contract not found for DNI:", credentials.dni);
            return null;
          }

          console.log("AUTH: Client login successful for:", contract.clientName);
          // Para el cliente, el 'user' es el contrato/titular
          return {
            id: contract.id,
            name: contract.clientName,
            email: contract.clientEmail,
            dni: contract.clientDni,
            contractNumber: contract.contractNumber,
            role: "CLIENT"
          };
        } catch (error) {
          console.error("AUTH_ERROR: Client authorize critical prisma error:", error);
          // En NextAuth v5, devolver null es más seguro que lanzar errores genéricos
          // para evitar que se interprete como un error de configuración del servidor.
          return null;
        }
      },
    }),
  ],
});

export const handlers = result.handlers;
export const auth = result.auth as any;
export const signIn = result.signIn;
export const signOut = result.signOut;
