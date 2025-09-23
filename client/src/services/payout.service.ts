import { axiosPrivate } from "~/axiosAuth";
import {
  IArrayDataSuccessResponse,
  IPaginatedResponse,
  IPayout,
} from "~/types";
import { PayoutStatus } from "~/types/payout.types";

/**
 * @description (Admin) Lấy danh sách các yêu cầu rút tiền.
 * @route   GET /api/payout
 * @param   {Object} params - Các tham số để lọc và phân trang.
 * @param   {PayoutStatus} params.status - Trạng thái của yêu cầu (PENDING, APPROVED, DECLINED).
 * @param   {number} params.page - Số trang.
 * @param   {number} params.limit - Số lượng mục trên mỗi trang.
 * @returns {Promise<IPaginatedResponse<IPayout>>} - Dữ liệu yêu cầu rút tiền đã được phân trang.
 */
const getPayouts = async ({
  status,
  page,
  limit,
}: {
  status: PayoutStatus;
  page: number;
  limit: number;
}): Promise<IPaginatedResponse<IPayout>> => {
  const { data } = await axiosPrivate.get("/payout", {
    params: { status, page, limit },
  });
  return data;
};

/**
 * @description (Admin) Phê duyệt một yêu cầu rút tiền.
 * @route   POST /api/payout/:payoutId/approve
 * @param   {string} payoutId - ID của yêu cầu rút tiền.
 * @returns {Promise<IArrayDataSuccessResponse<IPayout>>} - Phản hồi từ server chứa payout đã được cập nhật.
 */
const approvePayout = async (
  payoutId: string,
): Promise<IArrayDataSuccessResponse<IPayout>> => {
  const { data } = await axiosPrivate.post(`/payout/${payoutId}/approve`);
  return data;
};

/**
 * @description (Admin) Từ chối một yêu cầu rút tiền.
 * @route   POST /api/payout/:payoutId/decline
 * @param   {string} payoutId - ID của yêu cầu rút tiền.
 * @returns {Promise<IArrayDataSuccessResponse<IPayout>>} - Phản hồi từ server chứa payout đã được cập nhật.
 */
const declinePayout = async (
  payoutId: string,
): Promise<IArrayDataSuccessResponse<IPayout>> => {
  const { data } = await axiosPrivate.post(`/payout/${payoutId}/decline`);
  return data;
};

/**
 * @description (Partner) Tạo một yêu cầu rút tiền mới.
 * @route   POST /api/payout/request
 * @param   {number} amount - Số tiền muốn rút.
 * @returns {Promise<IArrayDataSuccessResponse<IPayout>>} - Phản hồi từ server chứa payout vừa được tạo.
 */
const createPayoutRequest = async (
  amount: number,
): Promise<IArrayDataSuccessResponse<IPayout>> => {
  const { data } = await axiosPrivate.post("/payout/request", { amount });
  return data;
};

export const payoutService = {
  getPayouts,
  approvePayout,
  declinePayout,
  createPayoutRequest,
};
