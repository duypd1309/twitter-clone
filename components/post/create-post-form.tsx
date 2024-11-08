"use client";

import { createPost } from "@/lib/actions";
import { User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

interface CreatePostFormProps {
  user: User;
}

export default function CreatePostForm({ user }: CreatePostFormProps) {
  const createPostWithUserId = createPost.bind(null, user.id);
  const [formState, formAction, isPending] = useActionState(
    createPostWithUserId,
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (formState?.success) {
      toast.success("Tweet created!");
      router.refresh();
    }
  }, [formState, router]);

  return (
    <div className="border-b-[1px] border-neutral-800 px-5 py-2">
      <div className="flex flex-row gap-4 mt-2">
        <div className="relative w-12 h-12">
          <Image
            src={user.profileImage ? user.profileImage : "/placeholder.jpg"}
            alt="profile image"
            style={{
              objectFit: "cover",
              borderRadius: "100%",
            }}
            fill
          />
        </div>
        <div className="flex-1">
          <form action={formAction}>
            <textarea
              className="w-full mt-2 text-lg h-12 resize-none bg-black ring-0 outline-none text-white placeholder-neutral-500"
              placeholder="What's happening?"
              name="body"
              aria-describedby="body-error"
            ></textarea>
            <div className="mt-4 flex flex-row justify-end items-center gap-4">
              <div id="body-error" aria-live="polite" aria-atomic="true">
                {formState?.message && (
                  <p className="text-red-500">{formState.message}</p>
                )}
              </div>
              <button
                disabled={isPending}
                className="text-white bg-sky-500 rounded-full px-4 py-2 hover:bg-opacity-90 transition disabled:bg-neutral-500 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
              >
                Tweet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
