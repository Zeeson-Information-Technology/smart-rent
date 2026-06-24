import type { AppNotification } from "./types";

export function getNotificationHref(notification: AppNotification) {
  if (!notification.relatedEntityId || !notification.relatedEntityType) {
    return null;
  }

  const hrefByEntity = {
    dispute: `/disputes/${notification.relatedEntityId}`,
    evidence: null,
    issue: `/issues/${notification.relatedEntityId}`,
    message: `/messages/${notification.relatedEntityId}`,
    property: `/properties/${notification.relatedEntityId}`,
    tenancy: `/tenancies/${notification.relatedEntityId}`,
  } satisfies Record<NonNullable<AppNotification["relatedEntityType"]>, string | null>;

  return hrefByEntity[notification.relatedEntityType];
}

export function formatNotificationTime(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
