import { getAllUsers } from "@/lib/dal";
import Image from "next/image";
import Link from "next/link";

export default async function FollowBar() {
  const users = await getAllUsers({
    name: true,
    username: true,
    profileImage: true,
  });

  return (
    <div className="px-4 py-4 hidden lg:block">
      <div className="bg-neutral-800 rounded-xl p-4">
        <h2 className="text-white text-xl font-semibold">Who to follow</h2>
        <div className="flex flex-col gap-6 mt-4">
          {users?.map((user) => (
            <div
              key={user.username}
              className="flex flex-row items-center gap-4"
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
      </div>
    </div>
  );
}
