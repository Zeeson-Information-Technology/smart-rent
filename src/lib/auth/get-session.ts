import { auth } from "@/auth";

export function getCurrentSession() {
  return auth();
}
