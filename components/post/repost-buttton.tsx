"use client";

import { repostPost, unrepostPost } from "@/lib/actions";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRetweet } from "react-icons/fa6";

interface RepostButtonProps {
  postId: string;
  initialRepostCount: number;
  isRepostedByCurrentUserId: boolean;
}

export default function RepostButton({
  postId,
  initialRepostCount,
  isRepostedByCurrentUserId,
}: RepostButtonProps) {
  const [isReposted, setIsReposted] = useState(isRepostedByCurrentUserId);
  const [repostCount, setRepostCount] = useState(initialRepostCount);

  async function handleToggleRepost(event: React.MouseEvent) {
    event.stopPropagation();

    if (isReposted) {
      const { success } = await unrepostPost(postId);
      if (success) {
        setIsReposted(false);
        setRepostCount((prevRepostCount) => prevRepostCount - 1);
      }
    } else {
      const { success } = await repostPost(postId);
      if (success) {
        setIsReposted(true);
        setRepostCount((prevRepostCount) => prevRepostCount + 1);
        toast.success("Retweeted!");
      }
    }
  }

  return (
    <div
      onClick={handleToggleRepost}
      className="flex flex-row items-center text-neutral-500 gap-1 cursor-pointer transition hover:text-green-500"
    >
      <FaRetweet size={20} color={isReposted ? "green" : ""} />
      <p>{repostCount}</p>
    </div>
  );
}
