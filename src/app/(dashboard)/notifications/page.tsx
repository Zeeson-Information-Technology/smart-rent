import { PageHeader } from "@/components/dashboard";
import { NotificationsList } from "@/features/notifications/components/notifications-list";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Review important platform events and manage read status."
        title="Notifications"
      />
      <NotificationsList />
    </div>
  );
}
