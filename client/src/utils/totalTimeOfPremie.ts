interface MatchRule {
  start: number;
  end: number;
  bonus: number;
}

export const totalTimeOfPremie = (
  startingPoint: number,
  endingPoint: number,
) => {
  const totalTimePerMatch: number = 40;
  const matchRules: MatchRule[] = [
    {
      start: 1000,
      end: 4999,
      bonus: 500,
    },
    {
      start: 5000,
      end: 9999,
      bonus: 500,
    },
    {
      start: 10000,
      end: 14999,
      bonus: 400,
    },
    {
      start: 15000,
      end: 19999,
      bonus: 300,
    },
    {
      start: 20000,
      end: 24999,
      bonus: 200,
    },
    {
      start: 25000,
      end: 29999,
      bonus: 100,
    },
    {
      start: 30000,
      end: 32000,
      bonus: 50,
    },
  ];

  let totalTime = 0;
  let currentScore = startingPoint;

  while (currentScore <= endingPoint) {
    let ruleApplied = false;

    for (const rule of matchRules) {
      if (currentScore >= rule.start && currentScore <= rule.end) {
        totalTime += totalTimePerMatch;
        currentScore += rule.bonus;
        ruleApplied = true;
        break;
      }
    }

    if (!ruleApplied) {
      totalTime += totalTimePerMatch;
      currentScore += 0;
    }
  }

  return totalTime;
};
