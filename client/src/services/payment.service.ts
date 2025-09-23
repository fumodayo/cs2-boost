import { axiosPrivate } from "~/axiosAuth";
import { ICreateVnPayUrlPayload, IDirectResponse, IVnPayReturn } from "~/types";

/**
 * @description Yêu cầu backend tạo một URL thanh toán VNPay.
 *              Sau khi nhận được URL, client sẽ chuyển hướng người dùng đến đó.
 * @route   POST /api/vnpay/create-payment-url
 * @param   {ICreateVnPayUrlPayload} payload - Dữ liệu cần thiết để tạo URL (số tiền, thông tin đơn hàng).
 * @returns {Promise<IDirectResponse>} - Phản hồi chứa URL thanh toán để chuyển hướng.
 */
const createPaymentUrl = async (
  payload: ICreateVnPayUrlPayload,
): Promise<IDirectResponse> => {
  const { data } = await axiosPrivate.post(
    "/vn-pay/create-payment-url",
    payload,
  );
  return data;
};

/**
 * @desc Xử lý URL trả về từ VNPay để xác thực giao dịch.
 * @param returnUrlQuery Phần query string của URL trả về từ VNPay (bắt đầu bằng '?').
 */
const verifyVnPayReturn = async (
  returnUrlQuery: string,
): Promise<IVnPayReturn> => {
  const { data } = await axiosPrivate.get(
    `/vn-pay/bill-return${returnUrlQuery}`,
  );
  return data;
};

export { createPaymentUrl, verifyVnPayReturn };
