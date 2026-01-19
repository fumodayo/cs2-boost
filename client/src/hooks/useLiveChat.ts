import { useEffect, useCallback } from "react";
import useSWR from "swr";
import { ILiveChat, IMessage, IUser, IConversation } from "~/types";
import { useSocketContext } from "./useSocketContext";
import { liveChatService } from "~/services/liveChat.service";
import { LIVE_CHAT_STATUS } from "~/types/constants";
/**
 * Hook để quản lý Live Chat cho user
 */
export const useLiveChat = (currentUser?: IUser | null) => {
  const { socket } = useSocketContext();
  const {
    data: liveChat,
    error,
    isLoading,
    mutate,
  } = useSWR<ILiveChat | null>(
    currentUser ? "/live-chat/my" : null,
    liveChatService.getMyLiveChat,
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
  useEffect(() => {
    if (!socket || !currentUser) return;
    const handleAssigned = (updatedChat: ILiveChat) => {
      if (liveChat && updatedChat._id === liveChat._id) {
        mutate(updatedChat, false);
      }
    };
    const handleNewMessage = ({
      liveChatId,
      message,
    }: {
      liveChatId: string;
      message: IMessage;
    }) => {
      if (liveChat && liveChatId === liveChat._id) {
        mutate(
          (currentChat) => {
            if (!currentChat) return currentChat;
            const conv = currentChat.conversation as IConversation;
            const existingMessages = (conv?.messages as IMessage[]) || [];
            if (existingMessages.some((m) => m._id === message._id)) {
              return currentChat;
            }
            return {
              ...currentChat,
              conversation: {
                ...conv,
                messages: [...existingMessages, message],
              },
            };
          },
          { revalidate: false },
        );
      }
    };
    const handleClosed = ({ id }: { id: string }) => {
      if (liveChat && id === liveChat._id) {
        mutate(null, false);
      }
    };
    socket.on("liveChatAssigned", handleAssigned);
    socket.on("liveChatMessage", handleNewMessage);
    socket.on("liveChatClosed", handleClosed);
    return () => {
      socket.off("liveChatAssigned", handleAssigned);
      socket.off("liveChatMessage", handleNewMessage);
      socket.off("liveChatClosed", handleClosed);
    };
  }, [socket, currentUser, liveChat, mutate]);
  const createChat = useCallback(
    async (subject: string, message: string) => {
      const newChat = await liveChatService.createLiveChat({
        subject,
        message,
      });
      mutate(newChat, false);
      return newChat;
    },
    [mutate],
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
        sender: currentUser!,
        message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
        await liveChatService.sendLiveChatMessage(liveChat._id, message);
      } catch (error) {
        mutate();
        throw error;
      }
    },
    [liveChat, currentUser, mutate],
  );
  const closeChat = useCallback(async () => {
    if (!liveChat) return;
    await liveChatService.closeLiveChat(liveChat._id);
    mutate(null, false);
  }, [liveChat, mutate]);
  return {
    liveChat,
    messages,
    isLoading,
    error,
    isOpen: !!liveChat,
    isWaiting: liveChat?.status === LIVE_CHAT_STATUS.WAITING,
    isConnected: liveChat?.status === LIVE_CHAT_STATUS.IN_PROGRESS,
    createChat,
    sendMessage,
    closeChat,
    refresh: mutate,
  };
};