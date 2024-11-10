import { Notification } from "@prisma/client";
import NotificationItem from "./notification-item";
import { MdDeleteSweep } from "react-icons/md";
import { deleteNotifications } from "@/lib/actions";

interface NotificationsFeedProps {
  notifications: Notification[];
  userId: string;
}

export default function NotificationsFeed({
  notifications,
  userId,
}: NotificationsFeedProps) {
  if (notifications.length === 0)
    return (
      <div className="text-center text-neutral-600 p-6 text-xl">
        No notifications
      </div>
    );

  return (
    <>
      <form
        action={deleteNotifications.bind(null, userId)}
        className="text-white text-lg border-b-[1px] border-neutral-800 "
      >
        <button className="flex flex-row items-center gap-2 px-5 py-2">
          <MdDeleteSweep size={20} />
          <p>Delete all</p>
        </button>
      </form>
      <div className="flex flex-col">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} data={notification} />
        ))}
      </div>
    </>
  );
}
