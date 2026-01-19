import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import { ILiveChat, IMessage, IConversation } from "~/types";
import { liveChatService } from "~/services/liveChat.service";
import { LIVE_CHAT_STATUS } from "~/types/constants";
const GUEST_LIVE_CHAT_ID_KEY = "cs2boost_guest_live_chat_id";
const GUEST_EMAIL_KEY = "cs2boost_guest_email";
/**
 * Hook để quản lý Live Chat cho guest (chưa đăng nhập)
 */
export const useGuestLiveChat = () => {
  const [guestId] = useState<string>(() => {
    const stored = localStorage.getItem(GUEST_LIVE_CHAT_ID_KEY);
    if (stored) return stored;
    const newId = uuidv4();
    localStorage.setItem(GUEST_LIVE_CHAT_ID_KEY, newId);
    return newId;
  });
  const [guestEmail, setGuestEmailState] = useState<string>(() => {
    return localStorage.getItem(GUEST_EMAIL_KEY) || "";
  });
  const setGuestEmail = useCallback((email: string) => {
    localStorage.setItem(GUEST_EMAIL_KEY, email);
    setGuestEmailState(email);
  }, []);
  const {
    data: liveChat,
    error,
    isLoading,
    mutate,
  } = useSWR<ILiveChat | null>(
    guestId ? [`/live-chat/guest`, guestId] : null,
    ([, id]) => liveChatService.getGuestLiveChat(id),
    { revalidateOnFocus: false },
  );
  const conversation =
    liveChat?.conversation && typeof liveChat.conversation !== "string"
      ? (liveChat.conversation as IConversation)
      : null;
  const messages: IMessage[] =
    conversation?.messages && Array.isArray(conversation.messages)
      ? (conversation.messages as IMessage[])
      : [];
  const createChat = useCallback(
    async (subject: string, message: string, email: string) => {
      setGuestEmail(email);
      const newChat = await liveChatService.createGuestLiveChat({
        guestId,
        email,
        subject,
        message,
      });
      mutate(newChat, false);
      return newChat;
    },
    [guestId, mutate, setGuestEmail],
  );
  const sendMessage = useCallback(
    async (message: string) => {
      if (!liveChat) return;
      const tempMessage: IMessage = {
        _id: `temp_${Date.now()}`,
        conversation_id:
          typeof liveChat.conversation === "string"
            ? liveChat.conversation
            : liveChat.conversation._id,
        message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        guestEmail: guestEmail,
      };
      mutate(
        (currentChat) => {
          if (!currentChat) return currentChat;
          const conv = currentChat.conversation as IConversation;
          return {
            ...currentChat,
            conversation: {
              ...conv,
              messages: [
                ...((conv?.messages as IMessage[]) || []),
                tempMessage,
              ],
            },
          };
        },
        { revalidate: false },
      );
      try {
        await liveChatService.sendGuestLiveChatMessage(guestId, message);
      } catch (error) {
        mutate();
        throw error;
      }
    },
    [liveChat, guestId, guestEmail, mutate],
  );
  const clearGuestData = useCallback(() => {
    localStorage.removeItem(GUEST_LIVE_CHAT_ID_KEY);
    localStorage.removeItem(GUEST_EMAIL_KEY);
  }, []);
  const getGuestIdForMerge = useCallback(() => {
    return localStorage.getItem(GUEST_LIVE_CHAT_ID_KEY);
  }, []);
  return {
    guestId,
    guestEmail,
    setGuestEmail,
    liveChat,
    messages,
    isLoading,
    error,
    isOpen: !!liveChat,
    isWaiting: liveChat?.status === LIVE_CHAT_STATUS.WAITING,
    isConnected: liveChat?.status === LIVE_CHAT_STATUS.IN_PROGRESS,
    createChat,
    sendMessage,
    clearGuestData,
    getGuestIdForMerge,
    refresh: mutate,
  };
};