import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import MoonLoader from "react-spinners/MoonLoader";
import cn from "~/libs/utils";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
type ImageProps = {
  url: string;
  size: number;
  type: string;
  name: string;
};
interface IUploadBannerProps {
  currentBanner?: string;
  onChangeImage: (file: string | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  resetTrigger?: number;
}
const UploadBanner = ({
  onChangeImage,
  onLoadingChange,
  resetTrigger,
}: IUploadBannerProps) => {
  const { t } = useTranslation("common");
  const [previewImage, setPreviewImage] = useState<ImageProps | null>(null);
  const [bannerUrl, setBannerUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setPreviewImage(null);
      setBannerUrl("");
      setErrorMessage("");
      setUploadComplete(false);
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
      setUploadComplete(false);
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/upload`,
          formData,
          {
            withCredentials: true,
          },
        );
        setBannerUrl(data.url);
        setUploadComplete(true);
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
        name: acceptFiles[0].name,
      });
      setErrorMessage("");
      handleUploadImage(acceptFiles[0]);
    }
  };
  useEffect(() => {
    if (typeof onChangeImage === "function") {
      onChangeImage(bannerUrl);
    }
  }, [bannerUrl, onChangeImage]);
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    setBannerUrl("");
    setUploadComplete(false);
    onChangeImage(null);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    maxSize: 10485760, 
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
  });
  return (
    <div className="flex flex-col">
      <label className="mb-1.5 block text-sm font-medium leading-6 text-foreground/90">
        Banner
      </label>
      {previewImage ? (
        <div className="relative overflow-hidden rounded-lg border border-border bg-card-surface">
          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90"
          >
            <FiX className="h-4 w-4" />
          </button>
          {/* Preview image */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                <MoonLoader color="#2562eb" size={32} />
              </div>
            )}
            <img
              src={previewImage.url}
              alt="Banner preview"
              className="h-40 w-full object-cover"
            />
          </div>
          {/* Upload status */}
          <div className="flex items-center gap-2 p-2">
            <span className="max-w-[200px] truncate text-xs text-foreground">
              {previewImage.name}
            </span>
            {uploadComplete && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-success">
                  {t("upload_banner.upload_complete")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("upload_banner.tap_to_undo")}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            isDragActive && "border-primary bg-primary/10",
            "w-full cursor-pointer rounded-lg border border-dashed border-border bg-card-surface p-6 transition-colors hover:border-primary/50 hover:bg-card-surface/80",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              {t("upload_banner.subtitle")}
            </p>
          </div>
        </div>
      )}
      <p className="mt-1.5 text-xs text-muted-foreground">
        {t("upload_banner.dimensions_hint")}
      </p>
      {errorMessage && (
        <p className="mt-1 text-xs text-danger">{errorMessage}</p>
      )}
    </div>
  );
};
export default UploadBanner;