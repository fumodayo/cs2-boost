import { IWingmanRegionRates } from "~/types";

const calculateWingmanCost = (
  beginRankCode: string,
  endRankCode: string,
  unitPrice: number,
  ranks: IWingmanRegionRates["rates"],
): number => {
  const beginIndex = ranks.findIndex((r) => r.code === beginRankCode);
  const endIndex = ranks.findIndex((r) => r.code === endRankCode);

  if (beginIndex === -1 || endIndex === -1 || endIndex <= beginIndex) {
    return 0;
  }

  let totalRate = 0;
  for (let i = beginIndex; i < endIndex; i++) {
    totalRate += ranks[i].rate;
  }

  return totalRate * unitPrice;
};

export default calculateWingmanCost;
