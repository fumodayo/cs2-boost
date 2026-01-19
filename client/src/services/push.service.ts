import { axiosPrivate } from "~/axiosAuth";

/**
 * @desc Đăng ký nhận thông báo đẩy từ trình duyệt.
 * @route POST /api/push/subscribe
 */
const subscribe = (subscription: PushSubscription) => {
  return axiosPrivate.post("/push/subscribe", subscription);
};

/**
 * @desc Hủy đăng ký nhận thông báo đẩy.
 * @route POST /api/push/unsubscribe
 */
const unsubscribe = () => {
  return axiosPrivate.post("/push/unsubscribe");
};

/**
 * @desc Lấy cài đặt thông báo của người dùng.
 * @route GET /api/push/settings
 */
const getSettings = () => {
  return axiosPrivate.get("/push/settings");
};

/**
 * @desc Cập nhật cài đặt thông báo.
 * @route PATCH /api/push/settings
 */
const updateSettings = (settings: Record<string, boolean>) => {
  return axiosPrivate.patch("/push/settings", { settings });
};

export const pushService = {
  subscribe,
  unsubscribe,
  getSettings,
  updateSettings,
};
