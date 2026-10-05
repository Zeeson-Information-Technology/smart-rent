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
      className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      href={href}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition-colors group-hover:bg-white">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      {label}
    </Link>
  );
}
