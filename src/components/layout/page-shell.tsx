import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <main className={cn("min-h-screen bg-background", className)}>{children}</main>;
}

export function Container({ children, className }: PageShellProps) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}