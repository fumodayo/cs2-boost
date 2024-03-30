export const formatMoney = (currency?: string, money?: number) => {
  if (money && currency) {
    const cur = currency === "usd" ? "$" : "₫ ";

    return `${cur} ${money.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return -1;
};
