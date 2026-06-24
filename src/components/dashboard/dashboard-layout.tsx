import type { ReactNode } from "react";

import { Breadcrumbs } from "./breadcrumbs";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { DashboardUser } from "./types";

type DashboardLayoutProps = {
  children: ReactNode;
  user: DashboardUser;
};

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="min-h-screen">
        <Sidebar user={user} />
        <div className="min-w-0 lg:pl-72">
          <Topbar user={user} />
          <main className="w-full max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
