"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  properties: "Properties",
  tenancies: "Tenancies",
  issues: "Issues",
  messages: "Messages",
  disputes: "Disputes",
  reports: "Reports",
  profile: "Profile",
  new: "New",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = labelMap[segment] ?? toTitleCase(segment);

    return {
      href,
      label,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-slate-500">
        <li>
          <Link className="font-medium text-slate-600 hover:text-blue-700" href="/dashboard">
            Dashboard
          </Link>
        </li>
        {crumbs[0]?.href === "/dashboard"
          ? null
          : crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;

              return (
                <li className="flex items-center gap-1" key={crumb.href}>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  {isLast ? (
                    <span className="font-medium text-slate-950">{crumb.label}</span>
                  ) : (
                    <Link className="font-medium text-slate-600 hover:text-blue-700" href={crumb.href}>
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
      </ol>
    </nav>
  );
}

function toTitleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
