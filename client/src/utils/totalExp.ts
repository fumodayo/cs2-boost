export const totalExp = (startPoint: number, endPoint: number) => {
  let totalExp = 0;

  const expPerMatch = 60;
  const timePerMatch = 5;

  const approximateGainedXp = [
    { start: 0, end: 4499, bonus: 4 },
    { start: 4500, end: 7499, bonus: 2 },
    { start: 7500, end: 11166, bonus: 1 },
    { start: 11167, end: 15000, bonus: 0.175 },
  ];

  for (const range of approximateGainedXp) {
    if (startPoint <= range.end && endPoint >= range.start) {
      const effectiveStart = Math.max(startPoint, range.start);
      const effectiveEnd = Math.min(endPoint, range.end);
      const expInRange =
        (effectiveEnd - effectiveStart + 1) * (range.bonus + 1);
      totalExp += expInRange;
    }
  }

  return Math.round((totalExp / expPerMatch) * timePerMatch);
};
