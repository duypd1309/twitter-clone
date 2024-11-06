import { BiCalendar } from "react-icons/bi";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import FollowButton from "./follow-button";

interface UserBioProps {
  userId: string;
  username: string;
  name: string | null;
  bio: string | null;
  createdAt: Date;
  followingIds: string[];
  followerCount: number | null;
  isCurrentUser: boolean;
  isFollowedByCurrentUser: boolean;
}

export default function UserBio({
  userId,
  username,
  name,
  bio,
  createdAt,
  followingIds,
  followerCount,
  isCurrentUser,
  isFollowedByCurrentUser,
}: UserBioProps) {
  return (
    <div className="border-b-[1px] border-neutral-800 pb-4">
      <div className="flex justify-end p-4">
        {isCurrentUser ? (
          <Link
            href={`${username}/edit`}
            className="bg-sky-500 hover:opacity-80 transition text-white px-4 py-2 rounded-full"
          >
            Edit Profile
          </Link>
        ) : (
          <FollowButton
            userId={userId}
            isFollowedByCurrentUser={isFollowedByCurrentUser}
          />
        )}
      </div>
      <div className="mt-2 px-6">
        <div className="flex flex-col">
          <p className="text-white text-2xl font-semibold">{name}</p>
          <p className="text-md text-neutral-500">@{username}</p>
        </div>
        <div className="flex flex-col mt-4">
          <p className="text-white">{bio}</p>
          <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500 -ml-0.5">
            <BiCalendar size={20} />
            <p>Joined {formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4 gap-6">
          <div className="flex flex-row items-center gap-1">
            <p className="text-white">{followingIds?.length}</p>
            <p className="text-neutral-500">Following</p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <p className="text-white">{followerCount}</p>
            <p className="text-neutral-500">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
