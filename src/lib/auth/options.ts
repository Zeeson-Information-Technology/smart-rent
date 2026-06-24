import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { getServerEnv, requireEnv } from "@/config/env";
import { UserModel } from "@/database/models";
import { loginSchema } from "@/lib/auth/schemas";
import { connectMongoDB } from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  useSecureCookies: shouldUseSecureCookies(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        await connectMongoDB();

        const user = await UserModel.findOne({
          email: parsedCredentials.data.email,
        }).select("+passwordHash");

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          parsedCredentials.data.password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.id && token.role && token.email && token.name) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
  },
};

function getAuthSecret() {
  const env = getServerEnv();

  if (env.NODE_ENV === "production") {
    return requireEnv("NEXTAUTH_SECRET");
  }

  return env.NEXTAUTH_SECRET;
}

function shouldUseSecureCookies() {
  const env = getServerEnv();

  if (env.NEXTAUTH_URL) {
    return env.NEXTAUTH_URL.startsWith("https://");
  }

  return env.NODE_ENV === "production";
}
