import { axiosInstance, axiosPrivate } from "~/axiosAuth";
import {
  ILevelFarmingConfig,
  IPremierRatesConfig,
  IUpdateRegionRatesPayload,
  IUpdateWingmanRegionPayload,
  IWingmanRatesConfig,
  ISuccessResponse,
  IUpdateUnitPricePayload,
} from "~/types";

/**
 * @description Lấy cấu hình giá Premier.
 * @route   GET /api/rates/premier
 * @returns {Promise<IPremierRatesConfig>} - Toàn bộ đối tượng cấu hình giá Premier.
 */
const getPremierRates = async (): Promise<IPremierRatesConfig> => {
  const { data } = await axiosInstance.get("/rates/premier");
  return data.data;
};

/**
 * @description (Admin) Cập nhật bảng giá cho một khu vực của Premier.
 * @route   PUT /api/rates/premier/regions/:regionValue
 * @param   {string} regionValue - Giá trị của khu vực cần cập nhật (ví dụ: 'vn', 'us').
 * @param   {IUpdateRegionRatesPayload} payload - Mảng `rates` mới.
 * @returns {Promise<ISuccessResponse>} - Phản hồi từ server.
 */
const updatePremierRatesForRegion = async (
  regionValue: string,
  payload: IUpdateRegionRatesPayload,
): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.put(
    `/rates/premier/regions/${regionValue}`,
    payload,
  );
  return data;
};

/**
 * @description (Admin) Cập nhật cấu hình chung của Premier.
 * @route   PATCH /api/rates/premier/config
 * @param   {IUpdateUnitPricePayload} payload - Dữ liệu cấu hình mới (ví dụ: `{ unitPrice: 10 }`).
 * @returns {Promise<ISuccessResponse & { data: { unitPrice: number } }>} - Phản hồi từ server chứa cấu hình đã cập nhật.
 */
const updatePremierConfig = async (
  payload: IUpdateUnitPricePayload,
): Promise<ISuccessResponse & { data: { unitPrice: number } }> => {
  const { data } = await axiosPrivate.patch(
    "/rates/premier/config",
    payload,
  );
  console.log({ data });
  return data;
};

/**
 * @description Lấy cấu hình giá Wingman.
 * @route   GET /api/rates/wingman
 * @returns {IWingmanRatesConfig} - Toàn bộ đối tượng cấu hình giá Wingman.
 */
const getWingmanRates = async (): Promise<IWingmanRatesConfig> => {
  const { data } = await axiosInstance.get("/rates/wingman");
  return data.data;
};

/**
 * @description (Admin) Cập nhật bảng giá cho một khu vực của Wingman.
 * @route   PUT /api/rates/wingman/regions/:regionValue
 * @param   {string} regionValue - Giá trị của khu vực cần cập nhật.
 * @param   {IUpdateWingmanRegionPayload} payload - Mảng `rates` mới.
 * @returns {Promise<{ success: boolean; message: string; }>} - Phản hồi từ server.
 */
const updateWingmanRatesForRegion = async (
  regionValue: string,
  payload: IUpdateWingmanRegionPayload,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await axiosPrivate.put(
    `/rates/wingman/regions/${regionValue}`,
    payload,
  );
  return data;
};

/**
 * @description (Admin) Cập nhật cấu hình chung của Wingman.
 * @route   PATCH /api/rates/wingman/config
 * @param   {IUpdateUnitPricePayload} payload - Dữ liệu cấu hình mới.
 * @returns {Promise<ISuccessResponse & { data: { unitPrice: number } }>} - Phản hồi từ server chứa cấu hình đã cập nhật.
 */
const updateWingmanConfig = async (
  payload: IUpdateUnitPricePayload,
): Promise<ISuccessResponse & { data: { unitPrice: number } }> => {
  const { data } = await axiosPrivate.patch("/rates/wingman/config", payload);
  return data;
};

/**
 * @description Lấy cấu hình giá Level Farming.
 * @route   GET /api/rates/level-farming
 * @returns {Promise<ILevelFarmingConfig>} - Đối tượng cấu hình giá Level Farming.
 */
const getLevelFarmingConfig = async (): Promise<ILevelFarmingConfig> => {
  const { data } = await axiosInstance.get("/rates/level-farming");
  return data.data;
};

/**
 * @description (Admin) Cập nhật cấu hình giá Level Farming.
 * @route   PATCH /api/rates/level-farming/config
 * @param   {IUpdateUnitPricePayload} payload - Dữ liệu cấu hình mới.
 * @returns {Promise<ISuccessResponse &{ data: ILevelFarmingConfig }>} - Phản hồi từ server chứa cấu hình đã cập nhật.
 */
const updateLevelFarmingConfig = async (
  payload: IUpdateUnitPricePayload,
): Promise<ISuccessResponse & { data: ILevelFarmingConfig }> => {
  const { data } = await axiosPrivate.patch(
    "/rates/level-farming/config",
    payload,
  );
  return data;
};

export const rateService = {
  getPremierRates,
  updatePremierRatesForRegion,
  updatePremierConfig,
  getWingmanRates,
  updateWingmanRatesForRegion,
  updateWingmanConfig,
  getLevelFarmingConfig,
  updateLevelFarmingConfig,
};
