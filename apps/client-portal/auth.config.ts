import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.dni = (user as any).dni;
        token.contractNumber = (user as any).contractNumber;
        token.contractId = user.id;
        token.role = (user as any).role || "CLIENT";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).dni = token.dni;
        (session.user as any).contractNumber = token.contractNumber;
        (session.user as any).contractId = token.contractId;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [], // Los proveedores se añaden en auth.ts para incluir la lógica de base de datos
  session: {
    strategy: "jwt",
  },
  trustHost: true,
} satisfies NextAuthConfig;
