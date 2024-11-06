"use client";

import { updateProfile } from "@/lib/actions";
import { User } from "@prisma/client";
import { useActionState, useState } from "react";
import ImageUploader from "./image-uploader";

export default function EditProfileForm({ user }: { user: User }) {
  const [uploadedImage, setUploadedImage] = useState({
    profileImage: user.profileImage,
    coverImage: user.coverImage,
  });

  function handleUploadProfileImage(base64: string | null) {
    setUploadedImage((prevState) => {
      return { ...prevState, profileImage: base64 };
    });
  }

  function handleUploadCoverImage(base64: string | null) {
    setUploadedImage((prevState) => {
      return { ...prevState, coverImage: base64 };
    });
  }

  const updateProfileWithImage = updateProfile.bind(null, uploadedImage);

  const [formState, formAction, isPending] = useActionState(
    updateProfileWithImage,
    undefined
  );

  const inputClasses =
    "w-full p-4 text-lg text-white bg-black border-2 border-neutral-800 rounded-md outline-none focus:border-sky-500 transition disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed";
  const labelClasses = "text-lg text-white font-semibold";
  return (
    <form action={formAction} className="flex flex-col gap-4 mt-2">
      <ImageUploader
        label="Profile Image"
        initialValue={uploadedImage.profileImage}
        onUpload={handleUploadProfileImage}
      />
      <ImageUploader
        label="Cover Image"
        initialValue={uploadedImage.coverImage}
        onUpload={handleUploadCoverImage}
      />
      <div className="flex flex-col gap-2">
        <label className={labelClasses} htmlFor="name">
          Name
        </label>
        <input
          className={inputClasses}
          id="name"
          placeholder="Enter your name"
          type="text"
          name="name"
          defaultValue={user.name}
          aria-describedby="name-error"
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {formState?.errors?.name &&
            formState.errors.name.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClasses} htmlFor="username">
          Username
        </label>
        <input
          className={inputClasses}
          id="username"
          placeholder="Enter your username"
          type="text"
          name="username"
          defaultValue={user.username}
          aria-describedby="username-error"
        />
        <div id="username-error" aria-live="polite" aria-atomic="true">
          {formState?.errors?.username &&
            formState.errors.username.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClasses} htmlFor="bio">
          Bio (optional)
        </label>
        <textarea
          className={`${inputClasses} h-24`}
          id="bio"
          placeholder="Your bio goes here..."
          name="bio"
          defaultValue={user.bio ?? ""}
        ></textarea>
      </div>

      <button
        disabled={isPending}
        type="submit"
        className="bg-white rounded-full font-semibold px-5 py-3 mt-4 hover:opacity-80 transition disabled:bg-neutral-500 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        Save
      </button>
      {formState?.message && (
        <p className="text-center text-red-500">{formState.message}</p>
      )}
    </form>
  );
}
