import Header from "@/components/header";
import NotificationsFeed from "@/components/notifications/notifications-feed";
import { turnOffNotification } from "@/lib/actions";
import { getCurrentSession, getNotifications } from "@/lib/dal";

export default async function NotificationsPage() {
  const currentUserId = (await getCurrentSession())?.userId;

  if (!currentUserId) return <Header showBackArror label="Session Error" />;

  await turnOffNotification(currentUserId);

  const notifications = await getNotifications(currentUserId);

  return (
    <>
      <Header showBackArror label="Notifications" />
      <NotificationsFeed notifications={notifications || []} />
    </>
  );
}
