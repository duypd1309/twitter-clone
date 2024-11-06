"use client";

import useRegisterModal from "@/store/useRegisterModal";
import Modal from "../modal";
import RegisterForm from "./register-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterModal() {
  const isOpen = useRegisterModal((state) => state.isOpen);
  const openRegisterModal = useRegisterModal((state) => state.onOpen);
  const closeRegisterModal = useRegisterModal((state) => state.onClose);

  const router = useRouter();

  useEffect(() => {
    openRegisterModal();

    return () => {
      closeRegisterModal();
    };
  }, [openRegisterModal, closeRegisterModal]);

  function onToggle() {
    router.replace("/login");
  }

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        Already have an account?
        <span
          onClick={onToggle}
          className="ml-2 text-sky-500 cursor-pointer hover:underline"
        >
          Sign in
        </span>
      </p>
    </div>
  );
  return (
    <Modal
      isOpen={isOpen}
      title="Create an account"
      body={<RegisterForm />}
      footer={footerContent}
    />
  );
}
