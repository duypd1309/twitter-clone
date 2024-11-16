"use client";

import { formatRelativeTime } from "@/lib/utils";
import { Comment, Post, Repost, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import LikeButton from "./like-button";
import { IoClose } from "react-icons/io5";
import useDeletePostModal from "@/store/useDeletePostModal";
import RepostButton from "./repost-buttton";
import { FaRetweet } from "react-icons/fa6";

interface PostItemProps {
  data: Post & {
    user: User;
    comments: Comment[];
    reposts: Repost[];
    repostData?: {
      repostId: string;
      repostedAt: Date;
      repostedBy: string;
    } | null;
  };
  currentUserId?: string;
}

export default function PostItem({ data, currentUserId }: PostItemProps) {
  const router = useRouter();
  const openDeletePostModal = useDeletePostModal((state) => state.onOpen);
  const setCurrentPostId = useDeletePostModal(
    (state) => state.setCurrentPostId
  );

  const goToPost = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      router.push(`/post/${data.id}`);
    },
    [router, data.id]
  );

  const goToUserProfile = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      router.push(`/${data.user.username}`);
    },
    [router, data.user.username]
  );

  const handleOpenDeletePostModal = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      setCurrentPostId(data.id);
      openDeletePostModal();
    },
    [setCurrentPostId, data.id, openDeletePostModal]
  );

  const createdAt = useMemo(() => {
    return formatRelativeTime(data.createdAt);
  }, [data.createdAt]);

  return (
    <div
      onClick={goToPost}
      className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition"
    >
      {data.repostData && (
        <div className="flex flex-row items-center text-neutral-500 gap-1 mb-4">
          <FaRetweet size={20} />
          <p>Retweeted by {data.repostData.repostedBy}</p>
        </div>
      )}
      <div className="flex flex-row items-start gap-3">
        <div onClick={goToUserProfile} className="relative w-10 h-10 mt-1.5">
          <Image
            src={
              data.user.profileImage
                ? data.user.profileImage
                : "/placeholder.jpg"
            }
            alt="profile image"
            style={{ objectFit: "cover", borderRadius: "100%" }}
            fill
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-2">
              <p
                className="text-white font-semibold cursor:pointer hover:underline"
                onClick={goToUserProfile}
              >
                {data.user.name}
              </p>
              <span
                className="text-neutral-500 hidden md:block cursor:pointer hover:underline"
                onClick={goToUserProfile}
              >
                @{data.user.username}
              </span>
              <span
                className="text-neutral-500 text-sm"
                suppressHydrationWarning
              >
                {createdAt}
              </span>
            </div>

            {currentUserId === data.user.id && (
              <div
                onClick={handleOpenDeletePostModal}
                className="text-white hover:opacity-80 transition"
              >
                <IoClose size={24} />
              </div>
            )}
          </div>

          <div className="text-white mt-1">{data.body}</div>

          <div className="flex flex-row items-center mt-3 gap-10">
            <div className="flex flex-row items-center text-neutral-500 gap-1 cursor-pointer transition hover:text-sky-500">
              <AiOutlineMessage size={20} />
              <p>{data.comments.length}</p>
            </div>
            <LikeButton
              postId={data.id}
              likeIds={data.likeIds}
              isLikedByCurrentUserId={
                currentUserId ? data.likeIds.includes(currentUserId) : false
              }
            />
            <RepostButton
              postId={data.id}
              initialRepostCount={data.reposts.length}
              isRepostedByCurrentUserId={
                currentUserId
                  ? data.reposts.some(
                      (repost) => repost.userId === currentUserId
                    )
                  : false
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
