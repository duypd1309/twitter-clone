"use client";

import useLoginModal from "@/store/useLoginModal";
import Modal from "../modal";
import LoginForm from "./login-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginModal() {
  const isOpen = useLoginModal((state) => state.isOpen);
  const openLoginModal = useLoginModal((state) => state.onOpen);
  const closeLoginModal = useLoginModal((state) => state.onClose);

  const router = useRouter();

  useEffect(() => {
    openLoginModal();

    return () => {
      closeLoginModal();
    };
  }, [openLoginModal, closeLoginModal]);

  function onToggle() {
    router.replace("/register");
  }

  function handleClose() {
    router.back();
  }

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        Don&apos;t have an account?
        <span
          onClick={onToggle}
          className="ml-2 text-sky-500 cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  );
  return (
    <Modal
      isOpen={isOpen}
      title="Login"
      body={<LoginForm />}
      footer={footerContent}
      onClose={handleClose}
    />
  );
}
