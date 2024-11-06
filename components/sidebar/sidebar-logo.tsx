import Link from "next/link";
import { BsTwitter } from "react-icons/bs";

export default function SidebarLogo() {
  return (
    <div className="flex p-4">
      <Link href="/" className="hover:opacity-80 transition">
        <BsTwitter size={28} color="white" />
      </Link>
    </div>
  );
}
