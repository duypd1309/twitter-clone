import Link from "next/link";
import { FaFeather } from "react-icons/fa";

export function SidebarTweetButton() {
  return (
    <>
      <Link
        href="/login"
        className="!mt-6 lg:hidden flex w-14 h-14 rounded-full justify-center items-center bg-sky-500 cursor-pointer"
      >
        <FaFeather size={24} color="white" />
      </Link>
      <Link
        href="/login"
        className="!mt-6 hidden lg:block px-4 py-2 rounded-full bg-sky-500 hover:bg-opacity-90 transition cursor-pointer"
      >
        <p className="hidden lg:block text-white text-center font-semibold text-[20px]">
          Tweet
        </p>
      </Link>
    </>
  );
}
