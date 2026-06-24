import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/types/database";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      name: string;
      email: string;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    name?: string;
    email?: string;
  }
}
