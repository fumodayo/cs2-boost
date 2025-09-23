import { axiosPrivate } from "~/axiosAuth";
import { IMessage, ISendMessagePayload } from "~/types";

/**
 * @description Lấy tất cả tin nhắn của một cuộc trò chuyện cụ thể.
 * @route GET /api/chat/:conversationId/messages
 * @param conversationId - ID của cuộc trò chuyện.
 * @returns {Promise<IMessage[]>} - Một mảng các tin nhắn.
 */
const getMessages = async (conversationId: string): Promise<IMessage[]> => {
  const { data } = await axiosPrivate.get(`/chat/${conversationId}/messages`);
  return data.data;
};

/**
 * @description Gửi một tin nhắn mới vào một cuộc trò chuyện.
 * @route POST /api/chat/:conversationId/messages
 * @param conversationId - ID của cuộc trò chuyện.
 * @param payload - Nội dung tin nhắn và boostId liên quan.
 * @returns {Promise<IMessage>} - Tin nhắn vừa gửi đã được populate.
 */
const sendMessage = async (
  conversationId: string,
  payload: ISendMessagePayload,
): Promise<IMessage> => {
  const { data } = await axiosPrivate.post(
    `/chat/${conversationId}/messages`,
    payload,
  );
  return data.data;
};

export const chatService = {
  getMessages,
  sendMessage,
};
