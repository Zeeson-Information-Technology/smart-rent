import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export function DashboardCard({
  children,
  className,
  title,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50",
        className,
      )}
    >
      {title ? (
        <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5">
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        </div>
      ) : null}
      {children}
    </section>
  );
}
