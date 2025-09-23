import { IPremierRegionRates } from "~/types";

const calculatePremierCost = (
  beginRating: number,
  endRating: number,
  unitPrice: number,
  rates: IPremierRegionRates["rates"],
): number => {
  if (endRating <= beginRating) return 0;

  let totalCost = 0;
  const sortedRates = [...rates].sort((a, b) => a.start - b.start);

  for (const tier of sortedRates) {
    const effectiveStart = Math.max(beginRating, tier.start);
    const effectiveEnd = Math.min(endRating, tier.end);

    if (effectiveEnd > effectiveStart) {
      const pointsInTier = effectiveEnd - effectiveStart;
      totalCost += pointsInTier * tier.rate * unitPrice;
    }
  }
  return totalCost;
};

export default calculatePremierCost;
