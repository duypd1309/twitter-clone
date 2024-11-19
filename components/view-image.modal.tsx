"use client";

import useViewImageModal from "@/store/useViewImageModal";
import Modal from "./modal";
import Image from "next/image";

export default function ViewImageModal() {
  const isOpen = useViewImageModal((state) => state.isOpen);
  const closeViewImageModal = useViewImageModal((state) => state.onClose);
  const currentImage = useViewImageModal((state) => state.currentImage);

  const body = (
    <div className="relative mx-auto md:w-80 md:h-80 w-60 h-60">
      <Image
        src={currentImage}
        alt="image"
        style={{ objectFit: "cover", borderRadius: "4px" }}
        fill
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      title=""
      body={body}
      onClose={closeViewImageModal}
      hasBackgroundColor={false}
    />
  );
}
