export const totalTimeOfWingman = (
  currentRank: string,
  desiredRank: string,
): number => {
  const matchRules = [
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
  const totalTimePerMatch: number = 40;

  // Lấy index của currentRank và desiredRank trong mảng matchRules
  const currentIndex = matchRules.findIndex(
    (rank) => rank.name === currentRank,
  );
  const desiredIndex = matchRules.findIndex(
    (rank) => rank.name === desiredRank,
  );

  // Tính toán giá trị dựa trên bonus
  const currentBonus = matchRules
    .slice(0, currentIndex + 1)
    .reduce((sum, rank) => sum + rank.bonus, 0);

  const desiredBonus = matchRules
    .slice(0, desiredIndex + 1)
    .reduce((sum, rank) => sum + rank.bonus, 0);

  // Tính toán tổng chi phí dựa trên công thức đã cung cấp
  totalTime = (desiredBonus - currentBonus) * totalTimePerMatch;

  return totalTime;
};
