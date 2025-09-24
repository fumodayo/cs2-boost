"use client";

import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  useLayoutEffect,
} from "react";
import { useTranslation } from "react-i18next";
import { IoMdSend } from "react-icons/io";
import { HiXMark } from "react-icons/hi2";
import { useBotChat } from "~/hooks/useBotChat";
import { IBotMessage } from "~/types";
import Spinner from "../Spinner";
import { Button } from "../Button";
import { IoChatbubbleEllipsesOutline, IoImageOutline } from "react-icons/io5";
import {
  Dialog,
  DialogTrigger,
  EditDialogContent,
} from "~/components/@radix-ui/Dialog";

interface BotChatInputProps {
  onSendMessage: (message: string, file: File | null) => Promise<void>;
}

const ChatInput = ({ onSendMessage }: BotChatInputProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!messageInput.trim() && !file) return;
    setIsSending(true);
    try {
      await onSendMessage(messageInput, file);
      setMessageInput("");
      handleRemoveImage();
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn từ AI_ChatInput:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      {previewUrl && (
        <div className="relative mb-2 inline-block">
          <img
            src={previewUrl}
            alt="Image preview"
            className="h-24 w-24 rounded-lg object-cover"
          />
          <Button
            onClick={handleRemoveImage}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white transition-transform hover:scale-110"
            aria-label="Remove image"
          >
            <HiXMark size={16} />
          </Button>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="ai-chat-file-upload"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="h-9 w-9 flex-shrink-0 rounded-full p-0 text-muted-foreground hover:text-primary"
          variant="ghost"
        >
          <span className="sr-only">Attach file</span>
          <IoImageOutline size={20} />
        </Button>
        <div className="relative flex-grow">
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isSending && handleSubmit()}
            placeholder="Nhắn tin cho AI..."
            className="w-full rounded-full border-0 bg-background px-4 py-2 text-sm shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            disabled={isSending}
          />
        </div>
        <Button
          disabled={isSending || (!messageInput.trim() && !file)}
          onClick={handleSubmit}
          variant="primary"
          className="h-9 w-9 flex-shrink-0 rounded-full p-0"
        >
          <span className="sr-only">Send Message</span>
          <IoMdSend size={16} />
        </Button>
      </div>
    </div>
  );
};

const BotTypingIndicator = () => (
  <div className="max-w-[85%] self-start rounded-lg rounded-bl-none border border-border bg-background p-3">
    <div className="flex items-center justify-center space-x-1">
      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></span>
    </div>
  </div>
);

const BotChatWidget = () => {
  const { t } = useTranslation();

  const {
    messages,
    isLoading: isLoadingHistory,
    isBotTyping,
    handleSendMessage,
  } = useBotChat();

  const scrollAnchorRef = useRef<null | HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isLoadingHistory]);

  const performSendMessage = async (message: string, file: File | null) => {
    await handleSendMessage(message, file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Mở chat AI"
        >
          <IoChatbubbleEllipsesOutline className="h-8 w-8" />
        </Button>
      </DialogTrigger>

      <EditDialogContent
        title="ai_assistant"
        className="fixed bottom-6 right-6 z-50 h-[85vh] max-h-[600px] w-full max-w-md overflow-hidden rounded-xl bg-background shadow-2xl transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:slide-out-to-right-2 data-[state=open]:slide-in-from-bottom-2 data-[state=open]:slide-in-from-right-2 md:right-6 md:top-auto md:h-[85vh] md:rounded-xl"
      >
        <div className="scrollbar-thin flex-1 overflow-y-auto p-4 pr-2">
          {isLoadingHistory ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="max-w-[85%] self-start rounded-lg rounded-bl-none border border-border bg-background p-3">
                <p className="m-0 whitespace-pre-wrap break-words">
                  {t(
                    "Dialog.subtitle.ai_assistant_greeting",
                    "Xin chào! Bạn cần tôi giúp gì hôm nay? 😊",
                  )}
                </p>
              </div>

              {messages.map((msg: IBotMessage) => (
                <div
                  key={msg._id}
                  className={`max-w-[85%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "self-end rounded-br-none bg-primary text-primary-foreground"
                      : "self-start rounded-bl-none border border-border bg-background text-foreground"
                  }`}
                >
                  <p className="m-0 whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                  {(msg.imageUrl || msg.filePreview) && (
                    <img
                      src={msg.imageUrl || msg.filePreview}
                      alt="Uploaded content"
                      className="mt-2 inline-block max-w-[200px] rounded-lg"
                    />
                  )}
                </div>
              ))}

              <div ref={scrollAnchorRef} />
              {isBotTyping && <BotTypingIndicator />}
            </div>
          )}
        </div>

        <div className="mt-auto flex-shrink-0 border-t border-border bg-muted/50 p-3">
          <ChatInput onSendMessage={performSendMessage} />
        </div>
      </EditDialogContent>
    </Dialog>
  );
};

export default BotChatWidget;
