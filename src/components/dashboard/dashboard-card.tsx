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
        "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60",
        className,
      )}
    >
      {title ? (
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        </div>
      ) : null}
      {children}
    </section>
  );
}
