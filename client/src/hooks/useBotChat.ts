// hooks/useBotChat.ts

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

import { IBotMessage } from "~/types";
import { RootState } from "~/redux/store";
import { useSocketContext } from "./useSocketContext";
import { botChatService } from "~/services/botchat.service";
import { uploadFile } from "~/services/upload.service";

const GUEST_CHAT_ID_KEY = "guestChatId";

export const useBotChat = () => {
  const { socket } = useSocketContext();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [isBotTyping, setIsBotTyping] = useState(false);

  const [chatSessionId, setChatSessionId] = useState<string | null>(() => {
    return currentUser?._id || localStorage.getItem(GUEST_CHAT_ID_KEY);
  });

  useEffect(() => {
    const currentId =
      currentUser?._id || localStorage.getItem(GUEST_CHAT_ID_KEY);
    setChatSessionId(currentId);
  }, [currentUser]);

  const swrKey = chatSessionId ? ["/ai-chat/history", chatSessionId] : null;

  const {
    data: messages,
    error,
    isLoading,
    mutate,
  } = useSWR(swrKey, ([, id]) => botChatService.getHistory(id), {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewAIMessage = (newMessage: IBotMessage) => {
      setIsBotTyping(false);
      mutate((currentMessages = []) => {
        if (!currentMessages.some((msg) => msg._id === newMessage._id)) {
          return [...currentMessages, newMessage];
        }
        return currentMessages;
      }, false);
    };

    const handleAIError = (error: { message: string }) => {
      setIsBotTyping(false);
      toast.error(`Lỗi từ AI: ${error.message}`);
    };

    socket.on("newAIMessage", handleNewAIMessage);
    socket.on("aiError", handleAIError);

    return () => {
      socket.off("newAIMessage", handleNewAIMessage);
      socket.off("aiError", handleAIError);
    };
  }, [socket, mutate]);

  const handleSendMessage = async (text: string, file: File | null) => {
    let idForRequest = chatSessionId;
    const isFirstMessageForGuest = !idForRequest;

    if (isFirstMessageForGuest) {
      idForRequest = uuidv4();
    }

    const tempUserMessage: Partial<IBotMessage> = {
      _id: `temp_${Date.now()}`,
      role: "user",
      text: text,
      createdAt: new Date().toISOString(),
      filePreview: file ? URL.createObjectURL(file) : undefined,
    };

    mutate(
      (current = []) => [...current, tempUserMessage as IBotMessage],
      false,
    );

    try {
      let uploadedImageUrl: string | null = null;
      if (file) {
        uploadedImageUrl = (await uploadFile(file)).url;
      }

      const savedUserMessage = await botChatService.sendMessage({
        message: text,
        imageUrl: uploadedImageUrl,
        userId: idForRequest!,
      });

      setIsBotTyping(true);

      if (isFirstMessageForGuest) {
        localStorage.setItem(GUEST_CHAT_ID_KEY, idForRequest!);
        setChatSessionId(idForRequest!);
      }

      mutate(
        (current = []) =>
          current.map((msg) =>
            msg._id === tempUserMessage._id ? savedUserMessage : msg,
          ),
        false,
      );
    } catch (err) {
      console.error("Không thể gửi tin nhắn:", err);
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
      setIsBotTyping(false);
      mutate(
        (current = []) =>
          current.filter((msg) => msg._id !== tempUserMessage._id),
        false,
      );
    }
  };

  return {
    messages: messages || [],
    isLoading,
    error,
    handleSendMessage,
    isBotTyping,
  };
};
