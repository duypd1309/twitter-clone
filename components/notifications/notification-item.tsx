import { getUserById } from "@/lib/dal";
import { formatRelativeTime } from "@/lib/utils";
import { Notification } from "@prisma/client";
import Image from "next/image";

interface NotificationItemProps {
  data: Notification;
}

export default async function NotificationItem({
  data,
}: NotificationItemProps) {
  const sender = await getUserById(data.senderId);

  return (
    <div className="flex flex-row justify-between items-center p-6 border-b-[1px] border-neutral-800">
      <div className="flex flex-row items-center gap-4">
        <div className="relative w-11 h-11">
          <Image
            src={
              sender?.profileImage ? sender.profileImage : "/placeholder.jpg"
            }
            alt="profile image"
            style={{ objectFit: "cover", borderRadius: "100%" }}
            fill
          />
        </div>
        <p className="text-white">
          {sender?.username} {data.body}
        </p>
      </div>
      <p className="text-neutral-500">{formatRelativeTime(data.createdAt)}</p>
    </div>
  );
}
