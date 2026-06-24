"use client";

import { Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

import { NotificationTypeIcon } from "./notification-type-icon";
import type { AppNotification } from "../types";
import { formatNotificationTime, getNotificationHref } from "../utils";

type NotificationsResponse = {
  notifications: AppNotification[];
};

export function NotificationDropdown() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);

    try {
      const [countResponse, notificationsResponse] = await Promise.all([
        fetch("/api/notifications/unread-count", { cache: "no-store" }),
        fetch("/api/notifications?limit=5", { cache: "no-store" }),
      ]);

      if (!countResponse.ok || !notificationsResponse.ok) {
        return;
      }

      const countData = (await countResponse.json()) as { count: number };
      const notificationsData =
        (await notificationsResponse.json()) as NotificationsResponse;

      setCount(countData.count);
      setNotifications(notificationsData.notifications);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

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

  async function handleToggle() {
    setOpen((current) => !current);
    await refreshNotifications();
  }

  async function handleMarkAllRead() {
    const response = await fetch("/api/notifications/read-all", {
      method: "PUT",
    });

    if (response.ok) {
      setCount(0);
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
    }
  }

  async function handleMarkRead(id: string) {
    const wasUnread = notifications.some(
      (notification) => notification.id === id && !notification.isRead,
    );
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: "PUT",
    });

    if (!response.ok) {
      return;
    }

    if (wasUnread) {
      setCount((current) => Math.max(current - 1, 0));
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-expanded={open}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-700"
        onClick={handleToggle}
        type="button"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/80">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-950">
                Notifications
              </h2>
              <p className="text-xs text-slate-500">
                {count} unread notification{count === 1 ? "" : "s"}
              </p>
            </div>
            <Button
              className="h-8 px-2 text-xs"
              disabled={count === 0}
              onClick={handleMarkAllRead}
              size="sm"
              variant="ghost"
            >
              Mark all read
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading notifications
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationDropdownItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onNavigate={() => setOpen(false)}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-slate-950">
                  No notifications yet.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Important SmartRent updates will appear here.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 p-3">
            <Link
              className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              href="/notifications"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationDropdownItem({
  notification,
  onMarkRead,
  onNavigate,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => Promise<void>;
  onNavigate: () => void;
}) {
  const href = getNotificationHref(notification);
  const content = (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50",
        !notification.isRead && "bg-blue-50/50",
      )}
    >
      <NotificationTypeIcon notification={notification} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-slate-950">
            {notification.title}
          </p>
          {!notification.isRead ? (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
          {notification.message}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          {formatNotificationTime(notification.createdAt)}
        </p>
      </div>
    </div>
  );

  if (!href) {
    return (
      <button
        className="block w-full"
        onClick={() => onMarkRead(notification.id)}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      className="block"
      href={href}
      onClick={() => {
        void onMarkRead(notification.id);
        onNavigate();
      }}
    >
      {content}
    </Link>
  );
}
