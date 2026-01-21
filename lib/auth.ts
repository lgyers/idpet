import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
        GitHub({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
      ]
      : []),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        let user: Awaited<ReturnType<typeof prisma.user.findUnique>>;
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          if (
            /tenant or user not found|can't reach database server|p1000|p1001|econnrefused|connect/i.test(
              message
            )
          ) {
            throw new Error("数据库连接失败，请检查 DATABASE_URL");
          }
          throw err;
        }

        if (!user) {
          throw new Error("User not found");
        }

        // Check if user has a password (for OAuth users who don't have passwords)
        let account: Awaited<ReturnType<typeof prisma.account.findFirst>>;
        try {
          account = await prisma.account.findFirst({
            where: {
              userId: user.id,
              provider: "credentials",
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          if (
            /tenant or user not found|can't reach database server|p1000|p1001|econnrefused|connect/i.test(
              message
            )
          ) {
            throw new Error("数据库连接失败，请检查 DATABASE_URL");
          }
          throw err;
        }

        if (!account || !account.password) {
          throw new Error("Invalid login method. Please use your OAuth provider.");
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, account.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const tokenWithId = token as JWT & { id?: string };
      if (session.user && tokenWithId.id) {
        const sessionUser = session.user as Session["user"] & {
          id?: string;
          subscription?: {
            tier: string;
            quotaMonth: number;
            quotaResetDate: Date;
          };
        };

        sessionUser.id = tokenWithId.id;

        // Add subscription info to session
        let subscription: Awaited<ReturnType<typeof prisma.userSubscription.findUnique>> | null = null;
        try {
          subscription = await prisma.userSubscription.findUnique({
            where: { userId: tokenWithId.id },
          });
        } catch {
          subscription = null;
        }

        if (subscription) {
          sessionUser.subscription = {
            tier: subscription.tier,
            quotaMonth: subscription.quotaMonth,
            quotaResetDate: subscription.quotaResetDate,
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const userWithId = user as { id?: unknown };
        if (typeof userWithId.id === "string") {
          (token as JWT & { id?: string }).id = userWithId.id;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function auth() {
  return getServerSession(authOptions);
}
