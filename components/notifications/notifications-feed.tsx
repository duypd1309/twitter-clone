import { Notification } from "@prisma/client";
import NotificationItem from "./notification-item";

interface NotificationsFeedProps {
  notifications: Notification[];
}

export default async function NotificationsFeed({
  notifications,
}: NotificationsFeedProps) {
  if (notifications.length === 0)
    return (
      <div className="text-center text-neutral-600 p-6 text-xl">
        No notifications
      </div>
    );

  return (
    <div className="flex flex-col">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} data={notification} />
      ))}
    </div>
  );
}
