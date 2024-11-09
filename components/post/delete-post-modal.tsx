"use client";

import Modal from "../modal";
import useDeletePostModal from "@/store/useDeletePostModal";
import DeletePostForm from "./delete-post-form";

export default function DeletePostModal() {
  const isOpen = useDeletePostModal((state) => state.isOpen);
  const closeDeletePostModal = useDeletePostModal((state) => state.onClose);

  return (
    <Modal
      isOpen={isOpen}
      title="Delete Tweet?"
      body={<DeletePostForm />}
      onClose={closeDeletePostModal}
    />
  );
}
