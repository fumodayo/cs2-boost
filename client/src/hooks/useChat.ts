import { chatService } from "./../services/chat.service";
import { useEffect } from "react";
import useSWR from "swr";
import { IMessage, ISendMessagePayload, IUser } from "~/types";
import { useSocketContext } from "./useSocketContext";

/**
 * Hook tùy chỉnh để quản lý trạng thái và hành vi của một cuộc hội thoại chat.
 * @param conversationId - ID của cuộc hội thoại.
 * @param currentUser - Đối tượng người dùng hiện tại, cần thiết cho optimistic updates.
 */
export const useChat = (conversationId?: string, currentUser?: IUser | null) => {
  const swrKey = conversationId ? `/chat/${conversationId}` : null;
  const { socket } = useSocketContext();

  const {
    data: messages,
    error,
    isLoading,
    mutate,
  } = useSWR(swrKey, () => chatService.getMessages(conversationId!), {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (newMessage: IMessage) => {
      if (newMessage.conversation_id === conversationId) {
        mutate(
          (currentMessages = []) => {
            const newMessages = currentMessages.filter(
              (msg) => !msg._id.startsWith("temp_"),
            );
            if (!newMessages.some((msg) => msg._id === newMessage._id)) {
              newMessages.push(newMessage);
            }
            return newMessages;
          },
          false,
        );
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, conversationId, mutate]);


  const handleSendMessage = async (payload: ISendMessagePayload) => {
    if (!conversationId || !currentUser) {
      console.error("Không thể gửi tin nhắn: thiếu ID cuộc hội thoại hoặc người dùng.");
      return;
    }
    const tempMessage: IMessage = {
      _id: `temp_${Date.now()}`, 
      conversation_id: conversationId,
      sender: currentUser,
      message: payload.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mutate((currentMessages = []) => [...currentMessages, tempMessage], false);

    try {
      await chatService.sendMessage(conversationId, payload);
    } catch (error) {
      console.error("Gửi tin nhắn thất bại:", error);
      mutate(
        (currentMessages = []) =>
          currentMessages.filter((msg) => msg._id !== tempMessage._id),
        false,
      );
    }
  };

  return {
    messages: messages || [],
    isLoading,
    error,
    handleSendMessage,
  };
};