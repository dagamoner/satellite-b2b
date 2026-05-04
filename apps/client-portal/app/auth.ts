import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@repo/database";
import { authConfig } from "../auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
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
