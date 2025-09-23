import { axiosPrivate } from "~/axiosAuth";
import { IArrayDataSuccessResponse, INotification } from "~/types";

/**
 * @description Lấy danh sách thông báo của người dùng hiện tại.
 * @route GET /api/notification
 * @returns {Promise<INotification[]>} - Một mảng các thông báo.
 */
const getNotifications = async (): Promise<INotification[]> => {
  const { data } = await axiosPrivate.get("/notification");
  return data.data;
};

/**
 * @description Đánh dấu một thông báo cụ thể là đã đọc.
 * @route PATCH /api/notification/:notifyId/read
 * @param notifyId - ID của thông báo cần đánh dấu.
 * @returns {Promise<IArrayDataSuccessResponse<INotification>>} - Phản hồi từ server.
 */
const readNotification = async (
  notifyId: string,
): Promise<IArrayDataSuccessResponse<INotification>> => {
  const { data } = await axiosPrivate.patch(`/notification/${notifyId}/read`);
  return data;
};

/**
 * @description Đánh dấu tất cả thông báo chưa đọc là đã đọc.
 * @route PATCH /api/notification/read-all
 * @returns {Promise<{success: boolean; message: string}>} - Phản hồi từ server.
 */
const markAllAsRead = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const { data } = await axiosPrivate.patch("/notification/read-all");
  return data;
};

export const notificationService = {
  getNotifications,
  readNotification,
  markAllAsRead,
};
