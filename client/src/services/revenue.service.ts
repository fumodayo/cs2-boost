import { axiosPrivate } from "~/axiosAuth";
import {
  IChartDataPoint,
  IDashboardStats,
  IPaginatedResponse,
  ITransaction,
} from "~/types";

/**
 * @description (Admin) Lấy dữ liệu doanh thu theo ngày để vẽ biểu đồ.
 * @route   GET /api/revenue/chart-data
 * @param   {number} [days=30] - Số ngày cần lấy dữ liệu.
 * @returns {Promise<IChartDataPoint[]>} - Một mảng các điểm dữ liệu cho biểu đồ.
 */
const getRevenueChartData = async (
  days: number = 30,
): Promise<IChartDataPoint[]> => {
  const { data } = await axiosPrivate.get("/revenue/chart-data", {
    params: { days },
  });
  return data.data;
};

/** @route GET /api/revenue/statistics */ /**
 * @description (Admin) Lấy các chỉ số thống kê chính cho dashboard.
 * @route   GET /api/revenue/statistics
 * @returns {Promise<IDashboardStats>} - Đối tượng chứa các chỉ số KPI và mô tả.
 */
const getDashboardStatistics = async (): Promise<IDashboardStats> => {
  const { data } = await axiosPrivate.get("/revenue/statistics");
  return data.data;
};

/**
 * @description (Admin) Lấy danh sách tất cả giao dịch với chức năng phân trang, lọc và tìm kiếm.
 * @route   GET /api/revenue/transactions
 * @param   {URLSearchParams} params - Các tham số truy vấn (page, limit, sort, search, userId, type).
 * @returns {Promise<IPaginatedResponse<ITransaction>>} - Dữ liệu giao dịch đã được phân trang.
 */
const getTransactions = async (
  params: URLSearchParams,
): Promise<IPaginatedResponse<ITransaction>> => {
  const { data } = await axiosPrivate.get("/revenue/transactions", { params });
  return data;
};

export const revenueService = {
  getRevenueChartData,
  getDashboardStatistics,
  getTransactions,
};
