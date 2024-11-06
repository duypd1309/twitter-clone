"use client";

import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

interface HeaderProps {
  label: string;
  showBackArror?: boolean;
}

export default function Header({ label, showBackArror }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b-[1px] border-neutral-800 p-5">
      <div className="flex flex-row items-center gap-4">
        {showBackArror && (
          <BiArrowBack
            size={24}
            color="white"
            className="hover:opacity-70 transition cursor-pointer"
            onClick={() => router.back()}
          />
        )}
        <h1 className="text-white text-xl font-semibold">{label}</h1>
      </div>
    </div>
  );
}
