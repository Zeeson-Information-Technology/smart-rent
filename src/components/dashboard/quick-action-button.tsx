import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type QuickActionButtonProps = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export function QuickActionButton({
  href,
  icon: Icon,
  label,
}: QuickActionButtonProps) {
  return (
    <Link
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      href={href}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      {label}
    </Link>
  );
}
