import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import MoonLoader from "react-spinners/MoonLoader";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FaPencil } from "react-icons/fa6";

type ImageProps = {
  url: string;
  size: number;
  type: string;
};

interface IUploadAvatarProps {
  currentAvatar?: string;
  onChangeImage: (file: string | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  resetTrigger?: number;
}

const UploadAvatar = ({
  currentAvatar,
  onChangeImage,
  onLoadingChange,
  resetTrigger,
}: IUploadAvatarProps) => {
  const { t } = useTranslation("common");
  const [previewImage, setPreviewImage] = useState<ImageProps | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setPreviewImage(null);
      setAvatarUrl("");
      setErrorMessage("");
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const handleUploadImage = useCallback(
    async (file: File) => {
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
        setErrorMessage(t("upload_image.errors.upload_failed"));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const onDrop = (acceptFiles: File[], rejectFiles: FileRejection[]) => {
    if (rejectFiles.length > 0) {
      setErrorMessage(t("upload_image.errors.invalid_format"));
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

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 4882816,
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
  });

  const displayImage = previewImage?.url || currentAvatar;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium leading-6 text-foreground/90">
        Avatar
      </label>
      <div
        {...getRootProps()}
        className="relative inline-block cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-border bg-card-surface">
            <MoonLoader color="#2562eb" size={24} />
          </div>
        ) : (
          <div className="relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt="Avatar"
                className="h-24 w-24 rounded-full border-2 border-border object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-border bg-card-surface">
                <span className="text-xs text-muted-foreground">
                  {t("upload_avatar.placeholder")}
                </span>
              </div>
            )}

            {/* Hover overlay */}
            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                <span className="text-center text-xs font-medium text-white">
                  {t("upload_avatar.title")}
                </span>
              </div>
            )}

            {/* Pencil Icon */}
            <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-card-surface shadow-md">
              <FaPencil className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="mt-1 text-xs text-danger">{errorMessage}</p>
      )}
    </div>
  );
};

export default UploadAvatar;