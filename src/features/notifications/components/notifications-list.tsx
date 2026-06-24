"use client";

import { Bell, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { DashboardCard, EmptyState } from "@/components/dashboard";
import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

import { NotificationTypeIcon } from "./notification-type-icon";
import type { AppNotification } from "../types";
import { formatNotificationTime, getNotificationHref } from "../utils";

type NotificationsResponse = {
  notifications: AppNotification[];
};

export function NotificationsList() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notifications", { cache: "no-store" });

      if (!response.ok) {
        setError("Unable to load notifications.");
        return;
      }

      const data = (await response.json()) as NotificationsResponse;
      setNotifications(data.notifications);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  async function markRead(id: string) {
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: "PUT",
    });

    if (response.ok) {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification,
        ),
      );
    }
  }

  async function deleteNotification(id: string) {
    const confirmed = window.confirm(
      "Delete this notification? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/notifications/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );
    }
  }

  async function markAllRead() {
    const response = await fetch("/api/notifications/read-all", {
      method: "PUT",
    });

    if (response.ok) {
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (loading) {
    return (
      <DashboardCard>
        <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Loading notifications
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <EmptyState
        action={
          <Button onClick={loadNotifications} variant="outline">
            Try again
          </Button>
        }
        description={error}
        icon={Bell}
        title="Notifications unavailable"
      />
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        description="No notifications yet."
        icon={Bell}
        title="You are all caught up"
      />
    );
  }

  return (
    <DashboardCard>
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Notification centre
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          disabled={unreadCount === 0}
          onClick={markAllRead}
          size="sm"
          variant="outline"
        >
          Mark all as read
        </Button>
      </div>

      <div className="divide-y divide-slate-100">
        {notifications.map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
            onDelete={deleteNotification}
            onMarkRead={markRead}
          />
        ))}
      </div>
    </DashboardCard>
  );
}

function NotificationListItem({
  notification,
  onDelete,
  onMarkRead,
}: {
  notification: AppNotification;
  onDelete: (id: string) => Promise<void>;
  onMarkRead: (id: string) => Promise<void>;
}) {
  const href = getNotificationHref(notification);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between",
        !notification.isRead && "bg-blue-50/40",
      )}
    >
      <div className="flex min-w-0 gap-3">
        <NotificationTypeIcon notification={notification} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-950">
              {notification.title}
            </h3>
            <Badge variant={notification.isRead ? "slate" : "blue"}>
              {notification.isRead ? "Read" : "Unread"}
            </Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            {notification.message}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            {formatNotificationTime(notification.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
        {href ? (
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md border bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700"
            href={href}
            onClick={() => {
              if (!notification.isRead) {
                void onMarkRead(notification.id);
              }
            }}
          >
            Open
          </Link>
        ) : null}
        {!notification.isRead ? (
          <Button
            onClick={() => onMarkRead(notification.id)}
            size="sm"
            variant="outline"
          >
            Mark read
          </Button>
        ) : null}
        <Button
          aria-label={`Delete notification: ${notification.title}`}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(notification.id)}
          size="sm"
          variant="ghost"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
