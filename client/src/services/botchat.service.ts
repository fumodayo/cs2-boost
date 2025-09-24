import { axiosInstance } from "~/axiosAuth";
import { IBotMessage } from "~/types";

interface SendAIMessagePayload {
  message: string;
  imageUrl?: string | null;
  userId: string;
}

/**
 * @description Gửi một tin nhắn mới đến AI.
 * @param payload - Dữ liệu tin nhắn và userId/guestId.
 * @returns {Promise<IBotMessage>} - Tin nhắn của người dùng vừa được lưu.
 */
const sendMessage = async (
  payload: SendAIMessagePayload,
): Promise<IBotMessage> => {
  const { data } = await axiosInstance.post("/bot-chat/send", payload);
  return data.data;
};

/**
 * @description Lấy lịch sử cuộc trò chuyện với AI dựa trên userId hoặc guestId.
 * @param userId - ID của user thật hoặc guestId.
 * @returns {Promise<IBotMessage[]>} - Mảng các tin nhắn.
 */
const getHistory = async (userId: string): Promise<IBotMessage[]> => {
  const { data } = await axiosInstance.post("/bot-chat/history", {
    userId,
  });
  return data.data;
};

export const botChatService = {
  sendMessage,
  getHistory,
};
