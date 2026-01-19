import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { FaRegFaceSmile } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { FiImage, FiX } from "react-icons/fi";
import { Button } from "~/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/@radix-ui/Popover";
import { uploadMultipleFiles } from "~/services/upload.service";
import toast from "react-hot-toast";
import { Spinner } from "~/components/ui";
interface ChatInputProps {
  onSendMessage: (message: string, images?: string[]) => Promise<void>;
}
const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024; 
const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const { t } = useTranslation("boost_page");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleEmojiClick = (e: EmojiClickData) => {
    setMessageInput((prev) => prev + e.emoji);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > MAX_IMAGES) {
      toast.error(t("chat_input.max_images_error", { max: MAX_IMAGES }));
      return;
    }
    const validFiles: File[] = [];
    const newPreviews: string[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          t("chat_input.file_too_large", { name: file.name, max: "2MB" }),
        );
        continue;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(t("chat_input.invalid_file_type", { name: file.name }));
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const removeImage = (index: number) => {
    if (isSending) return;
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const clearAllImages = () => {
    if (isSending) return;
    previews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && selectedFiles.length === 0) || isSending)
      return;
    setIsSending(true);
    setIsUploading(selectedFiles.length > 0);
    try {
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        try {
          const result = await uploadMultipleFiles(selectedFiles);
          imageUrls = result.urls;
        } catch {
          toast.error(t("chat_input.upload_failed"));
          setIsSending(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }
      await onSendMessage(
        messageInput,
        imageUrls.length > 0 ? imageUrls : undefined,
      );
      setMessageInput("");
      clearAllImages();
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn từ ChatInput:", error);
    } finally {
      setIsSending(false);
      setIsUploading(false);
    }
  };
  const isDisabled =
    isSending || (!messageInput.trim() && selectedFiles.length === 0);
  return (
    <form onSubmit={handleFormSubmit} className="relative">
      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="relative mb-3 rounded-lg border border-border bg-muted/30 p-2">
          {/* Loading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <Spinner size="md" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t("chat_input.uploading", {
                    defaultValue: "Đang tải ảnh lên...",
                  })}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="group relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className={`h-20 w-20 rounded-lg object-cover transition-opacity ${
                    isUploading ? "opacity-50" : ""
                  }`}
                />
                {!isSending && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>
            ))}
            {selectedFiles.length > 1 && !isSending && (
              <button
                type="button"
                onClick={clearAllImages}
                className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                <FiX size={16} />
                <span className="mt-1">{t("chat_input.clear_all")}</span>
              </button>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <div className="flex w-full items-center rounded-full border border-border bg-background px-2 shadow-sm focus-within:ring-2 focus-within:ring-primary">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0 rounded-full text-muted-foreground hover:text-primary"
                disabled={isSending}
              >
                <FaRegFaceSmile size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              className="mb-2 border-none bg-transparent p-0"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height={350}
              />
            </PopoverContent>
          </Popover>
          {/* Image Upload Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 rounded-full text-muted-foreground hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <FiImage size={20} />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={t("chat_input.placeholder")}
            className="flex-grow border-0 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            disabled={isSending}
          />
          {selectedFiles.length > 0 && (
            <span className="mr-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {selectedFiles.length} {t("chat_input.images_count")}
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={isDisabled}
          variant="primary"
          className="h-9 w-9 flex-shrink-0 rounded-full p-0"
        >
          <span className="sr-only">{t("chat_input.send_message_sr")}</span>
          {isSending ? (
            <Spinner size="sm" color="white" />
          ) : (
            <IoMdSend size={18} />
          )}
        </Button>
      </div>
    </form>
  );
};
export default ChatInput;