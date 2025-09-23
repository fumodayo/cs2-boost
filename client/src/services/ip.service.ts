import { axiosInstance } from "~/axiosAuth";
import { IIpLocation } from "~/types";

/**
 * Lấy thông tin vị trí dựa trên địa chỉ IP của client.
 * @returns Promise chứa dữ liệu vị trí.
 */
export const getIpLocation = async (): Promise<IIpLocation> => {
  const { data } = await axiosInstance.get("/utils/ip-location");
  return data;
};
