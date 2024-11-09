"use client";

import useEditModal from "@/store/useEditModal";
import Modal from "../modal";
import { useEffect } from "react";
import EditProfileForm from "./edit-profile-form";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function EditProfileModal({ user }: { user: User }) {
  const isOpen = useEditModal((state) => state.isOpen);
  const openEditModal = useEditModal((state) => state.onOpen);
  const closeEditModal = useEditModal((state) => state.onClose);

  const router = useRouter();

  useEffect(() => {
    openEditModal();

    return () => {
      closeEditModal();
    };
  }, [openEditModal, closeEditModal]);

  function handleClose() {
    router.back();
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Edit your Profile"
      body={<EditProfileForm user={user} />}
      onClose={handleClose}
    />
  );
}
