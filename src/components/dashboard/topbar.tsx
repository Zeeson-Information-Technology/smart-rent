"use client";

import { Building2, Menu, MessageSquare, Search, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui";
import { NotificationDropdown } from "@/features/notifications/components/notification-dropdown";
import { cn } from "@/lib/utils/cn";

import { getNavigationItems } from "./sidebar";
import type { DashboardUser } from "./types";
import { UserDropdown } from "./user-dropdown";

export function Topbar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();
  const navigationItems = getNavigationItems(user.role);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 w-full max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button aria-label="Open menu" className="lg:hidden" size="sm" variant="ghost">
            <Menu className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Link className="flex items-center gap-2 font-semibold text-slate-950 lg:hidden" href="/dashboard">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>SmartRent</span>
          </Link>
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
            <Search className="h-4 w-4" aria-hidden="true" />
            Search properties, issues, tenants
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <IconButtonWithBadge ariaLabel="Messages" count="5" icon={MessageSquare} />
          <UserDropdown user={user} />
        </div>
      </div>

      <nav
        aria-label="Mobile dashboard navigation"
        className="flex max-w-[1480px] gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 sm:px-6 lg:hidden"
      >
        {navigationItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600",
                active ? "bg-blue-600 text-white" : "bg-slate-100",
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

type IconButtonWithBadgeProps = {
  ariaLabel: string;
  count: string;
  icon: LucideIcon;
};

function IconButtonWithBadge({
  ariaLabel,
  count,
  icon: Icon,
}: IconButtonWithBadgeProps) {
  return (
    <button
      aria-label={ariaLabel}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-700"
      type="button"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
        {count}
      </span>
    </button>
  );
}
