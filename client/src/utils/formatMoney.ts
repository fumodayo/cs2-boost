const formatMoney = (money?: number, currency: string = "vnd") => {
  const cur = currency === "usd" ? "$" : "vnđ";

  if (money) {
    return `${cur} ${money.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${cur} 0`;
};

export default formatMoney;
