type IRateLevelFarming = {
  beginExp: number;
  endExp: number;
};

const calculateLevelFarmingCost = ({ beginExp, endExp }: IRateLevelFarming) => {
  let totalEXP = 0;

  const EXPPerMatch = 60;

  const timePerMatch = 0.5;

  const approximateGainedEXP = [
    { start: 0, end: 4499, bonus: 4 },
    { start: 4500, end: 7499, bonus: 2 },
    { start: 7500, end: 11166, bonus: 1 },
    { start: 11167, end: 15000, bonus: 0.175 },
  ];

  for (const range of approximateGainedEXP) {
    if (beginExp <= range.end && endExp >= range.start) {
      const effectiveBegin = Math.max(beginExp, range.start);
      const effectiveEnd = Math.min(endExp, range.end);

      const EXPInRange =
        (effectiveEnd - effectiveBegin + 1) * (range.bonus + 1);

      totalEXP += EXPInRange;
    }
  }

  const totalTime = Math.round(totalEXP / EXPPerMatch) * timePerMatch;
  return totalTime > 0 ? totalTime : -1;
};

export default calculateLevelFarmingCost;
