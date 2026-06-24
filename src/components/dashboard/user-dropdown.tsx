"use client";

import {
  Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import type { DashboardUser } from "./types";

export function UserDropdown({ user }: { user: DashboardUser }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-slate-100"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {getInitials(user.name)}
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-semibold leading-4 text-slate-950">
            {user.name}
          </span>
          <span className="mt-1 block text-xs capitalize leading-4 text-slate-500">
            {user.role}
          </span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/80">
          <DropdownLink
            href="/profile"
            icon={User}
            label="Profile"
          />
          <DropdownLink
            href="/settings"
            icon={Settings}
            label="Settings"
          />
          <DropdownLink
            href="/notifications"
            icon={Bell}
            label="Notifications"
          />
          <DropdownLink
            href="/contact"
            icon={CircleHelp}
            label="Help & Support"
          />
          <button
            className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: "/login" })}
            type="button"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}

type DropdownLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
};

function DropdownLink({ href, icon: Icon, label }: DropdownLinkProps) {
  return (
    <Link
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700"
      href={href}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
