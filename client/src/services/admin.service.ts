import { axiosPrivate } from "~/axiosAuth";
import {
  IOrder,
  IBanUserPayload,
  IUser,
  IUserResponse,
  IPaginatedResponse,
  IAddUserPayload,
} from "~/types";
/**
 * @description Lấy danh sách người dùng với các tùy chọn lọc và phân trang.
 * @route GET /api/admin/users
 * @param params - Các query params để lọc, sắp xếp và phân trang.
 * @returns { Promise<IPaginatedResponse<IUser>>} - Dữ liệu người dùng đã được phân trang.
 */
const getUsers = async (
  params: URLSearchParams,
): Promise<IPaginatedResponse<IUser>> => {
  const { data } = await axiosPrivate.get("/admin/users", { params });
  return data;
};
/**
 * @description Admin tạo một tài khoản người dùng mới.
 * @route POST /api/admin/users
 * @param payload - Thông tin người dùng mới (username, email, password, role).
 * @returns {Promise<IUser>} - Đối tượng người dùng vừa được tạo.
 */
const createUser = async (payload: IAddUserPayload): Promise<IUser> => {
  console.log({ payload });
  const { data } = await axiosPrivate.post("/admin/users/create", payload);
  return data.data;
};
/**
 * @description Admin cấm (ban) một người dùng.
 * @route POST /api/admin/users/:userId/ban
 * @param userId - ID của người dùng cần cấm.
 * @param payload - Dữ liệu chứa lý do và số ngày cấm.
 * @returns {Promise<IUserResponse>} - Phản hồi từ server.
 */
const banUser = async (
  userId: string,
  payload: IBanUserPayload,
): Promise<IUserResponse> => {
  const { data } = await axiosPrivate.post(
    `/admin/users/${userId}/ban`,
    payload,
  );
  return data;
};
/**
 * @description Admin gỡ cấm (unban) cho một người dùng.
 * @route POST /api/admin/users/:userId/unban
 * @param userId - ID của người dùng cần gỡ cấm.
 * @returns {Promise<IUserResponse>} - Phản hồi từ server.
 */
const unbanUser = async (userId: string): Promise<IUserResponse> => {
  const { data } = await axiosPrivate.post(`/admin/users/${userId}/unban`);
  return data;
};
/**
 * @description Lấy danh sách tất cả đơn hàng trong hệ thống (có thể lọc).
 * @route GET /api/admin/orders
 * @param params - Các query params để lọc, sắp xếp và phân trang.
 * @returns {Promise<IPaginatedResponse<IOrder>>} - Dữ liệu đơn hàng đã được phân trang.
 */
const getAdminOrders = async (
  params: URLSearchParams | string,
): Promise<IPaginatedResponse<IOrder>> => {
  let queryParams: URLSearchParams;
  if (typeof params === "string") {
    queryParams = new URLSearchParams();
    queryParams.append("userId", params);
  } else {
    queryParams = params;
  }
  const { data } = await axiosPrivate.get("/admin/orders", {
    params: queryParams,
  });
  console.log({ data });
  return data;
};
/**
 * @description Lấy thông tin chi tiết của một đơn hàng cụ thể.
 * @route GET /api/admin/orders/:orderId
 * @param orderId - ID của đơn hàng cần xem chi tiết.
 * @returns {Promise<IOrder>} - Đối tượng đơn hàng chi tiết.
 */
const getOrderDetails = async (orderId: string): Promise<IOrder> => {
  const { data } = await axiosPrivate.get(`/admin/orders/${orderId}`);
  return data.data;
};
/**
 * @description Lấy các chỉ số thống kê tài chính quan trọng cho dashboard.
 * @route GET /api/admin/stats/revenue
 * @param days - Số ngày cần thống kê (mặc định 30).
 */
const getRevenueStats = async (days: number = 30) => {
  const { data } = await axiosPrivate.get("/admin/stats/revenue", {
    params: { days },
  });
  return data.data;
};
/**
 * @description Lấy danh sách tất cả giao dịch trong hệ thống.
 * @route GET /api/admin/transactions
 * @param params - Các query params để lọc, sắp xếp và phân trang.
 */
const getAllTransactions = async (params: URLSearchParams) => {
  const { data } = await axiosPrivate.get("/admin/transactions", { params });
  return { data: data.data, pagination: data.pagination };
};
/**
 * @description Admin cập nhật thông tin người dùng (email, password).
 * @route PUT /api/admin/users/:userId
 * @param userId - ID của người dùng cần cập nhật.
 * @param payload - Dữ liệu cập nhật (email_address, password).
 * @returns {Promise<IUserResponse>} - Phản hồi từ server.
 */
const updateUserByAdmin = async (
  userId: string,
  payload: { email_address?: string; password?: string },
): Promise<IUserResponse> => {
  const { data } = await axiosPrivate.put(`/admin/users/${userId}`, payload);
  return data;
};
/**
 * @description Admin phát thông báo đến tất cả người dùng.
 * @route POST /api/admin/announcements
 * @param payload - Dữ liệu thông báo (title, content, image).
 */
const broadcastAnnouncement = async (payload: {
  title: string;
  content: string;
  image?: string;
}) => {
  const { data } = await axiosPrivate.post("/admin/announcements", payload);
  return data;
};
const getEmailTemplates = async () => {
  const { data } = await axiosPrivate.get("/admin/email-templates");
  return data;
};
const getEmailTemplateById = async (id: string) => {
  const { data } = await axiosPrivate.get(`/admin/email-templates/${id}`);
  return data;
};
const updateEmailTemplate = async (
  id: string,
  payload: { subject?: string; html_content?: string; is_active?: boolean },
) => {
  const { data } = await axiosPrivate.put(
    `/admin/email-templates/${id}`,
    payload,
  );
  return data;
};
const previewEmailTemplate = async (
  id: string,
  variables: Record<string, string>,
) => {
  const { data } = await axiosPrivate.post(
    `/admin/email-templates/${id}/preview`,
    { variables },
  );
  return data;
};
/**
 * @description Admin gửi email thông báo mật khẩu mới cho user.
 * @route POST /api/admin/email-templates/send-password-reset
 * @param userId - ID của user cần gửi email.
 * @param password - Mật khẩu mới.
 */
const sendPasswordResetEmail = async (userId: string, password: string) => {
  const { data } = await axiosPrivate.post(
    "/admin/email-templates/send-password-reset",
    { userId, password },
  );
  return data;
};
const getAnnouncements = async () => {
  const { data } = await axiosPrivate.get("/admin/announcements");
  return data;
};
const createAnnouncement = async (payload: {
  title: string;
  content: string;
  image?: string;
}) => {
  const { data } = await axiosPrivate.post("/admin/announcements", payload);
  return data;
};
const deleteAnnouncement = async (id: string) => {
  const { data } = await axiosPrivate.delete(`/admin/announcements/${id}`);
  return data;
};
const broadcastAnnouncementById = async (id: string) => {
  const { data } = await axiosPrivate.post(
    `/admin/announcements/${id}/broadcast`,
  );
  return data;
};
const sendAnnouncementEmail = async () => {
  const { data } = await axiosPrivate.post(
    "/admin/email-templates/send-announcement",
  );
  return data;
};
export interface ISystemSettings {
  _id: string;
  partnerCommissionRate: number;
  cancellationPenaltyRate: number;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
export interface IUpdateSystemSettingsPayload {
  partnerCommissionRate?: number;
  cancellationPenaltyRate?: number;
}
/**
 * @description Lấy cấu hình hệ thống hiện tại.
 * @route GET /api/admin/settings
 */
const getSystemSettings = async (): Promise<ISystemSettings> => {
  const { data } = await axiosPrivate.get("/admin/settings");
  return data.data;
};
/**
 * @description Cập nhật cấu hình hệ thống (tỷ lệ hoa hồng).
 * @route PUT /api/admin/settings
 */
const updateSystemSettings = async (
  payload: IUpdateSystemSettingsPayload,
): Promise<ISystemSettings> => {
  const { data } = await axiosPrivate.put("/admin/settings", payload);
  return data.data;
};
import { IPartnerRequest, IPaginatedResponse as IPaginatedResp } from "~/types";
/**
 * @description Lấy danh sách yêu cầu đăng ký Partner.
 * @route GET /api/admin/partner-requests
 */
const getPartnerRequests = async (
  params: URLSearchParams,
): Promise<IPaginatedResp<IPartnerRequest>> => {
  const { data } = await axiosPrivate.get("/admin/partner-requests", {
    params,
  });
  return data;
};
/**
 * @description Admin duyệt yêu cầu đăng ký Partner.
 * @route POST /api/admin/partner-requests/:id/approve
 */
const approvePartnerRequest = async (id: string) => {
  const { data } = await axiosPrivate.post(
    `/admin/partner-requests/${id}/approve`,
  );
  return data;
};
/**
 * @description Admin từ chối yêu cầu đăng ký Partner.
 * @route POST /api/admin/partner-requests/:id/reject
 */
const rejectPartnerRequest = async (id: string, reason?: string) => {
  const { data } = await axiosPrivate.post(
    `/admin/partner-requests/${id}/reject`,
    { reason },
  );
  return data;
};
export const adminService = {
  getUsers,
  createUser,
  banUser,
  unbanUser,
  getAdminOrders,
  getOrderDetails,
  getRevenueStats,
  getAllTransactions,
  updateUserByAdmin,
  broadcastAnnouncement,
  getEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  previewEmailTemplate,
  sendPasswordResetEmail,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  broadcastAnnouncementById,
  sendAnnouncementEmail,
  getSystemSettings,
  updateSystemSettings,
  getPartnerRequests,
  approvePartnerRequest,
  rejectPartnerRequest,
};
