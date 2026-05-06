import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.RESEND_FROM_EMAIL || "noreply@drbusiness.online",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user }) {
      const email = user.email || "";
      const isStudentEmail =
        email.endsWith(".edu") ||
        email.endsWith(".ac.in") ||
        email.endsWith(".edu.in");

      if (isStudentEmail && email) {
        try {
          await prisma.user.update({
            where: { email },
            data: { isStudentVerified: true },
          });
        } catch {
          // User may not exist yet — ignore
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
