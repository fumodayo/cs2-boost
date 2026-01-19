import { axiosPrivate } from "~/axiosAuth";
import {
  ISendReportPayload,
  IReport,
  IDataSuccessResponse,
  ReportStatus,
} from "~/types";

/**
 * @description Gửi một báo cáo mới về một người dùng khác.
 * @route   POST /api/reports
 * @param   {ISendReportPayload} payload - Dữ liệu của báo cáo.
 * @returns {Promise<IDataSuccessResponse<IReport>>} - Phản hồi từ server.
 */
const sendReport = async (
  payload: ISendReportPayload,
): Promise<IDataSuccessResponse<IReport>> => {
  const { data } = await axiosPrivate.post("/report", payload);
  return data;
};

/**
 * @description Lấy danh sách các báo cáo liên quan đến người dùng hiện tại.
 * @route   GET /api/report/me
 * @returns {Promise<IReport[]>} - Một mảng các báo cáo.
 */
const getMyReports = async (): Promise<IReport[]> => {
  const { data } = await axiosPrivate.get("/report/me");
  return data.data;
};

/**
 * @description (Admin) Lấy danh sách tất cả báo cáo trong hệ thống.
 * @route   GET /api/report
 * @param   {ReportStatus} [status] - (Tùy chọn) Lọc báo cáo theo trạng thái.
 * @returns {Promise<IReport[]>} - Một mảng các báo cáo.
 */
const getReports = async (status?: ReportStatus): Promise<IReport[]> => {
  const params = status ? { status } : {};
  const { data } = await axiosPrivate.get("/report", { params });
  return data.data;
};

/**
 * @description (Admin) Tiếp nhận một báo cáo để xử lý.
 * @route   PATCH /api/report/:reportId/accept
 * @param   {string} reportId - ID của báo cáo cần tiếp nhận.
 * @returns {Promise<IReport>} - Phản hồi từ server chứa báo cáo đã được cập nhật.
 */
const acceptReport = async (reportId: string): Promise<IReport> => {
  const { data } = await axiosPrivate.patch(`/report/${reportId}/accept`);
  return data.data;
};

/**
 * @description (Admin) Đóng (giải quyết) một báo cáo.
 * @route   PATCH /api/report/:reportId/resolve
 * @param   {string} reportId - ID của báo cáo cần giải quyết.
 * @returns {Promise<IReport>} - Phản hồi từ server chứa báo cáo đã được cập nhật.
 */
const resolveReport = async (reportId: string): Promise<IReport> => {
  const { data } = await axiosPrivate.patch(`/report/${reportId}/resolve`);
  return data;
};

/**
 * @description Kiểm tra xem user đã report cho một order cụ thể chưa.
 * @route   GET /api/report/check-order/:orderId
 * @param   {string} orderId - ID của order cần kiểm tra.
 * @returns {Promise<boolean>} - true nếu đã report, false nếu chưa.
 */
const checkOrderReport = async (orderId: string): Promise<boolean> => {
  const { data } = await axiosPrivate.get(`/report/check-order/${orderId}`);
  return data.hasReported;
};

/**
 * @description (Admin) Từ chối một báo cáo không hợp lệ.
 * @route   PATCH /api/report/:reportId/reject
 * @param   {string} reportId - ID của báo cáo cần từ chối.
 * @param   {string} resolution - Lý do từ chối báo cáo.
 * @returns {Promise<IReport>} - Phản hồi từ server chứa báo cáo đã được cập nhật.
 */
const rejectReport = async (
  reportId: string,
  resolution: string,
): Promise<IReport> => {
  const { data } = await axiosPrivate.patch(`/report/${reportId}/reject`, {
    resolution,
  });
  return data.data;
};

/**
 * @description (Admin) Đánh dấu report đã đọc.
 * @route   PATCH /api/report/:reportId/mark-read
 * @param   {string} reportId - ID của báo cáo.
 * @returns {Promise<IReport>} - Phản hồi từ server.
 */
const markReportAsRead = async (reportId: string): Promise<IReport> => {
  const { data } = await axiosPrivate.patch(`/report/${reportId}/mark-read`);
  return data.data;
};

export const reportService = {
  sendReport,
  getMyReports,
  getReports,
  acceptReport,
  resolveReport,
  rejectReport,
  checkOrderReport,
  markReportAsRead,
};
