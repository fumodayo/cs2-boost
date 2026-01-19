import { axiosPrivate } from "~/axiosAuth";
import axios from "axios";
import {
  IOrder,
  IAccountPayload,
  ICreateOrderPayload,
  IPaginatedResponse,
  IDirectResponse,
  ISuccessResponse,
  IAccount,
  IArrayDataSuccessResponse,
} from "~/types";
export interface ICommissionRates {
  partnerCommissionRate: number;
  cancellationPenaltyRate: number;
}
/**
 * @description Lấy danh sách các đơn hàng của người dùng đang đăng nhập.
 * @route   GET /api/order/my-orders
 * @param   {URLSearchParams} params - Các query params để lọc, sắp xếp và phân trang.
 * @returns {Promise<IPaginatedResponse<IOrder>>} - Dữ liệu đơn hàng đã được phân trang.
 */
const getMyOrders = async (
  params: URLSearchParams,
): Promise<IPaginatedResponse<IOrder>> => {
  const { data } = await axiosPrivate.get("/order/my-orders", { params });
  return data;
};
/**
 * @description Lấy thông tin chi tiết của một đơn hàng bằng `boostId`.
 * @route   GET /api/order/:boostId
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @returns {Promise<IOrder>} - Đối tượng đơn hàng chi tiết.
 */
const getOrderById = async (boostId: string): Promise<IOrder> => {
  const { data } = await axiosPrivate.get(`/order/${boostId}`);
  return data.data;
};
/**
 * @description Người dùng tạo một đơn hàng mới.
 * @route   POST /api/orders
 * @param   {ICreateOrderPayload} payload - Dữ liệu cần thiết để tạo đơn hàng.
 * @returns {Promise<IDirectResponse>} - Phản hồi chứa `boost_id` của đơn hàng mới.
 */
const createOrder = async (
  payload: ICreateOrderPayload,
): Promise<IDirectResponse> => {
  const { data } = await axiosPrivate.post(`/order`, payload);
  return data;
};
/**
 * @description Người dùng xóa một đơn hàng (nếu được phép).
 * @route   DELETE /api/order/:boostId
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @returns {Promise<ISuccessResponse>} - Phản hồi thông báo thành công hoặc thất bại.
 */
const deleteOrder = async (boostId: string): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.delete(`/order/${boostId}`);
  return data;
};
/**
 * @description Người dùng gán một Partner cụ thể cho đơn hàng của mình.
 * @route   POST /api/order/:boostId/assign
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @param   {ISuccessResponse} payload - Dữ liệu chứa `partnerId`.
 * @returns {Promise<ISuccessResponse>} - Phản hồi thông báo thành công hoặc thất bại.
 */
const assignPartner = async (
  boostId: string,
  payload: { partnerId?: string },
): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.post(`/order/${boostId}/assign`, payload);
  return data;
};
/**
 * @description Người dùng từ chối Partner đã được gán cho đơn hàng.
 * @route   POST /api/order/:boostId/refuse
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @returns {Promise<ISuccessResponse>} - Phản hồi thông báo thành công hoặc thất bại.
 */
const refuseOrder = async (boostId: string): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.post(`/order/${boostId}/refuse`);
  return data;
};
/**
 * @description Người dùng gia hạn một đơn hàng đã hoàn thành.
 * @route   POST /api/order/:boostId/renew
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @returns {Promise<IDirectResponse>} - Phản hồi chứa `boost_id` của đơn hàng mới.
 */
const renewOrder = async (boostId: string): Promise<IDirectResponse> => {
  const { data } = await axiosPrivate.post(`/order/${boostId}/renew`);
  return data;
};
/**
 * @description Người dùng khôi phục một đơn hàng đã bị hủy.
 * @route   POST /api/order/:boostId/recover
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @returns {Promise<IDirectResponse>} - Phản hồi chứa `boost_id` của đơn hàng mới.
 */
const recoveryOrder = async (boostId: string): Promise<IDirectResponse> => {
  const { data } = await axiosPrivate.post(`/order/${boostId}/recover`);
  return data.data;
};
/**
 * @description Người dùng thêm thông tin tài khoản game vào một đơn hàng.
 * @route   POST /api/order/:boostId/account
 * @param   {string} boostId - ID của đơn hàng (`boost_id`) để liên kết.
 * @param   {IAccountPayload} payload - Thông tin đăng nhập của tài khoản game.
 * @returns {Promise<{ success: boolean; message: string; data: IAccount }>} - Phản hồi chứa thông tin tài khoản vừa tạo.
 */
const addAccountToOrder = async (
  boostId: string,
  payload: IAccountPayload,
): Promise<IArrayDataSuccessResponse<IAccount>> => {
  const { data } = await axiosPrivate.post(
    `/order/${boostId}/account`,
    payload,
  );
  return data;
};
/**
 * @description Người dùng chỉnh sửa thông tin tài khoản game đã liên kết với đơn hàng.
 * @route   PATCH /api/order/accounts/:accountId
 * @param   {string} accountId - ID của tài khoản game cần chỉnh sửa.
 * @param   {IAccountPayload} payload - Thông tin mới của tài khoản.
 * @returns {Promise<IArrayDataSuccessResponse<IAccount>>} - Phản hồi chứa thông tin tài khoản đã cập nhật.
 */
const editAccountOnOrder = async (
  accountId: string,
  payload: IAccountPayload,
): Promise<IArrayDataSuccessResponse<IAccount>> => {
  const { data } = await axiosPrivate.patch(
    `/order/accounts/${accountId}`,
    payload,
  );
  return data;
};
/**
 * @description (Partner) Lấy danh sách các đơn hàng đang chờ nhận.
 * @route   GET /api/order/pending
 * @param   {URLSearchParams} params - Các query params để lọc và phân trang.
 * @returns {Promise<IPaginatedResponse<IOrder>>} - Dữ liệu đơn hàng đã được phân trang.
 */
const getPendingOrders = async (
  params: URLSearchParams,
): Promise<IPaginatedResponse<IOrder>> => {
  const { data } = await axiosPrivate.get("/order/pending", { params });
  return data;
};
/**
 * @description (Partner) Lấy danh sách các đơn hàng đang được thực hiện.
 * @route   GET /api/order/in-progress
 * @param   {URLSearchParams} params - Các query params để lọc và phân trang.
 * @returns {Promise<IPaginatedResponse<IOrder>>} - Dữ liệu đơn hàng đã được phân trang.
 */
const getProgressOrders = async (
  params: URLSearchParams,
): Promise<IPaginatedResponse<IOrder>> => {
  const { data } = await axiosPrivate.get("/order/in-progress", { params });
  return data;
};
/**
 * @description (Partner) Chấp nhận một đơn hàng để bắt đầu thực hiện.
 * @route   POST /api/order/:boostId/accept
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @returns {Promise<ISuccessResponse>} - Phản hồi thông báo thành công hoặc thất bại.
 */
const acceptOrder = async (boostId: string): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.post(`/order/${boostId}/accept`);
  return data;
};
/**
 * @description (Partner) Đánh dấu một đơn hàng là đã hoàn thành.
 * @route   POST /api/order/:boostId/complete
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @returns {Promise<ISuccessResponse>} - Phản hồi thông báo thành công hoặc thất bại.
 */
const completeOrder = async (boostId: string): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.post(`/order/${boostId}/complete`);
  return data;
};
/**
 * @description (Partner) Hủy một đơn hàng đang thực hiện.
 * @route   POST /api/order/:boostId/cancel
 * @param   {string} boostId - ID của đơn hàng (`boost_id`).
 * @returns {Promise<ISuccessResponse>} - Phản hồi thông báo thành công hoặc thất bại.
 */
const cancelOrder = async (boostId: string): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.post(`/order/${boostId}/cancel`);
  return data;
};
/**
 * @description Lấy tỷ lệ hoa hồng hiện tại từ hệ thống.
 * @route   GET /api/utility/commission-rates
 * @returns {Promise<ICommissionRates>} - Tỷ lệ hoa hồng partner và phí phạt hủy đơn.
 */
const getCommissionRates = async (): Promise<ICommissionRates> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/utility/commission-rates`,
  );
  return data.data;
};
/**
 * @description Complete a free order using 100% discount promo code.
 * @route   POST /api/order/:boostId/complete-free
 * @param   {string} boostId - ID of the order (boost_id).
 * @param   {string} promoCode - The promo code that provides 100% discount.
 * @returns {Promise<ISuccessResponse>} - Success or failure response.
 */
const completeFreeOrder = async (
  boostId: string,
  promoCode: string,
): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.post(`/order/${boostId}/complete-free`, {
    promoCode,
  });
  return data;
};
export const orderService = {
  getMyOrders,
  getOrderById,
  createOrder,
  deleteOrder,
  assignPartner,
  refuseOrder,
  renewOrder,
  recoveryOrder,
  addAccountToOrder,
  editAccountOnOrder,
  getPendingOrders,
  getProgressOrders,
  acceptOrder,
  completeOrder,
  cancelOrder,
  getCommissionRates,
  completeFreeOrder,
};
