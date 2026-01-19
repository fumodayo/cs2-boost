import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "~/services/upload.service";
import { FiBell, FiPlus, FiSend, FiTrash2, FiImage, FiX } from "react-icons/fi";
import { Heading, Helmet, Input, TextArea } from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { adminService } from "~/services/admin.service";
import getErrorMessage from "~/utils/errorHandler";

interface IAnnouncement {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const NotificationsManagePage = () => {
  const { t } = useTranslation(["notifications_manage_page", "common"]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    "/admin/announcements",
    adminService.getAnnouncements,
  );

  const { trigger: triggerCreate, isMutating: isCreating } = useSWRMutation(
    "/admin/announcements/create",
    async () => {
      return adminService.createAnnouncement({
        title,
        content,
        image: imageUrl || undefined,
      });
    },
  );

  const announcements: IAnnouncement[] = data?.data || [];

  const handleUploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadFile(file);
      setImageUrl(result.url);
    } catch {
      toast.error(t("common:toasts.upload_error"));
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleUploadImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error(t("toasts.title_content_required"));
      return;
    }

    try {
      await triggerCreate();
      toast.success(t("toasts.created"));
      setTitle("");
      setContent("");
      setImageUrl(null);
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteAnnouncement(id);
      toast.success(t("toasts.deleted"));
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleBroadcast = async (id: string) => {
    try {
      const result = await adminService.broadcastAnnouncementById(id);
      toast.success(result.message || t("toasts.broadcasted"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return t("common:time.just_now");
    if (diffMinutes < 60)
      return t("common:time.minutes_ago", { count: diffMinutes });
    if (diffHours < 24) return t("common:time.hours_ago", { count: diffHours });
    if (diffDays < 7) return t("common:time.days_ago", { count: diffDays });
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return t("common:time.weeks_ago", { count: weeks });
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return t("common:time.months_ago", { count: months });
    }
    const years = Math.floor(diffDays / 365);
    return t("common:time.years_ago", { count: years });
  };

  return (
    <>
      <Helmet title={t("title")} />
      <div>
        <Heading icon={FiBell} title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Create Form */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">
                {t("create_announcement")}
              </h3>

              <div className="space-y-4">
                {/* Image Upload with Dropzone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("image_url")}
                  </label>
                  {imageUrl ? (
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt="Banner preview"
                        className="h-40 w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl(null)}
                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                        isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {isUploading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span>{t("common:uploading")}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <FiImage size={24} />
                          <span className="text-sm">
                            {t("common:drop_image_hint")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("title_field")}
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("title_placeholder")}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("description_field")}
                  </label>
                  <TextArea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("description_placeholder")}
                    rows={4}
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full p-2"
                  onClick={handleAdd}
                  disabled={isCreating || isUploading}
                >
                  <FiPlus className="mr-2" />
                  {isCreating ? t("adding") : t("add_to_list")}
                </Button>
              </div>
            </div>
          </div>

          {/* Announcements List */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">
                {t("announcements_list")}
              </h3>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-48 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : announcements.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground">
                    {t("no_announcements")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((item) => (
                    <div
                      key={item._id}
                      className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-muted/20"
                    >
                      {/* Banner Image */}
                      {item.image && (
                        <div className="relative h-32 w-full overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-foreground">
                          {item.title}
                        </h4>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {item.content}
                        </p>
                        <p className="mt-3 text-xs text-muted-foreground/70">
                          {formatDate(item.createdAt)}
                        </p>

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleBroadcast(item._id)}
                          >
                            <FiSend className="mr-1" /> {t("broadcast")}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FiTrash2 className="mr-1" /> {t("delete")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsManagePage;