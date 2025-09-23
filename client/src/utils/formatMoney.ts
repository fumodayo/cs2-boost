/**
 * Định dạng một số thành chuỗi tiền tệ theo chuẩn quốc tế.
 * Tự động xử lý ký hiệu, vị trí, dấu phân cách và số thập phân.
 *
 * @param money
 * @param currency - Mã tiền tệ theo chuẩn ISO 4217 ('USD' hoặc 'VND'). Mặc định là 'VND'.
 * @returns Chuỗi tiền tệ đã được định dạng (ví dụ: "$1,234.56" hoặc "1.234.567 ₫").
 */
const formatMoney = (
  money: number = 0,
  currency: "usd" | "vnd" = "vnd",
): string => {
  const locale = currency === "usd" ? "en-US" : "vi-VN";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(money);
  } catch (error) {
    console.error("Error formatting money:", error);
    return `${currency} ${money}`;
  }
};

export default formatMoney;
