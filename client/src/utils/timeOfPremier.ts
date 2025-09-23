type ITimeOfPremier = {
  beginRating: number;
  endRating: number;
};

const timeOfPremier = ({ beginRating, endRating }: ITimeOfPremier): number => {
  const totalTimePerMatch = 40;

  const bonusPerMatch = [
    { start: 1000, end: 4999, bonus: 500 },
    { start: 5000, end: 9999, bonus: 500 },
    { start: 10000, end: 14999, bonus: 400 },
    { start: 15000, end: 19999, bonus: 300 },
    { start: 20000, end: 24999, bonus: 200 },
    { start: 25000, end: 29999, bonus: 100 },
    { start: 30000, end: 32000, bonus: 50 },
  ];

  let totalTime = 0;

  for (const tier of bonusPerMatch) {
    if (endRating <= tier.start || beginRating >= tier.end) {
      continue;
    }

    const effectiveStart = Math.max(beginRating, tier.start);
    const effectiveEnd = Math.min(endRating, tier.end);
    const pointsToGain = effectiveEnd - effectiveStart;

    if (pointsToGain > 0 && tier.bonus > 0) {
      const matches = Math.ceil(pointsToGain / tier.bonus);
      totalTime += matches * totalTimePerMatch;
    }
  }

  return totalTime > 0 ? totalTime : -1;
};

export default timeOfPremier;
