"use client";

import { followUser, unfollowUser } from "@/lib/actions";
import { useState } from "react";

interface FollowButtonProps {
  userId: string;
  isFollowedByCurrentUser: boolean;
}

export default function FollowButton({
  userId,
  isFollowedByCurrentUser,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(isFollowedByCurrentUser);

  async function handleToggleFollow() {
    if (isFollowing) {
      const { success } = await unfollowUser(userId);

      if (success) {
        setIsFollowing(false);
      }
    } else {
      const { success } = await followUser(userId);

      if (success) {
        setIsFollowing(true);
      }
    }
  }

  return (
    <button
      onClick={handleToggleFollow}
      className={`${
        isFollowing
          ? "bg-transparent text-white border-white"
          : "bg-white text-black border-black"
      } border-2 font-semibold hover:opacity-80 transition px-4 py-2 rounded-full`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
