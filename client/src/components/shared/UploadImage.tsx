import { CiCirclePlus } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import MoonLoader from "react-spinners/MoonLoader";
import cn from "~/libs/utils";
import axios from "axios";
import { useTranslation } from "react-i18next";

type ImageProps = {
  url: string;
  size: number;
  type: string;
};

interface IUploadImageProps {
  onChangeImage: (file: string | null) => void;
}

const UploadImage = ({ onChangeImage }: IUploadImageProps) => {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<ImageProps | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/upload`,
        formData,
        {
          withCredentials: true,
        },
      );

      setAvatarUrl(data.url);
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onDrop = (acceptFiles: File[], rejectFiles: FileRejection[]) => {
    if (rejectFiles.length > 0) {
      setErrorMessage("Invalid file format. Please select an image file");
    } else if (acceptFiles.length > 0) {
      const url = URL.createObjectURL(acceptFiles[0]);
      setPreviewImage({
        url,
        size: acceptFiles[0].size,
        type: acceptFiles[0].type,
      });

      setErrorMessage("");
      handleUploadImage(acceptFiles[0]);
    }
  };

  useEffect(() => {
    if (typeof onChangeImage === "function") {
      onChangeImage(avatarUrl);
    }
  }, [avatarUrl, onChangeImage]);

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
                className="h-32 w-32 rounded-md border border-border object-cover shadow-sm"
              />
            </div>
          )}
          <div className="flex flex-col justify-center space-y-2 text-sm text-foreground/80">
            <p className="truncate px-2">
              {t("UploadImage.label.Type")}: {previewImage.type}
            </p>
            <span
              onClick={() => {
                setPreviewImage(null);
                onChangeImage(null);
              }}
              className="relative flex w-full cursor-pointer select-none items-center justify-center rounded-md bg-danger px-1 py-2 text-sm font-bold outline-none transition-colors hover:bg-danger-hover"
            >
              {t("UploadImage.label.Remove")}
            </span>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            isDragActive && "bg-blue-200",
            "w-full cursor-pointer rounded-md border border-border bg-field py-2 hover:bg-border/50",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-x-2">
            <div className="flex items-center justify-center">
              <CiCirclePlus size={36} className="text-foreground/80" />
            </div>
            <div className="text-center text-sm leading-4 text-muted-foreground">
              {t("UploadImage.subtitle")}
            </div>
          </div>
        </div>
      )}
      {errorMessage && (
        <p className="mt-1 text-xs text-danger">{errorMessage}</p>
      )}
    </>
  );
};

export default UploadImage;
