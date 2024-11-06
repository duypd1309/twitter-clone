import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
  label: string;
  initialValue: string | null;
  onUpload: (base64: string | null) => void;
}

export default function ImageUploader({
  label,
  initialValue,
  onUpload,
}: ImageUploaderProps) {
  const [base64, setBase64] = useState(initialValue);

  function handleDrop(files: File[]) {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setBase64(event.target?.result as string);
      onUpload(event.target?.result as string);
    };

    reader.readAsDataURL(file);
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  return (
    <div
      {...getRootProps({
        className:
          "w-full p-4 text-center text-white border-2 border-dotted rounded-md border-neutral-700 cursor-pointer",
      })}
    >
      <input {...getInputProps()} />
      {base64 ? (
        <div className="flex items-center justify-center">
          <Image src={base64} alt="Uploaded image" width={200} height={200} />
        </div>
      ) : (
        <p className="test-white">{label}</p>
      )}
    </div>
  );
}
