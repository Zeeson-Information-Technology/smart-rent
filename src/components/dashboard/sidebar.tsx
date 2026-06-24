"use client";

import {
  AlertCircle,
  Building2,
  FileArchive,
  FileText,
  Home,
  MessageSquare,
  Scale,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";
import type { UserRole } from "@/types/database";

import { LogoutButton } from "./logout-button";
import type { DashboardUser } from "./types";

type NavigationItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

const navigationItemsByRole = {
  landlord: [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/tenancies", label: "Tenancies", icon: Users },
    { href: "/issues", label: "Issues", icon: AlertCircle },
    { href: "/disputes", label: "Disputes", icon: Scale },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/documents", label: "Documents", icon: FileArchive },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
  tenant: [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/my-tenancy", label: "My Tenancy", icon: Users },
    { href: "/issues", label: "Issues", icon: AlertCircle },
    { href: "/disputes", label: "Disputes", icon: Scale },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/documents", label: "Documents", icon: FileArchive },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/users", label: "Users", icon: Users },
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/issues", label: "Issues", icon: AlertCircle },
    { href: "/disputes", label: "Disputes", icon: Scale },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
} satisfies Record<UserRole, NavigationItem[]>;

const defaultNavigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
];

export function getNavigationItems(role?: UserRole) {
  return role ? navigationItemsByRole[role] : defaultNavigationItems;
}

export function Sidebar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();
  const navigationItems = getNavigationItems(user.role);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-semibold leading-5 text-slate-950">
            SmartRent
          </span>
          <span className="text-xs font-medium text-slate-500">
            {getPortalSubtitle(user.role)}
          </span>
        </span>
      </div>

      <nav aria-label="Dashboard navigation" className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700",
                  active && "bg-blue-50 text-blue-700 shadow-sm",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 rounded-xl bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-950">{user.name}</p>
          <p className="mt-1 text-xs capitalize text-slate-500">{user.role}</p>
        </div>
        <LogoutButton className="w-full justify-center" size="sm" />
      </div>
    </aside>
  );
}

function getPortalSubtitle(role: UserRole) {
  if (role === "admin") {
    return "Admin Portal";
  }

  if (role === "tenant") {
    return "Tenant Portal";
  }

  return "Landlord Portal";
}
