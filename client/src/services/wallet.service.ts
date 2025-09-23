import { axiosPrivate } from "~/axiosAuth";
import { IPartnerWalletStatsResponse } from "~/types";

/**
 * @description (Partner) Lấy tất cả thống kê tài chính và các giao dịch gần đây của partner.
 * @route   GET /api/wallets/me/stats
 * @returns {Promise<IPartnerWalletStatsResponse>} - Đối tượng chứa thông tin ví và các giao dịch gần đây.
 */
const getMyWalletStats = async (): Promise<IPartnerWalletStatsResponse> => {
  const { data } = await axiosPrivate.get("/wallet/me/stats");
  return data.data;
};

export const walletService = {
  getMyWalletStats,
};
