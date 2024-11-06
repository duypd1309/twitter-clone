"use client";

import { likePost, unlikePost } from "@/lib/actions";
import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LoveButtonProps {
  postId: string;
  likeIds: string[];
  isLikedByCurrentUserId: boolean;
}

export default function LikeButton({
  postId,
  likeIds,
  isLikedByCurrentUserId,
}: LoveButtonProps) {
  const [isLiked, setIsLiked] = useState(isLikedByCurrentUserId);
  const [likeCount, setLikeCount] = useState(likeIds.length);

  async function handleToggleLike(event: React.MouseEvent) {
    event.stopPropagation();

    if (isLiked) {
      const { success } = await unlikePost(postId);
      if (success) {
        setIsLiked(false);
        setLikeCount((prevLikeCount) => prevLikeCount - 1);
      }
    } else {
      const { success } = await likePost(postId);
      if (success) {
        setIsLiked(true);
        setLikeCount((prevLikeCount) => prevLikeCount + 1);
      }
    }
  }

  const LikeIcon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <div
      onClick={handleToggleLike}
      className="flex flex-row items-center text-neutral-500 gap-1 cursor-pointer transition hover:text-red-500"
    >
      <LikeIcon size={20} color={isLiked ? "red" : ""} />
      <p>{likeCount}</p>
    </div>
  );
}
