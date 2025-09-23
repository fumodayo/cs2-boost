import { axiosInstance, axiosPrivate } from "~/axiosAuth";
import {
  ISendReviewPayload,
  IPaginatedResponse,
  IReview,
  IDataSuccessResponse,
  ISuccessResponse,
} from "~/types";

/**
 * @description Lấy danh sách đánh giá của một người dùng theo username (đã phân trang).
 * @route   GET /api/review/user/:username
 * @param   {string} username - Tên người dùng cần lấy đánh giá.
 * @param   {URLSearchParams} params - Các tham số truy vấn để phân trang (ví dụ: `page=1&perPage=5`).
 * @returns {Promise<IPaginatedResponse<IReview>>} - Dữ liệu đánh giá đã được phân trang.
 */
const getReviewsByUsername = async (
  username: string,
  params: URLSearchParams,
): Promise<IPaginatedResponse<IReview>> => {
  const { data } = await axiosInstance.get(`/review/user/${username}`, {
    params,
  });
  return data;
};

/**
 * @description Gửi một bài đánh giá mới cho một đơn hàng.
 * @route   POST /api/review
 * @param   {ISendReviewPayload} payload - Dữ liệu của bài đánh giá.
 * @returns {Promise<IDataSuccessResponse<IReview>>} - Phản hồi từ server chứa review vừa tạo.
 */
const sendReview = async (
  payload: ISendReviewPayload,
): Promise<IDataSuccessResponse<IReview>> => {
  const { data } = await axiosPrivate.post("/review", payload);
  return data;
};

/**
 * @description Xóa một bài đánh giá đã gửi.
 * @route   DELETE /api/review/:reviewId
 * @param   {string} reviewId - ID của bài đánh giá cần xóa.
 * @returns {Promise<IDataSuccessResponse<IReview>>} - Phản hồi thông báo thành công hoặc thất bại.
 */
const deleteReview = async (reviewId: string): Promise<ISuccessResponse> => {
  console.log({ reviewId });
  const { data } = await axiosPrivate.delete(`/review/${reviewId}`);
  return data;
};

export const reviewService = {
  getReviewsByUsername,
  sendReview,
  deleteReview,
};
