"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function SidebarItem({ label, href, icon }: SidebarItemProps) {
  const pathname = usePathname();
  return (
    <Link className="flex flex-row items-center gap-4 p-4" href={href}>
      {icon}
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
