type ITimeOfWingman = {
  beginRank: string;
  endRank: string;
};

const timeOfWingman = ({ beginRank, endRank }: ITimeOfWingman) => {
  const bonusPerRank = [
    {
      name: "silver_1",
      bonus: 1,
    },
    {
      name: "silver_2",
      bonus: 1,
    },
    {
      name: "silver_3",
      bonus: 1,
    },
    {
      name: "silver_4",
      bonus: 1,
    },
    {
      name: "silver_elite",
      bonus: 1,
    },
    {
      name: "silver_elite_master",
      bonus: 1,
    },
    {
      name: "glob_nova_1",
      bonus: 1,
    },
    {
      name: "glob_nova_2",
      bonus: 1,
    },
    {
      name: "glob_nova_3",
      bonus: 1,
    },
    {
      name: "glob_nova_master",
      bonus: 1,
    },
    {
      name: "master_guardian_1",
      bonus: 2,
    },
    {
      name: "master_guardian_2",
      bonus: 2,
    },
    {
      name: "master_guardian_elite",
      bonus: 2,
    },
    {
      name: "distinguished_master_guardian",
      bonus: 3,
    },
    {
      name: "legendary_eagle",
      bonus: 4,
    },
    {
      name: "legendary_eagle_master",
      bonus: 5,
    },
    {
      name: "supreme",
      bonus: 6,
    },
    {
      name: "global_elite",
      bonus: 8,
    },
  ];

  let totalTime = 0;
  const totalTimePerMatch = 40;

  const currentIdx = bonusPerRank.findIndex((r) => r.name === beginRank);

  const desiredIdx = bonusPerRank.findIndex((r) => r.name === endRank);

  const currentBonus = bonusPerRank
    .slice(0, currentIdx + 1)
    .reduce((sum, rank) => sum + rank.bonus, 0);

  const desiredBonus = bonusPerRank
    .slice(0, desiredIdx + 1)
    .reduce((sum, rank) => sum + rank.bonus, 0);

  totalTime = (desiredBonus - currentBonus) * totalTimePerMatch;
  return totalTime > 0 ? totalTime : -1;
};

export default timeOfWingman;
