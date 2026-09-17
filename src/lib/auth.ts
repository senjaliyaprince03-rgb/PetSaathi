import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getMongoDatabase } from "@/lib/mongodb";
import { getAuthSecret } from "@/lib/auth-secret";

import { scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(nodeScrypt);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email },
          include: { roles: true },
        });

        if (!user) return null;

        const db = await getMongoDatabase();
        const cred = await db.collection("auth_credentials").findOne({ email });
        
        if (!cred) return null;

        let isValid = false;
        if (typeof cred.passwordHash === "string" && cred.passwordHash.startsWith("scrypt:")) {
          const [algorithm, salt, expectedHex] = cred.passwordHash.split(":");
          if (algorithm === "scrypt" && salt && expectedHex) {
            const expected = Buffer.from(expectedHex, "hex");
            const received = (await scryptAsync(credentials.password, salt, expected.length)) as Buffer;
            isValid = expected.length === received.length && timingSafeEqual(expected, received);
          }
        } else if (typeof cred.passwordHash === "string") {
          isValid = await bcrypt.compare(credentials.password, cred.passwordHash);
        }

        if (!isValid) return null;

        const role = (user.roles && user.roles.length > 0) ? (user.roles[0]?.role ?? "CUSTOMER") : "CUSTOMER";

        return {
          id: user.id,
          email: user.email as string,
          name: user.displayName,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  // Resolved through the shared helper so NextAuth, the edge middleware and
  // the Mongo auth module always sign with the same validated secret.
  secret: getAuthSecret(),
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
