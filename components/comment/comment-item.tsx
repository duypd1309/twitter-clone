"use client";

import { formatDate } from "@/lib/utils";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface CommentItemProps {
  data: Comment & { user: User };
}

export default function CommentItem({ data }: CommentItemProps) {
  const router = useRouter();

  const goToUserProfile = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      router.push(`/${data.user.username}`);
    },
    [router, data.user.username]
  );

  const createdAt = useMemo(() => {
    return formatDate(data.createdAt);
  }, [data.createdAt]);

  return (
    <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition">
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

        <div>
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
            <span className="text-neutral-500 text-sm">{createdAt}</span>
          </div>

          <div className="text-white mt-1">{data.body}</div>
        </div>
      </div>
    </div>
  );
}
