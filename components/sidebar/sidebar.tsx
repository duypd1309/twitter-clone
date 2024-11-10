import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import SidebarLogo from "./sidebar-logo";
import SidebarItem from "./sidebar-item";
import { SidebarSignOutButton } from "./sidebar-signout-button";
import { SidebarTweetButton } from "./sidebar-tweet-button";
import { getCurrentSession, getUserById } from "@/lib/dal";

export default async function Sidebar() {
  const iconProps = { color: "white", size: 24 };
  const session = await getCurrentSession();
  const items = [
    {
      label: "Home",
      href: "/",
      icon: <BsHouseFill {...iconProps} />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <BsBellFill {...iconProps} />,
      isNotification: true,
      hasNotification: session
        ? !!(await getUserById(session.userId))?.hasNotification
        : false,
    },
    {
      label: "Profile",
      href: session?.isAuth ? `/${session.username}` : "/login",
      icon: <FaUser {...iconProps} />,
    },
  ];
  return (
    <div className="col-span-1 pr-4 md:pr-6">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[230px]">
          <SidebarLogo />
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isNotification={item.isNotification || false}
              hasNotification={item.hasNotification || false}
              userId={session?.userId}
            />
          ))}
          <SidebarSignOutButton />
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
}
