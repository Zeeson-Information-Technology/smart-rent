import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type StatCardProps = {
  change?: string;
  href?: string;
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
  linkLabel?: string;
  value: string;
};

export function StatCard({
  change,
  href,
  icon: Icon,
  iconClassName,
  label,
  linkLabel,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600",
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {change ? (
        <p className="mt-4 text-xs font-medium text-emerald-700">{change}</p>
      ) : null}
      {href && linkLabel ? (
        <Link
          className="mt-4 inline-flex text-sm font-medium text-blue-700 hover:text-blue-800"
          href={href}
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
