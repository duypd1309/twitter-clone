"use client";

import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";

export type ModalProps = {
  isOpen: boolean;
  title: string;
  body: React.ReactElement;
  footer?: React.ReactElement;
};

export default function Modal({ isOpen, title, body, footer }: ModalProps) {
  const router = useRouter();

  if (!isOpen) return null;
  return (
    // Modal Backdrop
    <div className="fixed inset-0 flex justify-center items-center bg-neutral-800 bg-opacity-70 z-50">
      {/* Modal Container (Handles modal size and positioning) */}
      <div className="w-full lg:w-1/2 lg:max-w-xl h-auto max-h-[calc(100vh-5rem)] mx-auto overflow-y-auto">
        {/* Modal Content (Actual content of the modal) */}
        <div className="flex flex-col rounded-lg shadow-lg bg-black">
          {/* Modal Header (Title and close button) */}
          <div className="flex justify-between items-center p-10">
            <h3 className="text-3xl font-semibold text-white">{title}</h3>
            <button
              onClick={() => router.back()}
              className="p-1 hover:opacity-70 transition"
            >
              <AiOutlineClose size={20} color="white" />
            </button>
          </div>
          {/* Modal Body */}
          <div className="px-10">{body}</div>
          {/* Modal Footer */}
          <div className="px-10 pb-10">{footer}</div>
        </div>
      </div>
    </div>
  );
}
