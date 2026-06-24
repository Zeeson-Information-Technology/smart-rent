"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

export function LogoutButton({
  className,
  label = "Logout",
  size = "md",
  variant = "outline",
}: LogoutButtonProps) {
  return (
    <Button
      className={className}
      onClick={() => signOut({ callbackUrl: "/login" })}
      size={size}
      type="button"
      variant={variant}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
