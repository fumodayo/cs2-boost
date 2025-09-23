import { FaRegFaceSmile } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";
import { Button } from "~/components/shared/Button";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleEmojiClick = (e: EmojiClickData) => {
    setMessageInput((prev) => prev + e.emoji);
    setOpenEmojiPicker(false);
  };

  const handleSubmitMessage = async () => {
    if (!messageInput.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(messageInput);
      setMessageInput("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn từ ChatInput:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isSending && handleSubmitMessage()
            }
            placeholder="Say something..."
            className="w-full rounded-full border-0 bg-background px-4 py-2 text-sm shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            disabled={isSending}
          />
          <Button
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
          >
            <FaRegFaceSmile />
          </Button>
        </div>
        <Button
          disabled={isSending || !messageInput.trim()}
          onClick={handleSubmitMessage}
          variant="primary"
          className="h-9 w-9 flex-shrink-0 rounded-full p-0"
        >
          <span className="sr-only">Send Message</span>
          <IoMdSend />
        </Button>
      </div>
      {openEmojiPicker && (
        <div className="pt-2">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
