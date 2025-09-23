import { axiosPrivate } from "~/axiosAuth";
import { IDataSuccessResponse, IPaginatedResponse, IReceipt } from "~/types";

/**
 * @description Tạo hóa đơn sau khi một đơn hàng đã được thanh toán thành công.
 * @route   POST /api/receipts
 * @param   {string} boost_id - ID của đơn hàng (`boost_id`) vừa được thanh toán.
 * @returns {Promise<IDataSuccessResponse<IReceipt>>} - Phản hồi từ server chứa hóa đơn vừa tạo.
 */
const createReceipt = async (
  boost_id: string,
): Promise<IDataSuccessResponse<IReceipt>> => {
  const { data } = await axiosPrivate.post("/receipts", { boost_id });
  return data;
};

/**
 * @description Lấy danh sách hóa đơn của người dùng hiện tại (đã phân trang).
 * @route   GET /api/receipts
 * @param   {URLSearchParams} params - Các tham số truy vấn để tìm kiếm và phân trang (ví dụ: `page=1&perPage=10`).
 * @returns {Promise<IPaginatedResponse<IReceipt>>} - Dữ liệu hóa đơn đã được phân trang.
 */
const getReceipts = async (
  params: URLSearchParams,
): Promise<IPaginatedResponse<IReceipt>> => {
  const { data } = await axiosPrivate.get("/receipts", { params });
  return data;
};

export const receiptService = {
  createReceipt,
  getReceipts,
};
