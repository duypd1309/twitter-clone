"use client";

import { searchUsers } from "@/lib/actions";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { IoCloseCircle, IoSearch } from "react-icons/io5";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSearch = useDebouncedCallback(async (value: string) => {
    if (value.trim() === "") {
      setSearchTerm("");
      setSearchResults([]);
      return;
    }

    setSearchTerm(value);

    const users = await searchUsers(value, {
      username: true,
      name: true,
      profileImage: true,
    });

    if (users) setSearchResults(users);
  }, 300);

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    setSearchTerm("");
    setSearchResults([]);
  }

  function goToUserProfile(username: string) {
    router.push(`/${username}`);
  }

  return (
    <div className="relative">
      <IoSearch
        size={18}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-500"
      />
      <input
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-11 pr-8 py-2 text-white rounded-full border-2 border-neutral-800 bg-neutral-800 placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:bg-black"
        placeholder="Search"
        ref={inputRef}
      />

      {searchResults.length > 0 && (
        <div className="custom-scrollbar absolute w-full bg-black z-50 text-white border border-neutral-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              onClick={() => goToUserProfile(user.username)}
              key={user.username}
              className="flex flex-row p-2 items-center gap-4 cursor-pointer"
            >
              <Link href={`/${user.username}`} className="relative w-8 h-8">
                <Image
                  src={`${
                    user.profileImage ? user.profileImage : "/placeholder.jpg"
                  }`}
                  alt="profile image"
                  style={{ objectFit: "cover", borderRadius: "100%" }}
                  fill
                />
              </Link>
              <div className="flex flex-col">
                <Link
                  href={`/${user.username}`}
                  className="text-white font-semibold text-sm"
                >
                  {user.name}
                </Link>
                <Link
                  href={`/${user.username}`}
                  className="text-neutral-400 text-sm"
                >
                  @{user.username}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sky-500 hover:opacity-70 transition"
        >
          <IoCloseCircle />
        </button>
      )}
    </div>
  );
}
