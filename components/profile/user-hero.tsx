"use client";

import useViewImageModal from "@/store/useViewImageModal";
import Image from "next/image";
import { useCallback } from "react";

interface UserHeroProps {
  profileImage?: string | null;
  coverImage?: string | null;
}

export default function UserHero({ profileImage, coverImage }: UserHeroProps) {
  const openViewImageModal = useViewImageModal((state) => state.onOpen);
  const setCurrentImage = useViewImageModal((state) => state.setCurrentImage);

  const handleOpenViewImageModal = useCallback(
    (event: React.MouseEvent, image: string) => {
      event.stopPropagation();

      if (image === "") return;

      setCurrentImage(image);
      openViewImageModal();
    },
    [setCurrentImage, openViewImageModal]
  );

  return (
    <div
      onClick={(event) => handleOpenViewImageModal(event, coverImage || "")}
      className={`bg-neutral-700 h-44 relative${
        coverImage ? " cursor-pointer" : ""
      }`}
    >
      {coverImage && (
        <Image
          src={coverImage}
          alt="Cover Image"
          style={{ objectFit: "cover" }}
          fill
        />
      )}
      <div
        onClick={(event) =>
          handleOpenViewImageModal(event, profileImage || "/placeholder.jpg")
        }
        className="absolute w-36 h-36 -bottom-16 left-4 cursor-pointer"
      >
        <Image
          src={`${profileImage ? profileImage : "/placeholder.jpg"}`}
          alt="Profile Image"
          style={{
            objectFit: "cover",
            borderRadius: "100%",
            border: "3px solid black",
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
        />
      </div>
    </div>
  );
}
