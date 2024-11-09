"use client";

import { formatRelativeTime } from "@/lib/utils";
import { Comment, Post, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import LikeButton from "./like-button";
import { IoClose } from "react-icons/io5";
import useDeletePostModal from "@/store/useDeletePostModal";

interface PostItemProps {
  data: Post & { user: User } & { comments: Comment[] };
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

        <div className="w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
}
