"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  hasNotification?: boolean;
}

export default function SidebarItem({
  label,
  href,
  icon,
  hasNotification,
}: SidebarItemProps) {
  const [itemHasNotification, setItemHasNotification] =
    useState(hasNotification);
  const pathname = usePathname();

  useEffect(() => {
    setItemHasNotification(hasNotification);
  }, [hasNotification, setItemHasNotification]);

  return (
    <Link
      onClick={() => setItemHasNotification(false)}
      className="relative flex flex-row items-center gap-4 p-4"
      href={href}
    >
      {icon}
      {itemHasNotification && (
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
