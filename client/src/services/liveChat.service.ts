import { axiosPrivate, axiosBase } from "~/axiosAuth";
import { ILiveChat, IMessage, ICreateLiveChatPayload } from "~/types";
/**
 * @description Tạo live chat mới
 * @route POST /api/v1/live-chat
 */
const createLiveChat = async (
  payload: ICreateLiveChatPayload,
): Promise<ILiveChat> => {
  const { data } = await axiosPrivate.post("/live-chat", payload);
  return data.data;
};
/**
 * @description Lấy live chat hiện tại của user
 * @route GET /api/v1/live-chat
 */
const getMyLiveChat = async (): Promise<ILiveChat | null> => {
  const { data } = await axiosPrivate.get("/live-chat");
  return data.data;
};
/**
 * @description Admin lấy tất cả live chats
 * @route GET /api/v1/live-chat/admin
 */
const getAllLiveChats = async (): Promise<ILiveChat[]> => {
  const { data } = await axiosPrivate.get("/live-chat/admin");
  return data.data;
};
/**
 * @description Admin assign một live chat
 * @route POST /api/v1/live-chat/:id/assign
 */
const assignLiveChat = async (id: string): Promise<ILiveChat> => {
  const { data } = await axiosPrivate.post(`/live-chat/${id}/assign`);
  return data.data;
};
/**
 * @description Đóng live chat
 * @route POST /api/v1/live-chat/:id/close
 */
const closeLiveChat = async (id: string): Promise<void> => {
  await axiosPrivate.post(`/live-chat/${id}/close`);
};
/**
 * @description Lấy tin nhắn của live chat
 * @route GET /api/v1/live-chat/:id/messages
 */
const getLiveChatMessages = async (id: string): Promise<IMessage[]> => {
  const { data } = await axiosPrivate.get(`/live-chat/${id}/messages`);
  return data.data;
};
/**
 * @description Gửi tin nhắn trong live chat
 * @route POST /api/v1/live-chat/:id/messages
 */
const sendLiveChatMessage = async (
  id: string,
  message: string,
): Promise<IMessage> => {
  const { data } = await axiosPrivate.post(`/live-chat/${id}/messages`, {
    message,
  });
  return data.data;
};
interface ICreateGuestLiveChatPayload {
  guestId: string;
  email: string;
  subject: string;
  message: string;
}
/**
 * @description Guest tạo live chat mới với email
 * @route POST /api/v1/live-chat/guest
 */
const createGuestLiveChat = async (
  payload: ICreateGuestLiveChatPayload,
): Promise<ILiveChat> => {
  const { data } = await axiosBase.post("/live-chat/guest", payload);
  return data.data;
};
/**
 * @description Guest lấy live chat hiện tại
 * @route GET /api/v1/live-chat/guest/:guestId
 */
const getGuestLiveChat = async (guestId: string): Promise<ILiveChat | null> => {
  const { data } = await axiosBase.get(`/live-chat/guest/${guestId}`);
  return data.data;
};
/**
 * @description Guest gửi tin nhắn trong live chat
 * @route POST /api/v1/live-chat/guest/:guestId/messages
 */
const sendGuestLiveChatMessage = async (
  guestId: string,
  message: string,
): Promise<IMessage> => {
  const { data } = await axiosBase.post(
    `/live-chat/guest/${guestId}/messages`,
    { message },
  );
  return data.data;
};
/**
 * @description Merge guest chats vào user account sau khi đăng nhập
 * @route POST /api/v1/live-chat/merge
 */
const mergeGuestChats = async (
  guestId: string,
): Promise<{ merged: number }> => {
  const { data } = await axiosPrivate.post("/live-chat/merge", { guestId });
  return data;
};
export const liveChatService = {
  createLiveChat,
  getMyLiveChat,
  getAllLiveChats,
  assignLiveChat,
  closeLiveChat,
  getLiveChatMessages,
  sendLiveChatMessage,
  createGuestLiveChat,
  getGuestLiveChat,
  sendGuestLiveChatMessage,
  mergeGuestChats,
};
