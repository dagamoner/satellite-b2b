import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@repo/database";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
          email: contract.clientEmail, // Opcional
          dni: contract.clientDni,
          contractNumber: contract.contractNumber,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.dni = (user as any).dni;
        token.contractNumber = (user as any).contractNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).dni = token.dni;
        (session.user as any).contractNumber = token.contractNumber;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
