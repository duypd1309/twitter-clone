"use client";

import { createPost } from "@/lib/actions";
import { User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoImages } from "react-icons/io5";

interface CreatePostFormProps {
  user: User;
}

export default function CreatePostForm({ user }: CreatePostFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isHandlingFiles, setIsHandlingFiles] = useState<boolean>(false);
  const [errorUploading, setErrorUploading] = useState<string | null>(null);
  const [base64Files, setBase64Files] = useState<string[]>([]);

  const createPostWithFiles = createPost.bind(null, user.id, base64Files);
  const [formState, formAction, isPending] = useActionState(
    createPostWithFiles,
    undefined
  );

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formState?.success) {
      toast.success("Tweet created!");
      setUploadedFiles([]);
      setBase64Files([]);
      router.refresh();
    }

    if (formState?.message) {
      setUploadedFiles([]);
      setBase64Files([]);
    }
  }, [formState, router]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      if (selectedFiles.length > 2) {
        // Limit the number of selected files to 2
        event.target.value = "";
        setErrorUploading("Please select a maximum of 2 images.");
        setUploadedFiles([]);
        return;
      }

      setErrorUploading(null);

      setIsHandlingFiles(true);

      // Convert files to base64
      const base64Files: string[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        base64Files.push(base64);
      }

      setIsHandlingFiles(false);

      setUploadedFiles(Array.from(selectedFiles));
      setBase64Files(base64Files);
    }
  }

  function handleRemoveFile(index: number) {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);

    setUploadedFiles(updatedFiles);

    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((file) => dataTransfer.items.add(file));

    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
    }
  }

  return (
    <div className="border-b-[1px] border-neutral-800 md:px-5 py-2">
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
            <div className="mt-4 flex flex-row justify-between items-center">
              <div>
                <div className="flex flex-row gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative w-12 h-12 mb-4">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="preview of uploaded image"
                        style={{
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        fill
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full w-4 h-4 flex justify-center items-center cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <IoImages size={24} color="white" />
                  <input
                    type="file"
                    name="files"
                    multiple
                    onChange={handleFileChange}
                    className="absolute top-0 left-0 w-6 h-6 opacity-0 cursor-pointer"
                    accept="image/png, image/jpeg"
                    ref={fileInputRef}
                  />
                  {errorUploading && (
                    <p className="text-red-500 mt-2">{errorUploading}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-end items-center gap-4">
                <div id="body-error" aria-live="polite" aria-atomic="true">
                  {formState?.message && (
                    <p className="text-red-500">{formState.message}</p>
                  )}
                </div>
                <button
                  disabled={isPending || isHandlingFiles}
                  className="text-white bg-sky-500 rounded-full px-4 py-2 hover:bg-opacity-90 transition disabled:bg-neutral-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                >
                  Tweet
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
