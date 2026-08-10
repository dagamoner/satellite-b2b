console.log("[AUTH] Loading auth.ts config...");
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@repo/database";
import bcrypt from "bcryptjs";
import { authConfig } from "../auth.config";

const result = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] Login attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          console.log("[AUTH] User not found");
          return null;
        }
        
        if (!user.password) {
          console.log("[AUTH] User has no password");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          console.log("[AUTH] Invalid password");
          return null;
        }

        console.log("[AUTH] Login successful for:", user.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});

export const handlers = result.handlers;
export const auth = result.auth as any;
export const signIn = result.signIn;
export const signOut = result.signOut;
