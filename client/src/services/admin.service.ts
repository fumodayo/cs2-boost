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

export const adminService = {
  getUsers,
  createUser,
  banUser,
  unbanUser,
  getAdminOrders,
  getOrderDetails,
  getRevenueStats,
  getAllTransactions,
};
