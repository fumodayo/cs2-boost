import useSWR from "swr";
import axios from "axios";

const rateFetcher = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    throw new Error("Could not fetch exchange rate.");
  }
};

/**
 * Custom hook sử dụng SWR để lấy và cache tỷ giá hối đoái.
 *
 * @param fromCurrency - Mã tiền tệ gốc (ví dụ: 'usd').
 * @param toCurrency - Mã tiền tệ muốn đổi sang (ví dụ: 'vnd').
 * @returns Tỷ giá hối đoái, hoặc undefined nếu đang tải hoặc có lỗi.
 */
const useExchangeRate = (
  fromCurrency: string = "usd",
  toCurrency: string = "vnd",
) => {
  const apiKey = `https://latest.currency-api.pages.dev/v1/currencies/${fromCurrency}.json`;

  const { data, error } = useSWR(apiKey, rateFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });

  if (
    error ||
    !data ||
    !data[fromCurrency] ||
    !data[fromCurrency][toCurrency]
  ) {
    return undefined;
  }

  return data[fromCurrency][toCurrency] as number | undefined;
};

export default useExchangeRate;
