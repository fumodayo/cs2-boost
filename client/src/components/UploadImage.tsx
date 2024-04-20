import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FileRejection, useDropzone } from "react-dropzone";
import MoonLoader from "react-spinners/MoonLoader";

type ImageProps = {
  url: string;
  size: number;
  type: string;
};

interface UploadImageProps {
  onChangeImage: (file: string | null) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onChangeImage }) => {
  const [previewImage, setPreviewImage] = useState<ImageProps | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add isLoading state

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setError("Invalid file format. Please select an image file.");
    } else if (acceptedFiles.length > 0) {
      const url = URL.createObjectURL(acceptedFiles[0]);
      setPreviewImage({
        url: url,
        size: acceptedFiles[0].size,
        type: acceptedFiles[0].type,
      });

      setError(null);
      handleUploadImage(acceptedFiles[0]);
    }
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError("Failed to upload image");
      }
      const { url } = await res.json();
      setAvatarUrl(url);
    } catch (err) {
      console.log(err);
      setError("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onChangeImage(avatarUrl);
  }, [avatarUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    maxSize: 4882816,
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/gif": [],
      "image/jpg": [],
    },
  });

  return (
    <>
      {previewImage ? (
        <div className="flex gap-x-4">
          {isLoading ? (
            <MoonLoader color="#2562eb" size={40} />
          ) : (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <img
                src={previewImage.url}
                className="h-14 w-14 rounded-md border border-border object-cover shadow-sm"
              />
            </div>
          )}
          <div className="flex flex-col justify-center text-xs text-foreground/80">
            <p className="truncate">{previewImage.type}</p>
            <p>{Math.floor(previewImage.size / 1024)} KB</p>
            <span
              onClick={() => {
                setPreviewImage(null);
                onChangeImage(null);
              }}
              className="cursor-pointer text-danger hover:underline"
            >
              Remove
            </span>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full cursor-pointer rounded-md border border-border bg-field py-2 hover:bg-border/50 ${
            isDragActive && "bg-blue-200"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-x-2">
            <div className="flex items-center justify-center">
              <CiCirclePlus className="text-2xl text-foreground" />
            </div>
            <div className="text-center text-sm leading-4 text-muted-foreground">
              <span>
                {"Select or drag max 1 file | PNG, JPEG, WEBP, GIF | < 4.88MB"}
              </span>
            </div>
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </>
  );
};

export default UploadImage;
