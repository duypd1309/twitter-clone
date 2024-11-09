"use client";

import { deletePost } from "@/lib/actions";
import useDeletePostModal from "@/store/useDeletePostModal";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

export default function DeletePostForm() {
  const currentPostId = useDeletePostModal((state) => state.currentPostId);
  const closeDeletePostModal = useDeletePostModal((state) => state.onClose);

  const router = useRouter();

  const deletePostWithId = deletePost.bind(null, currentPostId);
  const [formState, formAction, isPending] = useActionState(
    deletePostWithId,
    undefined
  );

  useEffect(() => {
    if (formState?.success) {
      closeDeletePostModal();
      toast.success("Tweet deleted.");
      router.refresh();
    }
  }, [formState, closeDeletePostModal, router]);

  return (
    <form action={formAction}>
      <p className="text-neutral-500">
        This can&apos;t be undone and it will be removed from your profile,
        timeline,...
      </p>
      <div className="flex flex-col gap-4 mt-8">
        <button
          disabled={isPending}
          type="submit"
          className="text-white bg-red-700 font-semibold rounded-full px-4 py-2 hover:bg-opacity-90 transition disabled:bg-neutral-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={closeDeletePostModal}
          className="text-white bg-transparent font-semibold border-2 rounded-full px-4 py-2 hover:bg-opacity-90 transition disabled:bg-neutral-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        {formState?.message && (
          <p className="text-red-500">{formState.message}</p>
        )}
      </div>
    </form>
  );
}
