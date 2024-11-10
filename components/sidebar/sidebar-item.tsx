"use client";

import pusherClient from "@/lib/pusher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  hasNotification?: boolean;
  userId?: string;
}

export default function SidebarItem({
  label,
  href,
  icon,
  hasNotification,
  userId,
}: SidebarItemProps) {
  const [hasNewNotification, setHasNewNotification] = useState(hasNotification);
  const pathname = usePathname();

  useEffect(() => {
    if (!userId) return;
    const channel = pusherClient.subscribe(`notification-${userId}`);

    channel.bind("new-notification", (data: boolean) => {
      setHasNewNotification(data);
    });

    return () => {
      pusherClient.unsubscribe(`notification-${userId}`);
    };
  }, [userId]);

  return (
    <Link
      onClick={() => setHasNewNotification(false)}
      className="relative flex flex-row items-center gap-4 p-4"
      href={href}
    >
      {icon}
      {hasNotification && hasNewNotification && (
        <BsDot
          className="text-sky-500 absolute -top-4 left-0"
          size={70}
        ></BsDot>
      )}
      <p
        className={`hidden lg:block text-white text-xl ${
          pathname === href && "font-bold"
        }`}
      >
        {label}
      </p>
    </Link>
  );
}
