import type { UserRole } from "@/types/database";

export type DashboardUser = {
  email: string;
  name: string;
  role: UserRole;
};
