import { ArrowUpRight, type LucideIcon } from "lucide-react";
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
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 break-words text-2xl font-semibold leading-tight text-slate-950">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600",
            iconClassName,
          )}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
      </div>
      {change ? (
        <p className="mt-3 text-xs font-medium text-emerald-700">{change}</p>
      ) : null}
      {linkLabel ? (
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
          {linkLabel}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  const className = cn(
    "block min-h-28 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50",
    href &&
      "group transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100",
  );

  return href ? (
    <Link className={className} href={href}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
